import type { Metadata } from "next";
import PaginaProyecto from "@/components/paginas/PaginaProyecto";
import { getProyecto, getSlugs } from "@/lib/proyectos";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = await getProyecto(slug, "en");
  if (!proyecto) return { title: "Project not found" };

  return {
    title: proyecto.title,
    description: proyecto.summary,
    alternates: {
      canonical: `/en/projects/${slug}`,
      languages: { "es-AR": `/proyectos/${slug}`, en: `/en/projects/${slug}` },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PaginaProyecto slug={slug} lang="en" />;
}
