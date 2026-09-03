"use client";

import { registrar } from "./Analitica";

/**
 * Un enlace normal que además deja registrado el clic. Existe porque el
 * footer y el hero son componentes de servidor y no pueden escuchar eventos.
 */
export default function EnlaceMedido({
  href,
  tipo,
  detalle,
  externo,
  className,
  children,
}: {
  href: string;
  tipo: "cv" | "externo";
  detalle?: string;
  externo?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() => registrar(tipo, detalle)}
      {...(externo ? { target: "_blank", rel: "noreferrer" } : {})}
      className={className}
    >
      {children}
    </a>
  );
}
