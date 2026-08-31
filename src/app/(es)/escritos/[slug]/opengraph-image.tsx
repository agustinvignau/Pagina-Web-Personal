import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";
import { fechaLegible, getEscrito } from "@/lib/escritos";

export const alt = "Escritos de Agustín Vignau";
export const size = tamanoOG;
export const contentType = tipoOG;

export default async function Imagen({
  params,
}: {
  params: { slug: string };
}) {
  const escrito = await getEscrito(params.slug);

  return imagenOG({
    eyebrow: "Escritos",
    titulo: escrito?.title ?? "Escritos",
    pie: escrito ? fechaLegible(escrito.published_at) : undefined,
  });
}
