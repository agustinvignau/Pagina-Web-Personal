import type { Metadata } from "next";
import PaginaRadar from "@/components/paginas/PaginaRadar";
import { metaPagina } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = metaPagina({
  lang: "es",
  es: "/radar",
  en: "/en/radar",
  title: "Radar",
  description:
    "Qué cambió en modelos y APIs de IA, agentes, MCP, bases de datos y despliegue, leído cada quince días.",
});

export default function Pagina() {
  return <PaginaRadar lang="es" />;
}
