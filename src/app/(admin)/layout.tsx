import type { Metadata } from "next";
import "../globals.css";
import { archivo, martianMono } from "@/lib/documento";

export const metadata: Metadata = {
  title: "Panel — Agustín Vignau",
  // El panel no tiene por qué aparecer en ningún buscador.
  robots: { index: false, follow: false, nocache: true },
};

export default function LayoutAdmin({
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
