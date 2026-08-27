import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";

export const alt = "Agustín Vignau — Analizo, diseño y resuelvo";
export const size = tamanoOG;
export const contentType = tipoOG;

export default function Imagen() {
  return imagenOG({
    eyebrow: "Ciencia de datos e IA",
    titulo: "Analizo, diseño y resuelvo.",
  });
}
