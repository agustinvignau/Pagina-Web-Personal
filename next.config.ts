import type { NextConfig } from "next";

/*
  Cabeceras de seguridad. Van acá y no en Vercel para que viajen con el
  código y valgan también en local.

  No hay Content-Security-Policy a propósito: hacerla bien en Next exige
  nonces por request, y una CSP a medias rompe la página sin proteger nada.
  Es una mejora aparte, no un renglón más de esta lista.
*/
const cabeceras = [
  // El navegador no vuelve a intentar por HTTP nunca más.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Un archivo servido como texto no se ejecuta como script por adivinanza.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Al salir del sitio se manda el dominio, no la URL completa.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nadie puede meter el sitio en un iframe: es lo que evita que dibujen
  // botones falsos encima del panel.
  { key: "X-Frame-Options", value: "DENY" },
  // El sitio no usa nada de esto; declararlo cierra la puerta por si acaso.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: cabeceras }];
  },
};

export default nextConfig;
