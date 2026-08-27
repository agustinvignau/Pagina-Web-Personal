"use client";

import { useEffect } from "react";

/**
 * Revela los bloques marcados con data-revelar cuando entran en pantalla.
 * El ocultamiento inicial lo activa un script en el layout, así que si el
 * JavaScript no corre el contenido queda visible igual.
 */
export default function RevelarScroll() {
  useEffect(() => {
    const raiz = document.documentElement;
    if (!raiz.classList.contains("con-reveal")) return;

    const bloques = document.querySelectorAll<HTMLElement>("[data-revelar]");
    if (bloques.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    bloques.forEach((b, i) => {
      b.style.setProperty("--retraso", `${Math.min(i % 6, 5) * 70}ms`);
      observador.observe(b);
    });

    return () => observador.disconnect();
  }, []);

  return null;
}
