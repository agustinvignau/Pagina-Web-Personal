import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";
import { getEdicion } from "@/lib/radar";

export const alt = "Radar tecnológico de Agustín Vignau";
export const size = tamanoOG;
export const contentType = tipoOG;

export default async function Imagen({
  params,
}: {
  params: { slug: string };
}) {
  const edicion = await getEdicion(params.slug);

  return imagenOG({
    eyebrow: "Radar tecnológico",
    titulo: edicion?.title ?? "Radar",
    pie: edicion
      ? `${edicion.period_start} → ${edicion.period_end}`
      : undefined,
  });
}
