import type { Lang } from "./i18n";

export type ProjectKind = "produccion" | "laboratorio";

export type Project = {
  id: string;
  slug: string;
  kind: ProjectKind;
  position: number;
  title: string;
  subtitle: string | null;
  summary: string;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
  impact_value: string | null;
  impact_label: string | null;
  tech: string[];
  tags: string[];
  year: number | null;
  featured: boolean;
  published: boolean;
  links: Record<string, string>;
  title_en?: string | null;
  subtitle_en?: string | null;
  summary_en?: string | null;
  problem_en?: string | null;
  solution_en?: string | null;
  outcome_en?: string | null;
  impact_label_en?: string | null;
};

/**
 * Devuelve el proyecto con los campos del idioma pedido. Si falta la
 * traducción de un campo, cae al castellano: preferimos una mezcla legible
 * antes que un hueco en blanco.
 */
export function localizarProyecto(p: Project, lang: Lang): Project {
  if (lang === "es") return p;
  return {
    ...p,
    title: p.title_en || p.title,
    subtitle: p.subtitle_en ?? p.subtitle,
    summary: p.summary_en || p.summary,
    problem: p.problem_en ?? p.problem,
    solution: p.solution_en ?? p.solution,
    outcome: p.outcome_en ?? p.outcome,
    impact_label: p.impact_label_en ?? p.impact_label,
  };
}
