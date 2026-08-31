/*
  Prueba que la clave de Resend funcione, sin pasar por el formulario.

    node scripts/probar-resend.mjs

  La clave se lee de .env.local. Nunca se escribe acá: este archivo se
  commitea y .env.local no.
*/
import { readFileSync } from "node:fs";

function leerEnv(archivo = ".env.local") {
  const vars = {};
  let texto;
  try {
    texto = readFileSync(archivo, "utf8");
  } catch {
    console.error(`No encontré ${archivo}. Corré esto desde la raíz del proyecto.`);
    process.exit(1);
  }
  for (const linea of texto.split("\n")) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#") || !limpia.includes("=")) continue;
    const i = limpia.indexOf("=");
    vars[limpia.slice(0, i).trim()] = limpia.slice(i + 1).trim();
  }
  return vars;
}

const env = leerEnv();
const clave = env.RESEND_API_KEY;
const remitente = env.RESEND_FROM ?? "onboarding@resend.dev";
const destino = "agustinvignau729@gmail.com";

if (!clave) {
  console.error("Falta RESEND_API_KEY en .env.local.");
  process.exit(1);
}

console.log(`Remitente: ${remitente}`);
console.log(`Destino:   ${destino}`);
if (!env.RESEND_FROM) {
  console.log(
    "\nOjo: sin RESEND_FROM se usa el remitente de prueba de Resend, que\n" +
    "solo entrega a la casilla dueña de la cuenta. Si el mail no llega,\n" +
    "puede ser eso y no la clave.\n",
  );
}

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${clave}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: `Portfolio <${remitente}>`,
    to: [destino],
    subject: "Prueba de Resend desde el portfolio",
    text: "Si estás leyendo esto, la clave funciona y el remitente está aceptado.",
  }),
});

const cuerpo = await res.json().catch(() => ({}));

if (res.ok) {
  console.log(`✓ Aceptado por Resend (id ${cuerpo.id ?? "sin id"}).`);
  console.log("  Revisá la casilla. Si no llega en un minuto, mirá spam.");
} else {
  console.error(`✗ Resend respondió ${res.status}.`);
  console.error(`  ${cuerpo.message ?? JSON.stringify(cuerpo)}`);
  if (res.status === 403) {
    console.error("\n  Un 403 acá suele ser el dominio del remitente sin verificar.");
  }
  if (res.status === 401) {
    console.error("\n  Un 401 es la clave: revisá que sea la correcta y esté activa.");
  }
  process.exit(1);
}
