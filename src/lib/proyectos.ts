import { getSupabase } from "./supabase";
import type { Project, ProjectKind } from "./types";

export async function getProyectos(kind: ProjectKind): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("kind", kind)
    .eq("published", true)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data as Project[];
}

export async function getProyecto(slug: string): Promise<Project | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Project;
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
