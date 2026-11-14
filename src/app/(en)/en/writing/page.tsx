import type { Metadata } from "next";
import PaginaEscritos from "@/components/paginas/PaginaEscritos";
import { metaPagina } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = metaPagina({
  lang: "en",
  es: "/escritos",
  en: "/en/writing",
  title: "Writing",
  description:
    "Notes on data, automation, and systems that have to hold up inside real companies.",
});

export default function Page() {
  return <PaginaEscritos lang="en" />;
}
