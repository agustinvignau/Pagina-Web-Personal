import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";

export const alt = "Agustín Vignau — Systems and data to decide";
export const size = tamanoOG;
export const contentType = tipoOG;

export default function Imagen() {
  return imagenOG({
    eyebrow: "Data science & AI",
    titulo: "Systems and data to decide.",
  });
}
