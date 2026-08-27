import { getSupabase } from "./supabase";
import type { Lang } from "./i18n";

export type DatoRadar = { rotulo: string; valor: string };

export type RadarItem = {
  id: string;
  slug: string;
  period_start: string;
  period_end: string;
  title: string;
  summary: string | null;
  body_html: string | null;
  lectura: string | null;
  origen: string | null;
  datos: DatoRadar[];
  sources: { titulo: string; url: string }[];
  status: "draft" | "published";
  published_at: string | null;
  title_en?: string | null;
  summary_en?: string | null;
  body_html_en?: string | null;
  datos_en?: DatoRadar[];
};

/** Igual que en proyectos: si falta la traducción, cae al castellano. */
export function localizarEdicion(e: RadarItem, lang: Lang): RadarItem {
  if (lang === "es") return e;
  return {
    ...e,
    title: e.title_en || e.title,
    summary: e.summary_en ?? e.summary,
    body_html: e.body_html_en || e.body_html,
    datos: e.datos_en && e.datos_en.length > 0 ? e.datos_en : e.datos,
  };
}

export async function getEdiciones(lang: Lang = "es"): Promise<RadarItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("radar_items")
    .select("*")
    .eq("status", "published")
    .order("period_end", { ascending: false });

  if (error || !data) return [];
  return (data as RadarItem[]).map((e) => localizarEdicion(e, lang));
}

export async function getEdicion(
  slug: string,
  lang: Lang = "es",
): Promise<RadarItem | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("radar_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return localizarEdicion(data as RadarItem, lang);
}

export function periodoLegible(desde: string, hasta: string, lang: Lang = "es") {
  const loc = lang === "en" ? "en-GB" : "es-AR";
  const fmt = new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "long",
  });
  const fin = new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const union = lang === "en" ? " to " : " al ";
  return `${fmt.format(new Date(desde + "T12:00:00"))}${union}${fin.format(new Date(hasta + "T12:00:00"))}`;
}
