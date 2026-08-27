"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVO = "a, button, input, textarea, [data-cursor]";

export default function CursorCustom() {
  const punto = useRef<HTMLDivElement>(null);
  const anillo = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(false);
  const [visto, setVisto] = useState(false);
  const [rotulo, setRotulo] = useState<string | null>(null);

  useEffect(() => {
    const finoYSinReducir =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finoYSinReducir) return;

    setActivo(true);
    document.documentElement.classList.add("cursor-propio");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ax = x;
    let ay = y;
    let cuadro = 0;

    const mover = (e: MouseEvent) => {
      setVisto(true);
      x = e.clientX;
      y = e.clientY;
      if (punto.current) {
        punto.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      const destino = (e.target as HTMLElement)?.closest?.(INTERACTIVO) as
        | HTMLElement
        | null;
      setRotulo(destino ? (destino.dataset.cursor ?? "") : null);
    };

    const animar = () => {
      ax += (x - ax) * 0.16;
      ay += (y - ay) * 0.16;
      if (anillo.current) {
        anillo.current.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      }
      cuadro = requestAnimationFrame(animar);
    };

    window.addEventListener("mousemove", mover, { passive: true });
    cuadro = requestAnimationFrame(animar);

    return () => {
      window.removeEventListener("mousemove", mover);
      cancelAnimationFrame(cuadro);
      document.documentElement.classList.remove("cursor-propio");
    };
  }, []);

  if (!activo) return null;

  const sobreAlgo = rotulo !== null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-200 ${visto ? "opacity-100" : "opacity-0"}`}
    >
      <div
        ref={punto}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 bg-oliva-luz"
      />
      <div
        ref={anillo}
        className={`absolute left-0 top-0 flex items-center justify-center border border-oliva-luz transition-[width,height,margin,background-color] duration-200 ${
          sobreAlgo
            ? "-ml-7 -mt-7 size-14 bg-oliva-luz/10"
            : "-ml-3.5 -mt-3.5 size-7"
        }`}
      >
        {rotulo ? (
          <span className="etiqueta text-[0.5rem] text-oliva-luz">{rotulo}</span>
        ) : null}
      </div>
    </div>
  );
}
