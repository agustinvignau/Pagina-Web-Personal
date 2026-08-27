import type { Metadata } from "next";
import PaginaEdicion from "@/components/paginas/PaginaEdicion";
import { getEdicion, getEdiciones } from "@/lib/radar";

export const revalidate = 300;

export async function generateStaticParams() {
  const ediciones = await getEdiciones();
  return ediciones.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const edicion = await getEdicion(slug, "es");
  if (!edicion) return { title: "Edición no encontrada" };

  return {
    title: edicion.title,
    description: edicion.summary ?? undefined,
    alternates: {
      canonical: `/radar/${slug}`,
      languages: { "es-AR": `/radar/${slug}`, en: `/en/radar/${slug}` },
    },
  };
}

export default async function Pagina({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PaginaEdicion slug={slug} lang="es" />;
}
