"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Al cambiar de ruta, una cortina oliva se retira hacia arriba y deja ver la
 * página nueva. Se saltea con animaciones reducidas.
 */
export default function TransicionRuta() {
  const ruta = usePathname();
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setAnimando(true);
    const t = setTimeout(() => setAnimando(false), 700);
    return () => clearTimeout(t);
  }, [ruta]);

  if (!animando) return null;

  return (
    <div
      aria-hidden
      className="cortina pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-oliva"
    >
      <span className="etiqueta text-hueso">Agustín Vignau</span>
    </div>
  );
}
