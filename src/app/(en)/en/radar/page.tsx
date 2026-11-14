import type { Metadata } from "next";
import PaginaRadar from "@/components/paginas/PaginaRadar";
import { metaPagina } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = metaPagina({
  lang: "en",
  es: "/radar",
  en: "/en/radar",
  title: "Radar",
  description:
    "What changed across AI models and APIs, agents, MCP, databases and deployment, read every two weeks.",
});

export default function Page() {
  return <PaginaRadar lang="en" />;
}
