import { getSupabase } from "./supabase";
import type { Lang } from "./i18n";
import { localizarProyecto } from "./types";
import type { Project, ProjectKind } from "./types";

export async function getProyectos(
  kind: ProjectKind,
  lang: Lang = "es",
): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("kind", kind)
    .eq("published", true)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return (data as Project[]).map((p) => localizarProyecto(p, lang));
}

export async function getProyecto(
  slug: string,
  lang: Lang = "es",
): Promise<Project | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return localizarProyecto(data as Project, lang);
}

export async function getSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("published", true);

  return (data ?? []).map((p) => p.slug as string);
}
