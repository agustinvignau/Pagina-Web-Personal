import type { Metadata } from "next";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import Analitica from "@/components/Analitica";
import { archivo, martianMono, ANTES_DE_PINTAR, SITIO, capasDeMovimiento } from "@/lib/documento";

const DESCRIPCION =
  "Armo el sistema que ordena tu negocio y lo convierte en datos para decidir. Ciencia de datos, sistemas a medida e IA aplicada para negocios, desde Buenos Aires.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Agustín Vignau — Sistemas y datos para decidir",
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
    title: "Agustín Vignau — Sistemas y datos para decidir",
    description: DESCRIPCION,
  },
  icons: {
    icon: [{ url: "/icono.svg", type: "image/svg+xml" }],
    shortcut: "/icono.svg",
    apple: "/icono.svg",
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
        <Analitica lang="es" />
        <Analytics />
      </body>
    </html>
  );
}
