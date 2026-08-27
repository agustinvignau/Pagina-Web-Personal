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

export const metadata: Metadata = {
  title: "Agustín Vignau — Analizo, diseño y resuelvo",
  description:
    "Sistemas de datos y automatización para PyMEs: inventario, carga automática de comprobantes y reportes sobre los que se decide.",
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
