import type { Metadata } from "next";
import PaginaEscritos from "@/components/paginas/PaginaEscritos";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on data, automation, and systems that have to hold up inside real companies.",
  alternates: {
    canonical: "/en/writing",
    languages: { "es-AR": "/escritos", en: "/en/writing" },
  },
};

export default function Page() {
  return <PaginaEscritos lang="en" />;
}
