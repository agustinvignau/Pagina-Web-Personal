import type { Metadata } from "next";
import PaginaRadar from "@/components/paginas/PaginaRadar";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Radar",
  description:
    "Qué se movió en IA, agentes, datos e infraestructura, leído cada quince días.",
  alternates: {
    canonical: "/radar",
    languages: { "es-AR": "/radar", en: "/en/radar" },
  },
};

export default function Pagina() {
  return <PaginaRadar lang="es" />;
}
