import type { Metadata } from "next";
import PaginaEscritos from "@/components/paginas/PaginaEscritos";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Escritos",
  description:
    "Notas sobre datos, automatización y sistemas que tienen que funcionar en empresas reales.",
  alternates: {
    canonical: "/escritos",
    languages: { "es-AR": "/escritos", en: "/en/writing" },
  },
};

export default function Pagina() {
  return <PaginaEscritos lang="es" />;
}
