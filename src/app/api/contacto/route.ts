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
    1 y 2. Validar, limitar y guardar, en un solo paso y en la base.

       La clave pública no puede leer ni escribir `leads`: lo único que puede
       hacer es llamar a esta función, que revisa los largos, aplica el
       límite de envíos, decide si el mensaje es sospechoso y recién ahí
       guarda. Así lo que vale es lo que decide la base, también para quien
       la llame salteando este servidor.

       El límite por dirección de destino es el que importa: sin él, el acuse
       de recibo convierte este formulario en una máquina de mandarle mails a
       un tercero desde tu dominio.
  */
  let sospecha: string | null = null;

  if (supabase) {
    const { data, error } = await supabase.rpc("contacto_registrar", {
      p_name: name,
      p_email: email,
      p_company: company,
      p_message: message,
      p_source: en ? "web-en" : "web",
      p_ip_hash: ipHash,
    });

    const veredicto = data as { ok: boolean; motivo: string | null; sospecha?: string | null } | null;

    // Si esto falla, el mensaje se pierde: es lo que avisamos.
    if (error || !veredicto) {
      console.error(`[contacto] No se pudo registrar: ${error?.message ?? "sin respuesta"}`);
      return NextResponse.json(
        { error: "No se pudo registrar el mensaje. Escribime por mail." },
        { status: 500 },
      );
    }

    if (!veredicto.ok) {
      if (veredicto.motivo === "invalido") {
        return NextResponse.json(
          { error: "Faltan el nombre, el mail o el mensaje." },
          { status: 400 },
        );
      }
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

    sospecha = veredicto.sospecha ?? null;
  }

  /*
    3. Los mails. El aviso sale siempre — un mensaje marcado como sospechoso
       igual se lee, sólo que avisado.

       El acuse NO sale si el mensaje quedó marcado. Un mensaje sospechoso
       suele traer la dirección de otro, y contestarle es justamente el abuso
       que hay que evitar. Si fue un falso positivo, la persona recibe
       respuesta cuando Agustín le contesta a mano.

       El acuse no lleva el nombre ni copia del mensaje: va a una dirección
       que escribió quien llenó el formulario, y con texto ajeno adentro
       serviría para mandarle a un tercero lo que uno quiera desde este
       dominio (auditoría del 13/11, S6).

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
            ? `Hi,\n\nYour message reached me. I reply within 48 hours — this is just the confirmation, written automatically.\n\nIf you did not write to me, there is nothing you need to do.\n\n—\nAgustín Vignau\n${SITIO}`
            : `Hola:\n\nTu mensaje llegó. Te respondo dentro de las próximas 48 horas — esto es sólo la confirmación, escrita automáticamente.\n\nSi no escribiste vos, no hace falta que hagas nada.\n\n—\nAgustín Vignau\n${SITIO}`,
        }),
      );
    }

    await Promise.allSettled(envios);
  }

  return NextResponse.json({ ok: true });
}
