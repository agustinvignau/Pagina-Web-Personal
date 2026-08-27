import { getSupabase } from "./supabase";

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
};

export async function getEdiciones(): Promise<RadarItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("radar_items")
    .select("*")
    .eq("status", "published")
    .order("period_end", { ascending: false });

  if (error || !data) return [];
  return data as RadarItem[];
}

export async function getEdicion(slug: string): Promise<RadarItem | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("radar_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return data as RadarItem;
}

export function periodoLegible(desde: string, hasta: string) {
  const fmt = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
  });
  const fin = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${fmt.format(new Date(desde + "T12:00:00"))} al ${fin.format(new Date(hasta + "T12:00:00"))}`;
}
