import { getSupabase } from "./supabase";
import type { Lang } from "./i18n";

export type Escrito = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_html: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  title_en?: string | null;
  excerpt_en?: string | null;
  body_html_en?: string | null;
};

/** Igual que en proyectos y radar: si falta la traducción, cae al castellano. */
export function localizarEscrito(e: Escrito, lang: Lang): Escrito {
  if (lang === "es") return e;
  return {
    ...e,
    title: e.title_en || e.title,
    excerpt: e.excerpt_en ?? e.excerpt,
    body_html: e.body_html_en || e.body_html,
  };
}

export async function getEscritos(lang: Lang = "es"): Promise<Escrito[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return (data as Escrito[]).map((e) => localizarEscrito(e, lang));
}

export async function getEscrito(
  slug: string,
  lang: Lang = "es",
): Promise<Escrito | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return localizarEscrito(data as Escrito, lang);
}

export function fechaLegible(iso: string | null, lang: Lang = "es") {
  if (!iso) return "";
  const loc = lang === "en" ? "en-GB" : "es-AR";
  return new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Minutos de lectura sobre el texto plano, a 200 palabras por minuto. Se
 * calcula acá y no se guarda en la base para que no quede desactualizado
 * cuando se corrige un artículo.
 */
export function minutosDeLectura(html: string | null) {
  if (!html) return 1;
  const palabras = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}
