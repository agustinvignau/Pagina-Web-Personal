import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";
import { getProyecto } from "@/lib/proyectos";

export const alt = "Proyecto de Agustín Vignau";
export const size = tamanoOG;
export const contentType = tipoOG;

export default async function Imagen({
  params,
}: {
  params: { slug: string };
}) {
  const proyecto = await getProyecto(params.slug);

  return imagenOG({
    eyebrow:
      proyecto?.kind === "laboratorio" ? "Laboratorio" : "En producción",
    titulo: proyecto?.title ?? "Proyecto",
    pie: proyecto?.impact_value
      ? `${proyecto.impact_value} · ${proyecto.impact_label ?? ""}`.trim()
      : undefined,
  });
}
