import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";
import { fechaLegible, getEscrito } from "@/lib/escritos";

export const alt = "Writing by Agustín Vignau";
export const size = tamanoOG;
export const contentType = tipoOG;

export default async function Imagen({
  params,
}: {
  params: { slug: string };
}) {
  const escrito = await getEscrito(params.slug, "en");

  return imagenOG({
    eyebrow: "Writing",
    titulo: escrito?.title ?? "Writing",
    pie: escrito ? fechaLegible(escrito.published_at, "en") : undefined,
  });
}
