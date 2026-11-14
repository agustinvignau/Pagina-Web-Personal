import type { NextConfig } from "next";

/*
  Cabeceras de seguridad. Van acá y no en Vercel para que viajen con el
  código y valgan también en local.

  La Content-Security-Policy se arma más abajo.
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

/*
  Content-Security-Policy (auditoría del 13/11, S2, segunda capa).

  Es una política fija, sin nonces. Los nonces obligan a generar cada página
  en cada visita, y eso tira abajo la caché que hace rápido al sitio. A cambio
  hay que permitir scripts en línea, que Next usa para hidratar: esta política
  no frena un script inyectado en la página (de eso se ocupa el filtro de
  HTML), pero sí lo deja sin salida. No puede cargar código de otro sitio,
  mandar datos a otro servidor, cambiar la base de los enlaces ni apuntar un
  formulario afuera.

  Lo único externo permitido es el proyecto de Supabase: las portadas del
  bucket y las llamadas del panel.
*/
const SUPABASE = "https://ettrvdlseiamhyswiznu.supabase.co";
const csp = [
  "default-src 'self'",
  // 'unsafe-eval' solo en desarrollo: lo necesita la recarga en caliente.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE}`,
  "font-src 'self'",
  `connect-src 'self' ${SUPABASE}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

cabeceras.push({ key: "Content-Security-Policy", value: csp });

/*
  Las imágenes de public/ no cambian de contenido sin cambiar de nombre
  (comprobantes-2.webp), así que el navegador puede guardarlas un mes en vez
  de volver a preguntar en cada visita.
*/
const cacheImagenes = [
  { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No hace falta anunciar con qué está hecho el sitio.
  poweredByHeader: false,
  // Las portadas de los proyectos viven en el bucket público de Supabase.
  // Next las achica y las pasa a WebP o AVIF según el ancho de la tarjeta.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ettrvdlseiamhyswiznu.supabase.co",
        pathname: "/storage/v1/object/public/proyectos/**",
      },
    ],
  },
  // La ficha "Widget para el ERP" pasó a ser "MerchBot" (fase 10). La
  // redirección es permanente para que los enlaces ya compartidos sigan
  // andando y los buscadores pasen la ficha a la URL nueva.
  async redirects() {
    return [
      { source: "/proyectos/widget-para-el-erp", destination: "/proyectos/merchbot", permanent: true },
      { source: "/en/projects/widget-para-el-erp", destination: "/en/projects/merchbot", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: cabeceras },
      { source: "/portadas/:archivo*", headers: cacheImagenes },
      { source: "/proyectos/:carpeta/:archivo(.+\\.webp)", headers: cacheImagenes },
    ];
  },
};

export default nextConfig;
