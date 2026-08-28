import type { Metadata } from "next";
import "../globals.css";
import { archivo, martianMono, ANTES_DE_PINTAR, SITIO, capasDeMovimiento } from "@/lib/documento";

const DESCRIPTION =
  "Data systems and process automation for small businesses: inventory, automated invoice capture, and the reports decisions get made on.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Agustín Vignau — I analyse, design and solve",
    template: "%s — Agustín Vignau",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/en",
    languages: { "es-AR": "/", en: "/en", "x-default": "/" },
  },
  authors: [{ name: "Agustín Vignau", url: SITIO }],
  creator: "Agustín Vignau",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITIO}/en`,
    siteName: "Agustín Vignau",
    title: "Agustín Vignau — I analyse, design and solve",
    description: DESCRIPTION,
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

export default function LayoutEn({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${martianMono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: ANTES_DE_PINTAR }} />
        {capasDeMovimiento()}
        {children}
      </body>
    </html>
  );
}
