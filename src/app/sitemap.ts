import type { MetadataRoute } from "next";
import { getSlugs } from "@/lib/proyectos";
import { getEdiciones } from "@/lib/radar";

const SITIO = "https://www.agustinvignau.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, ediciones] = await Promise.all([getSlugs(), getEdiciones()]);

  const proyectos = slugs.map((slug) => ({
    url: `${SITIO}/proyectos/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const radar = ediciones.map((e) => ({
    url: `${SITIO}/radar/${e.slug}`,
    lastModified: e.published_at ? new Date(e.published_at) : undefined,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [
    { url: SITIO, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO}/radar`, changeFrequency: "weekly", priority: 0.7 },
    ...proyectos,
    ...radar,
  ];
}
