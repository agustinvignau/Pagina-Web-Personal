import type { Lang } from "./i18n";

export type ProjectKind = "produccion" | "laboratorio";

/** Estado que se muestra sobre la portada. El rótulo sale de i18n.ts. */
export type ProjectStatus =
  | "en_produccion"
  | "terminado"
  | "en_desarrollo"
  | "uso_personal"
  | "producto_propio";

export const ESTADOS: ProjectStatus[] = [
  "en_produccion",
  "terminado",
  "en_desarrollo",
  "uso_personal",
  "producto_propio",
];

/** Una captura de la galería de la ficha. */
export type Captura = {
  src: string;
  ancho: number;
  alto: number;
  alt: string;
  alt_en?: string | null;
  pie?: string | null;
  pie_en?: string | null;
};

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
  status: ProjectStatus | null;
  cover_url: string | null;
  cover_alt: string | null;
  cover_focus: "izquierda" | "centro" | null;
  gallery: Captura[] | null;
  cover_alt_en?: string | null;
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
    cover_alt: p.cover_alt_en || p.cover_alt,
    gallery: (p.gallery ?? []).map((c) => ({
      ...c,
      alt: c.alt_en || c.alt,
      pie: c.pie_en || c.pie,
    })),
  };
}
