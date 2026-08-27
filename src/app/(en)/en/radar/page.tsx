import type { Metadata } from "next";
import PaginaRadar from "@/components/paginas/PaginaRadar";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Radar",
  description:
    "What moved across AI, agents, data and infrastructure, read every two weeks.",
  alternates: {
    canonical: "/en/radar",
    languages: { "es-AR": "/radar", en: "/en/radar" },
  },
};

export default function Page() {
  return <PaginaRadar lang="en" />;
}
