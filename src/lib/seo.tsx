import type { Metadata } from "next";
import type { Lang } from "./i18n";

const SITIO = "https://www.agustinvignau.com";
const NOMBRE = "Agustín Vignau";

/*
  Los metadatos de una página interna, armados en un solo lugar.

  Next no mezcla `openGraph` ni `alternates` entre el layout y la página: si
  la página no los define enteros, hereda los del inicio. Por eso al
  compartir una ficha o una nota aparecían el título y la dirección del
  inicio (auditoría del 13/11, O1). Acá cada página declara los suyos.

  La imagen para compartir no va acá: sale del `opengraph-image` de cada ruta.
*/
export function metaPagina({
  lang,
  es,
  en,
  title,
  description,
  articulo,
}: {
  lang: Lang;
  /** La ruta en castellano y en inglés de esta misma página. */
  es: string;
  en: string;
  title: string;
  description?: string | null;
  /** Si es una nota o una edición: sus fechas. */
  articulo?: { publicado?: string | null; modificado?: string | null };
}): Metadata {
  const propia = lang === "es" ? es : en;
  const desc = description ?? undefined;

  return {
    title,
    description: desc,
    alternates: {
      canonical: propia,
      languages: { "es-AR": es, en, "x-default": es },
    },
    openGraph: {
      type: articulo ? "article" : "website",
      locale: lang === "es" ? "es_AR" : "en_US",
      url: propia,
      siteName: NOMBRE,
      title,
      description: desc,
      ...(articulo
        ? {
            publishedTime: articulo.publicado ?? undefined,
            modifiedTime: articulo.modificado ?? articulo.publicado ?? undefined,
            authors: [SITIO],
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

/* ---------- Datos estructurados ---------- */

type Miga = { nombre: string; ruta: string };

/** El camino hasta la página: Inicio › Sección › Página. */
export function migas(lang: Lang, pasos: Miga[]) {
  const todas: Miga[] = [{ nombre: lang === "es" ? "Inicio" : "Home", ruta: lang === "es" ? "/" : "/en" }, ...pasos];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: `${SITIO}${m.ruta === "/" ? "" : m.ruta}`,
    })),
  };
}

/** Una nota de Escritos o una edición del Radar. */
export function articulo({
  lang,
  ruta,
  titulo,
  descripcion,
  publicado,
  modificado,
  etiquetas,
}: {
  lang: Lang;
  ruta: string;
  titulo: string;
  descripcion?: string | null;
  publicado?: string | null;
  modificado?: string | null;
  etiquetas?: string[];
}) {
  const url = `${SITIO}${ruta}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: titulo,
    description: descripcion ?? undefined,
    inLanguage: lang === "es" ? "es-AR" : "en",
    datePublished: publicado ?? undefined,
    dateModified: modificado ?? publicado ?? undefined,
    keywords: etiquetas && etiquetas.length ? etiquetas.join(", ") : undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: NOMBRE, url: SITIO },
    publisher: { "@type": "Person", name: NOMBRE, url: SITIO },
  };
}

/**
 * Inserta datos estructurados. El "<" se escapa porque los títulos vienen de
 * la base: sin eso, un "</script>" en un título cerraría el bloque.
 */
export function JsonLd({ datos }: { datos: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
