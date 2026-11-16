import { imagenOG, tamanoOG, tipoOG } from "@/lib/og";

export const alt = "Agustín Vignau — Sistemas y datos para decidir";
export const size = tamanoOG;
export const contentType = tipoOG;

export default function Imagen() {
  return imagenOG({
    eyebrow: "Ciencia de datos e IA",
    titulo: "Sistemas y datos para decidir.",
  });
}
