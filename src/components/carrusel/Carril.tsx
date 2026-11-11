"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * El carril horizontal de una sección. Las tarjetas llegan ya armadas desde
 * el servidor; acá solo vive lo que necesita el navegador: saber cuál se ve,
 * moverse con las flechas y arrastrar con el mouse.
 *
 * El desplazamiento es el nativo, con scroll-snap. Así el dedo en el celular
 * y la rueda del touchpad funcionan como en cualquier página, sin una
 * librería que reimplemente la física, y anda igual en el navegador interno
 * de Instagram.
 */
export default function Carril({
  children,
  tono,
  etiqueta,
  anterior,
  siguiente,
}: {
  children: ReactNode;
  tono: "claro" | "oscuro";
  etiqueta: string;
  anterior: string;
  siguiente: string;
}) {
  const carril = useRef<HTMLUListElement>(null);
  const total = Children.count(children);
  const [actual, setActual] = useState(0);
  const [bordes, setBordes] = useState({ inicio: true, fin: total <= 1 });

  // Arrastre con mouse. En táctil no hace falta: lo resuelve el scroll nativo.
  const arrastre = useRef({ activo: false, movio: false, x: 0, scroll: 0 });

  const items = () => Array.from(carril.current?.children ?? []) as HTMLElement[];

  const medir = useCallback(() => {
    const c = carril.current;
    if (!c) return;
    const margen = parseFloat(getComputedStyle(c).scrollPaddingLeft) || 0;
    const x = c.scrollLeft + margen;
    const fin = c.scrollLeft + c.clientWidth >= c.scrollWidth - 4;
    let mejor = 0;
    let distancia = Infinity;
    items().forEach((it, i) => {
      const d = Math.abs(it.offsetLeft - x);
      if (d < distancia) {
        distancia = d;
        mejor = i;
      }
    });
    // En pantallas anchas la última tarjeta nunca llega al borde izquierdo:
    // si ya no se puede avanzar, se está viendo la última.
    setActual(fin ? total - 1 : mejor);
    setBordes({ inicio: c.scrollLeft <= 2, fin });
  }, [total]);

  const ir = useCallback((i: number) => {
    const c = carril.current;
    const destino = items()[Math.max(0, Math.min(total - 1, i))];
    if (!c || !destino) return;
    const margen = parseFloat(getComputedStyle(c).scrollPaddingLeft) || 0;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    c.scrollTo({ left: destino.offsetLeft - margen, behavior: reducido ? "auto" : "smooth" });
  }, [total]);

  useEffect(() => {
    const c = carril.current;
    if (!c) return;
    let cuadro = 0;
    const alMover = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(medir);
    };
    c.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    medir();

    const mover = (e: PointerEvent) => {
      const a = arrastre.current;
      if (!a.activo) return;
      const dx = e.clientX - a.x;
      if (!a.movio && Math.abs(dx) > 5) {
        a.movio = true;
        c.dataset.arrastrando = "";
      }
      if (a.movio) c.scrollLeft = a.scroll - dx;
    };
    const soltar = () => {
      const a = arrastre.current;
      if (!a.activo) return;
      a.activo = false;
      if (a.movio) {
        delete c.dataset.arrastrando;
        // Al soltar, que asiente en la tarjeta más cercana.
        requestAnimationFrame(() => {
          medir();
          ir(indiceCercano(c));
        });
      }
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
    return () => {
      cancelAnimationFrame(cuadro);
      c.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
    };
  }, [medir, ir]);

  const claro = tono === "claro";
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      <ul
        ref={carril}
        tabIndex={0}
        aria-label={etiqueta}
        className="carril"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          const c = carril.current;
          if (!c) return;
          arrastre.current = { activo: true, movio: false, x: e.clientX, scroll: c.scrollLeft };
        }}
        onClickCapture={(e) => {
          // Un arrastre que termina sobre una tarjeta no la abre.
          if (arrastre.current.movio) {
            e.preventDefault();
            e.stopPropagation();
            arrastre.current.movio = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            ir(actual + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            ir(actual - 1);
          }
        }}
      >
        {children}
      </ul>

      <div className="mt-7 flex items-center gap-5 px-6 md:px-12">
        <span aria-live="polite" className="cifra min-w-[5.5em] text-[0.95rem]">
          {pad(actual + 1)} / {pad(total)}
        </span>
        <div aria-hidden className={`relative h-[2px] grow overflow-hidden ${claro ? "bg-linea" : "bg-linea-oscura"}`}>
          <span
            className={`absolute inset-y-0 left-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${claro ? "bg-texto" : "bg-oliva-luz"}`}
            style={{ width: `${100 / total}%`, transform: `translateX(${actual * 100}%)` }}
          />
        </div>
        <div className="flex gap-2">
          {[
            { dir: -1, rotulo: anterior, flecha: "←", off: bordes.inicio },
            { dir: 1, rotulo: siguiente, flecha: "→", off: bordes.fin },
          ].map((b) => (
            <button
              key={b.dir}
              type="button"
              aria-label={b.rotulo}
              disabled={b.off}
              onClick={() => ir(actual + b.dir)}
              className={`cifra flex size-12 items-center justify-center border-[1.5px] border-current text-lg transition-colors disabled:cursor-default disabled:opacity-30 ${
                claro ? "enabled:hover:bg-texto enabled:hover:text-hueso" : "enabled:hover:bg-hueso enabled:hover:text-tinta"
              }`}
            >
              {b.flecha}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function indiceCercano(c: HTMLUListElement) {
  const margen = parseFloat(getComputedStyle(c).scrollPaddingLeft) || 0;
  const x = c.scrollLeft + margen;
  let mejor = 0;
  let distancia = Infinity;
  Array.from(c.children).forEach((it, i) => {
    const d = Math.abs((it as HTMLElement).offsetLeft - x);
    if (d < distancia) {
      distancia = d;
      mejor = i;
    }
  });
  return mejor;
}
