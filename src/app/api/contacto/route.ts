import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const DESTINO = "agustinvignau729@gmail.com";
const SITIO = "https://www.agustinvignau.com";

function texto(valor: unknown, max: number) {
  if (typeof valor !== "string") return "";
  return valor.trim().slice(0, max);
}

/**
 * El único lugar que habla con Resend. Nunca tira: un mail que no sale es un
 * aviso perdido, no una operación fallida. El lead ya está guardado antes de
 * que esto corra.
 */
async function enviarMail(clave: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
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

  // 1. Guardar el lead. Si esto falla, el mensaje se pierde: es lo que avisamos.
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      name,
      email,
      company: company || null,
      message,
      source: en ? "web-en" : "web",
    });
    if (error) {
      return NextResponse.json(
        { error: "No se pudo registrar el mensaje. Escribime por mail." },
        { status: 500 },
      );
    }
  }

  /*
    2. Los dos mails. El primero me avisa a mí; el segundo le confirma a quien
       escribió que el mensaje llegó — la web promete respuesta en 48 horas y
       hasta ahora esa promesa no tenía ningún acuse detrás.

       Si todavía no hay clave configurada, el lead igual quedó guardado, así
       que la respuesta sigue siendo un éxito. Ojo: mientras el remitente sea
       el de prueba de Resend, el acuse al visitante no se entrega. Hace falta
       el dominio verificado.
  */
  const clave = process.env.RESEND_API_KEY;
  const remitente = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  if (clave) {
    const aviso = enviarMail(clave, {
      from: `Portfolio <${remitente}>`,
      to: [DESTINO],
      reply_to: email,
      subject: `Consulta de ${name}${company ? ` (${company})` : ""}`,
      text: `${name} <${email}>${company ? `\nEmpresa: ${company}` : ""}\n\n${message}`,
    });

    const acuse = enviarMail(clave, {
      from: `Agustín Vignau <${remitente}>`,
      to: [email],
      reply_to: DESTINO,
      subject: en ? "I got your message" : "Recibí tu mensaje",
      text: en
        ? `Hi ${name},\n\nYour message reached me. I reply within 48 hours — this is just the confirmation, written automatically.\n\nA copy of what you sent:\n\n${message}\n\n—\nAgustín Vignau\n${SITIO}`
        : `Hola ${name}:\n\nTu mensaje llegó. Te respondo dentro de las próximas 48 horas — esto es sólo la confirmación, escrita automáticamente.\n\nTe dejo una copia de lo que mandaste:\n\n${message}\n\n—\nAgustín Vignau\n${SITIO}`,
    });

    await Promise.allSettled([aviso, acuse]);
  }

  return NextResponse.json({ ok: true });
}
