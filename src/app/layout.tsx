import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${martianMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
