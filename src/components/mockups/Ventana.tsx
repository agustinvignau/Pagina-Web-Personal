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
      className={`border border-tinta bg-superficie shadow-[0_50px_90px_-40px_rgba(0,0,0,0.95)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-linea bg-superficie-2 px-3 py-2">
        <span className="block size-[7px] bg-oliva" />
        <span className="block size-[7px] bg-acero" />
        <span className="block size-[7px] bg-salvia" />
        <span className="grow" />
        <span className="etiqueta text-[0.5rem] text-apagado">{titulo}</span>
      </div>
      {children}
    </div>
  );
}
