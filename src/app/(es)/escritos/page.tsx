import type { Metadata } from "next";
import PaginaEscritos from "@/components/paginas/PaginaEscritos";
import { metaPagina } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = metaPagina({
  lang: "es",
  es: "/escritos",
  en: "/en/writing",
  title: "Escritos",
  description:
    "Notas sobre datos, automatización y sistemas que tienen que funcionar en empresas reales.",
});

export default function Pagina() {
  return <PaginaEscritos lang="es" />;
}
