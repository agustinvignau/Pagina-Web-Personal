import type { Metadata } from "next";
import PaginaEscrito from "@/components/paginas/PaginaEscrito";
import { getEscrito, getEscritos } from "@/lib/escritos";

export const revalidate = 300;

export async function generateStaticParams() {
  const escritos = await getEscritos();
  return escritos.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const escrito = await getEscrito(slug, "en");
  if (!escrito) return { title: "Article not found" };

  return {
    title: escrito.title,
    description: escrito.excerpt ?? undefined,
    alternates: {
      canonical: `/en/writing/${slug}`,
      languages: { "es-AR": `/escritos/${slug}`, en: `/en/writing/${slug}` },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PaginaEscrito slug={slug} lang="en" />;
}
