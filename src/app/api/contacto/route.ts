import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const DESTINO = "agustinvignau729@gmail.com";

function texto(valor: unknown, max: number) {
  if (typeof valor !== "string") return "";
  return valor.trim().slice(0, max);
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
      source: "web",
    });
    if (error) {
      return NextResponse.json(
        { error: "No se pudo registrar el mensaje. Escribime por mail." },
        { status: 500 },
      );
    }
  }

  // 2. Avisar por mail. Si todavía no hay clave configurada, el lead ya quedó
  //    guardado, así que la respuesta sigue siendo un éxito.
  const clave = process.env.RESEND_API_KEY;
  const remitente = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  if (clave) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clave}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Portfolio <${remitente}>`,
          to: [DESTINO],
          reply_to: email,
          subject: `Consulta de ${name}${company ? ` (${company})` : ""}`,
          text: `${name} <${email}>${company ? `\nEmpresa: ${company}` : ""}\n\n${message}`,
        }),
      });
    } catch {
      // El lead ya está guardado; no rompemos la respuesta por el mail.
    }
  }

  return NextResponse.json({ ok: true });
}
