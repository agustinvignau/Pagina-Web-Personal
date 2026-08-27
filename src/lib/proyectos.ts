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
