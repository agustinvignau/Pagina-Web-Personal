"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Desplazamiento leve siguiendo el mouse. Solo en punteros finos y sin
 * animaciones reducidas; en cualquier otro caso renderiza los hijos quietos.
 */
export default function ParallaxMouse({
  children,
  intensidad = 14,
  className = "",
}: {
  children: ReactNode;
  intensidad?: number;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = caja.current;
    if (!elemento) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let destinoX = 0;
    let destinoY = 0;
    let x = 0;
    let y = 0;
    let cuadro = 0;

    const mover = (e: MouseEvent) => {
      destinoX = (e.clientX / window.innerWidth - 0.5) * intensidad * 2;
      destinoY = (e.clientY / window.innerHeight - 0.5) * intensidad;
    };

    const animar = () => {
      x += (destinoX - x) * 0.06;
      y += (destinoY - y) * 0.06;
      elemento.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      cuadro = requestAnimationFrame(animar);
    };

    window.addEventListener("mousemove", mover, { passive: true });
    cuadro = requestAnimationFrame(animar);

    return () => {
      window.removeEventListener("mousemove", mover);
      cancelAnimationFrame(cuadro);
      elemento.style.transform = "";
    };
  }, [intensidad]);

  return (
    <div ref={caja} className={className}>
      {children}
    </div>
  );
}
