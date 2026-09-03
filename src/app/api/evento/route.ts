import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const PIMIENTO = "portfolio-vignau-analitica";

function texto(valor: unknown, max: number) {
  if (typeof valor !== "string") return "";
  return valor.trim().slice(0, max);
}

/**
 * Hash de IP + navegador + fecha del día. Sirve para contar visitantes únicos
 * de una jornada y deja de servir al día siguiente, porque la misma persona
 * genera otro hash. Sin cookies y sin nada persistente.
 */
async function huellaDelDia(ip: string, ua: string) {
  const hoy = new Date().toISOString().slice(0, 10);
  const datos = new TextEncoder().encode(`${PIMIENTO}:${hoy}:${ip}:${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

/** Del referido guardamos el dominio, no la URL: para qué saber más. */
function dominio(referido: string) {
  if (!referido) return null;
  try {
    const host = new URL(referido).hostname.replace(/^www\./, "");
    return host.endsWith("agustinvignau.com") ? null : host.slice(0, 80);
  } catch {
    return null;
  }
}

/*
  Los navegadores internos de las apps no mandan referido, pero sí se
  anuncian en el user-agent. Es la única forma de saber que una visita vino
  de Instagram cuando el enlace no está etiquetado.
*/
const APPS: [RegExp, string][] = [
  [/Instagram/i, "instagram (app)"],
  [/FBAN|FBAV|FB_IAB/i, "facebook (app)"],
  [/LinkedInApp/i, "linkedin (app)"],
  [/BytedanceWebview|TikTok/i, "tiktok (app)"],
  [/Twitter/i, "x (app)"],
  [/WhatsApp/i, "whatsapp"],
];

function appDeOrigen(ua: string) {
  return APPS.find(([re]) => re.test(ua))?.[1] ?? null;
}

/**
 * El origen sale de tres fuentes, en este orden: la etiqueta de la URL gana
 * porque es la que uno puso a propósito; después la app que se anuncia en el
 * user-agent; y por último el referido del navegador. Si no hay ninguna, la
 * visita es directa de verdad.
 */
function origen(utm: string, ua: string, referido: string) {
  if (utm) return utm.toLowerCase().slice(0, 40);
  return appDeOrigen(ua) ?? dominio(referido);
}

function queDispositivo(ua: string) {
  if (/bot|crawler|spider|crawling|preview|headless/i.test(ua)) return null;
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "movil";
  if (/mozilla|chrome|safari|firefox|edge/i.test(ua)) return "escritorio";
  return "otro";
}

export async function POST(request: Request) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const ua = request.headers.get("user-agent") ?? "";
  const dispositivo = queDispositivo(ua);

  // Un bot no es una visita. Se responde ok igual, para no darle señal.
  if (!dispositivo) return NextResponse.json({ ok: true });

  const tipo = texto(cuerpo.tipo, 20) || "pagina";
  if (!["pagina", "cv", "contacto", "externo"].includes(tipo)) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";

  const supabase = getSupabase();
  if (supabase) {
    /*
      El error se escribe en los logs. Es la misma lección que dejó el correo:
      una analítica que deja de registrar en silencio parece una web sin
      visitas, y uno se entera meses después.
    */
    const { error } = await supabase.from("eventos").insert({
      tipo,
      ruta: texto(cuerpo.ruta, 200) || "/",
      lang: texto(cuerpo.lang, 2) === "en" ? "en" : "es",
      referido: origen(texto(cuerpo.utm, 40), ua, texto(cuerpo.referido, 300)),
      pais: request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
      dispositivo,
      detalle: texto(cuerpo.detalle, 200) || null,
      visitante: await huellaDelDia(ip, ua),
    });
    if (error) console.error(`[evento] No se pudo registrar: ${error.message}`);
  }

  return NextResponse.json({ ok: true });
}
