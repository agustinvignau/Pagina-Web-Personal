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
};
