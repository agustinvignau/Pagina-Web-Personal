"use client";

import { useEffect, useState } from "react";

export default function BarraProgreso() {
  const [avance, setAvance] = useState(0);

  useEffect(() => {
    /*
      Leer scrollHeight obliga al navegador a recalcular el layout. Hacerlo en
      cada evento de scroll salía caro, así que el alto se mide una vez y se
      vuelve a medir sólo cuando cambia el tamaño de la ventana o del contenido.
      Además el cálculo se agenda en un cuadro de animación en vez de correr por
      cada evento.
    */
    let alto = 0;
    let pedido = 0;

    const medir = () => {
      alto = document.documentElement.scrollHeight - window.innerHeight;
    };

    const pintar = () => {
      pedido = 0;
      setAvance(alto > 0 ? (window.scrollY / alto) * 100 : 0);
    };

    const alScrollear = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(pintar);
    };

    const alRedimensionar = () => {
      medir();
      alScrollear();
    };

    medir();
    pintar();

    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alRedimensionar);

    const observador =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(alRedimensionar)
        : null;
    observador?.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alRedimensionar);
      observador?.disconnect();
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px bg-transparent"
    >
      <div
        className="h-full bg-oliva-luz transition-[width] duration-150 ease-out"
        style={{ width: `${avance}%` }}
      />
    </div>
  );
}
