import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";

export const alt = "Agustín Vignau — I analyse, design and solve";
export const size = tamanoOG;
export const contentType = tipoOG;

export default function Imagen() {
  return imagenOG({
    eyebrow: "Data science & AI",
    titulo: "I analyse, design and solve.",
  });
}
