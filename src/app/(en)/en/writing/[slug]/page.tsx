import type { Metadata } from "next";
import PaginaEscrito from "@/components/paginas/PaginaEscrito";
import { getEscrito, getEscritos } from "@/lib/escritos";
import { metaPagina } from "@/lib/seo";

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

  return metaPagina({
    lang: "en",
    es: `/escritos/${slug}`,
    en: `/en/writing/${slug}`,
    title: escrito.title,
    description: escrito.excerpt,
    articulo: { publicado: escrito.published_at, modificado: escrito.updated_at },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PaginaEscrito slug={slug} lang="en" />;
}
