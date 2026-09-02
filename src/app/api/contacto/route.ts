import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const DESTINO = "agustinvignau729@gmail.com";
const SITIO = "https://www.agustinvignau.com";

/*
  No es un secreto y no pretende serlo: es un pimiento para que en la base no
  queden direcciones IP en claro. Alcanza para contar envíos de un mismo
  origen, que es lo único para lo que se usa.
*/
const PIMIENTO = "portfolio-vignau-contacto";

function texto(valor: unknown, max: number) {
  if (typeof valor !== "string") return "";
  return valor.trim().slice(0, max);
}

/** La IP real viene en la cabecera que pone el proxy de Vercel, no en la conexión. */
function ipDelPedido(request: Request) {
  const reenviada = request.headers.get("x-forwarded-for");
  if (reenviada) return reenviada.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "";
}

async function hashear(valor: string) {
  if (!valor) return null;
  const datos = new TextEncoder().encode(`${PIMIENTO}:${valor}`);
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Señales de mensaje sospechoso. Deliberadamente pocas y conservadoras: un
 * falso positivo acá es una consulta real que no recibe respuesta, que es
 * peor que dejar pasar un spam. Nada se descarta: se marca.
 */
function revisar(name: string, message: string) {
  const enlaces = (message.match(/https?:\/\//gi) ?? []).length;
  if (/https?:\/\//i.test(name)) return "enlace en el nombre";
  if (enlaces >= 3) return `${enlaces} enlaces en el mensaje`;
  return null;
}

/**
 * El único lugar que habla con Resend. Nunca tira: un mail que no sale es un
 * aviso perdido, no una operación fallida. El lead ya está guardado antes de
 * que esto corra.
 *
 * Pero fallar en silencio deja sin diagnóstico: si el mail no llega no hay
 * forma de saber si fue la clave, el remitente o la red. Por eso el error se
 * escribe en los logs, que es donde hay que ir a mirarlo.
 */
async function enviarMail(
  clave: string,
  etiqueta: string,
  payload: Record<string, unknown>,
) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detalle = await res.text().catch(() => "");
      console.error(
        `[contacto] Resend rechazó el mail "${etiqueta}": ${res.status} ${detalle}`,
      );
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[contacto] No se pudo llamar a Resend para "${etiqueta}":`, e);
    return false;
  }
}

export async function POST(request: Request) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  // La trampa para bots: si viene completa, cortamos sin decir por qué.
  if (texto(cuerpo.website, 10).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = texto(cuerpo.name, 120);
  const email = texto(cuerpo.email, 160);
  const company = texto(cuerpo.company, 120);
  const message = texto(cuerpo.message, 4000);
  const en = texto(cuerpo.lang, 2) === "en";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Faltan el nombre, el mail o el mensaje." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: "Ese mail no parece válido." },
      { status: 400 },
    );
  }

  const supabase = getSupabase();
  const ipHash = await hashear(ipDelPedido(request));

  /*
    1. Límite de envíos. La cuenta la hace la base con una función propia,
       porque la clave pública no puede leer `leads` — y está bien que no
       pueda. La función devuelve un permiso, no datos.

       El límite por dirección de destino es el que importa: sin él, el acuse
       de recibo convierte este formulario en una máquina de mandarle mails a
       un tercero desde tu dominio.
  */
  if (supabase) {
    const { data: permiso } = await supabase.rpc("contacto_puede_enviar", {
      p_ip_hash: ipHash,
      p_email: email,
    });

    const veredicto = permiso as { permitido: boolean; motivo: string } | null;
    if (veredicto && !veredicto.permitido) {
      console.warn(`[contacto] Envío frenado por límite (${veredicto.motivo}).`);
      return NextResponse.json(
        {
          error: en
            ? "That is a few messages in a short time. Wait an hour, or write straight to agustinvignau729@gmail.com."
            : "Son varios mensajes en poco rato. Esperá una hora, o escribime directo a agustinvignau729@gmail.com.",
        },
        { status: 429 },
      );
    }
  }

  // 2. Guardar el lead. Si esto falla, el mensaje se pierde: es lo que avisamos.
  const sospecha = revisar(name, message);

  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      name,
      email,
      company: company || null,
      message,
      source: en ? "web-en" : "web",
      ip_hash: ipHash,
      flagged: Boolean(sospecha),
      flag_reason: sospecha,
    });
    if (error) {
      return NextResponse.json(
        { error: "No se pudo registrar el mensaje. Escribime por mail." },
        { status: 500 },
      );
    }
  }

  /*
    3. Los mails. El aviso sale siempre — un mensaje marcado como sospechoso
       igual se lee, sólo que avisado.

       El acuse NO sale si el mensaje quedó marcado. Un mensaje sospechoso
       suele traer la dirección de otro, y contestarle es justamente el abuso
       que hay que evitar. Si fue un falso positivo, la persona recibe
       respuesta cuando Agustín le contesta a mano.

       Si todavía no hay clave configurada, el lead igual quedó guardado, así
       que la respuesta sigue siendo un éxito.
  */
  const clave = process.env.RESEND_API_KEY;
  const remitente = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  if (clave) {
    const envios = [
      enviarMail(clave, "aviso", {
        from: `Portfolio <${remitente}>`,
        to: [DESTINO],
        reply_to: email,
        subject: `${sospecha ? "[sospechoso] " : ""}Consulta de ${name}${company ? ` (${company})` : ""}`,
        text: `${name} <${email}>${company ? `\nEmpresa: ${company}` : ""}${sospecha ? `\n\n⚠ Marcado como sospechoso: ${sospecha}. No se le mandó acuse de recibo.` : ""}\n\n${message}`,
      }),
    ];

    if (!sospecha) {
      envios.push(
        enviarMail(clave, "acuse", {
          from: `Agustín Vignau <${remitente}>`,
          to: [email],
          reply_to: DESTINO,
          subject: en ? "I got your message" : "Recibí tu mensaje",
          text: en
            ? `Hi ${name},\n\nYour message reached me. I reply within 48 hours — this is just the confirmation, written automatically.\n\nA copy of what you sent:\n\n${message}\n\n—\nAgustín Vignau\n${SITIO}`
            : `Hola ${name}:\n\nTu mensaje llegó. Te respondo dentro de las próximas 48 horas — esto es sólo la confirmación, escrita automáticamente.\n\nTe dejo una copia de lo que mandaste:\n\n${message}\n\n—\nAgustín Vignau\n${SITIO}`,
        }),
      );
    }

    await Promise.allSettled(envios);
  }

  return NextResponse.json({ ok: true });
}
