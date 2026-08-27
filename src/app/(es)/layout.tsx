import type { Metadata } from "next";
import "../globals.css";
import { archivo, martianMono, ANTES_DE_PINTAR, SITIO, capasDeMovimiento } from "@/lib/documento";

const DESCRIPCION =
  "Sistemas de datos y automatización para PyMEs: inventario, carga automática de comprobantes y reportes sobre los que se decide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Agustín Vignau — Analizo, diseño y resuelvo",
    template: "%s — Agustín Vignau",
  },
  description: DESCRIPCION,
  alternates: {
    canonical: "/",
    languages: { "es-AR": "/", en: "/en", "x-default": "/" },
  },
  authors: [{ name: "Agustín Vignau", url: SITIO }],
  creator: "Agustín Vignau",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITIO,
    siteName: "Agustín Vignau",
    title: "Agustín Vignau — Analizo, diseño y resuelvo",
    description: DESCRIPCION,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function LayoutEs({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${martianMono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: ANTES_DE_PINTAR }} />
        {capasDeMovimiento()}
        {children}
      </body>
    </html>
  );
}
