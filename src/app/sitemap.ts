import type { MetadataRoute } from "next";
import { getSlugs } from "@/lib/proyectos";
import { getEdiciones } from "@/lib/radar";

const SITIO = "https://www.agustinvignau.com";

/**
 * Cada URL declara su equivalente en el otro idioma para que Google entienda
 * que son la misma página traducida. Ojo: las dos versiones de un par apuntan
 * al MISMO par de alternativas — la entrada en inglés no se apunta a sí misma
 * como versión en español.
 */
function entrada(
  url: string,
  es: string,
  en: string,
  extra: Partial<MetadataRoute.Sitemap[number]> = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITIO}${url}`,
    alternates: {
      languages: { "es-AR": `${SITIO}${es}`, en: `${SITIO}${en}` },
    },
    ...extra,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, ediciones] = await Promise.all([getSlugs(), getEdiciones()]);

  const proyectos = slugs.flatMap((slug) => {
    const es = `/proyectos/${slug}`;
    const en = `/en/projects/${slug}`;
    return [
      entrada(es, es, en, { changeFrequency: "monthly", priority: 0.8 }),
      entrada(en, es, en, { changeFrequency: "monthly", priority: 0.6 }),
    ];
  });

  const radar = ediciones.flatMap((e) => {
    const es = `/radar/${e.slug}`;
    const en = `/en/radar/${e.slug}`;
    const lastModified = e.published_at ? new Date(e.published_at) : undefined;
    return [
      entrada(es, es, en, { lastModified, changeFrequency: "yearly", priority: 0.6 }),
      entrada(en, es, en, { lastModified, changeFrequency: "yearly", priority: 0.5 }),
    ];
  });

  return [
    entrada("/", "/", "/en", { changeFrequency: "weekly", priority: 1 }),
    entrada("/en", "/", "/en", { changeFrequency: "weekly", priority: 0.8 }),
    entrada("/radar", "/radar", "/en/radar", { changeFrequency: "weekly", priority: 0.7 }),
    entrada("/en/radar", "/radar", "/en/radar", { changeFrequency: "weekly", priority: 0.6 }),
    ...proyectos,
    ...radar,
  ];
}
