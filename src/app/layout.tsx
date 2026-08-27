import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import RevelarScroll from "@/components/motion/RevelarScroll";
import CursorCustom from "@/components/motion/CursorCustom";
import TransicionRuta from "@/components/motion/TransicionRuta";
import BarraProgreso from "@/components/motion/BarraProgreso";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
});

const SITIO = "https://www.agustinvignau.com";
const DESCRIPCION =
  "Sistemas de datos y automatización para PyMEs: inventario, carga automática de comprobantes y reportes sobre los que se decide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Agustín Vignau — Analizo, diseño y resuelvo",
    template: "%s — Agustín Vignau",
  },
  description: DESCRIPCION,
  alternates: { canonical: "/" },
  authors: [{ name: "Agustín Vignau", url: SITIO }],
  creator: "Agustín Vignau",
  keywords: [
    "analista de datos",
    "automatización de procesos",
    "Power BI",
    "Python",
    "SQL",
    "sistemas de inventario",
    "PyMEs",
    "Buenos Aires",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITIO,
    siteName: "Agustín Vignau",
    title: "Agustín Vignau — Analizo, diseño y resuelvo",
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Agustín Vignau — Analizo, diseño y resuelvo",
    description: DESCRIPCION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Corre antes del primer pintado: sin esto habría un parpadeo del contenido
// antes de esconderlo, y sin JavaScript nunca se esconde nada.
const ANTES_DE_PINTAR = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('con-reveal')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${martianMono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: ANTES_DE_PINTAR }} />
        <BarraProgreso />
        <TransicionRuta />
        <CursorCustom />
        <RevelarScroll />
        {children}
      </body>
    </html>
  );
}
