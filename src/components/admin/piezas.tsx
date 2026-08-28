"use client";

import type { ReactNode } from "react";

export function Titulo({ children, nota }: { children: ReactNode; nota?: string }) {
  return (
    <header className="mb-6 flex flex-col gap-2 border-b-2 border-texto pb-4">
      <h2 className="titular text-[clamp(1.6rem,4vw,2.4rem)]">{children}</h2>
      {nota ? <p className="text-sm text-apagado">{nota}</p> : null}
    </header>
  );
}

export function Boton({
  children,
  onClick,
  variante = "normal",
  ocupado = false,
}: {
  children: ReactNode;
  onClick: () => void;
  variante?: "normal" | "fuerte";
  ocupado?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={ocupado}
      className={`etiqueta px-4 py-2.5 transition-colors disabled:opacity-50 ${
        variante === "fuerte"
          ? "bg-texto text-hueso hover:bg-oliva"
          : "border border-linea text-apagado hover:border-texto hover:text-texto"
      }`}
    >
      {ocupado ? "…" : children}
    </button>
  );
}

export function Estado({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <p aria-live="polite" className="etiqueta mb-4 text-oliva-texto">
      {texto}
    </p>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return <p className="etiqueta py-10 text-apagado">{children}</p>;
}
