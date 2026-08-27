import { Archivo, Martian_Mono } from "next/font/google";
import RevelarScroll from "@/components/motion/RevelarScroll";
import CursorCustom from "@/components/motion/CursorCustom";
import TransicionRuta from "@/components/motion/TransicionRuta";
import BarraProgreso from "@/components/motion/BarraProgreso";

export const SITIO = "https://www.agustinvignau.com";

export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
});

/**
 * Corre antes del primer pintado: sin esto habría un parpadeo del contenido
 * antes de esconderlo, y sin JavaScript nunca se esconde nada.
 */
export const ANTES_DE_PINTAR = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('con-reveal')}}catch(e){}`;

/** Las mismas capas de movimiento para los dos idiomas. */
export function capasDeMovimiento() {
  return (
    <>
      <BarraProgreso />
      <TransicionRuta />
      <CursorCustom />
      <RevelarScroll />
    </>
  );
}
