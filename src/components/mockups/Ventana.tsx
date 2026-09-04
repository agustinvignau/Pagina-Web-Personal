import type { ReactNode } from "react";

export default function Ventana({
  titulo,
  children,
  className = "",
}: {
  titulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`border border-tinta bg-superficie shadow-[0_3.1em_5.6em_-2.5em_rgba(0,0,0,0.95)] ${className}`}
    >
      <div className="flex items-center gap-[0.375em] border-b border-linea bg-superficie-2 px-[0.75em] py-[0.5em]">
        <span className="block size-[0.4375em] bg-oliva" />
        <span className="block size-[0.4375em] bg-acero" />
        <span className="block size-[0.4375em] bg-salvia" />
        <span className="grow" />
        <span className="etiqueta text-[0.5em] text-grafito">{titulo}</span>
      </div>
      {children}
    </div>
  );
}
