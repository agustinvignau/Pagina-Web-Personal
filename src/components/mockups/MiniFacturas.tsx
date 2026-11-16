import Ventana from "./Ventana";
import { rotulos } from "@/lib/mockups";
import type { Lang } from "@/lib/i18n";

const COLA: [string, boolean][] = [
  ["Taller Ejemplo SRL", false],
  ["Proveedor Ejemplo S.A.", true],
  ["Transporte Ejemplo", false],
];

export default function MiniFacturas({
  className = "",
  lang = "es",
}: {
  className?: string;
  lang?: Lang;
}) {
  const r = rotulos(lang);
  return (
    <Ventana titulo={r.comprobantes} className={className}>
      <div className="flex flex-col gap-[0.625em] p-[0.75em]">
        <div className="grid grid-cols-2 gap-[0.5em]">
          <div className="border border-linea px-[0.625em] py-[0.5em]">
            <div className="etiqueta text-[0.42em] text-apagado">
              {r.procesadas}
            </div>
            <div className="cifra mt-[0.25em] text-[1em] text-texto">128</div>
          </div>
          <div className="border border-linea px-[0.625em] py-[0.5em]">
            <div className="etiqueta text-[0.42em] text-apagado">
              {r.aRevisar}
            </div>
            <div className="cifra mt-[0.25em] text-[1em] text-oliva-texto">03</div>
          </div>
        </div>
        {/*
          La cola del día, con los mismos comprobantes de ejemplo que la
          pantalla grande de la ficha (PantallaFacturas). Antes eran rayas.
        */}
        <div className="border border-linea">
          <div className="etiqueta border-b border-linea bg-superficie-2 px-[0.6em] py-[0.35em] text-[0.42em] text-grafito">
            {r.cola}
          </div>
          {COLA.map(([nombre, revisar]) => (
            <div
              key={nombre}
              className="flex items-center justify-between gap-[0.5em] border-b border-superficie-2 px-[0.6em] py-[0.32em] last:border-b-0"
            >
              <span className="truncate text-[0.56em] text-texto">{nombre}</span>
              <span
                className={`etiqueta shrink-0 px-[0.5em] py-[0.15em] text-[0.38em] ${
                  revisar ? "bg-oliva text-hueso" : "border border-linea text-apagado"
                }`}
              >
                {revisar ? r.revisar : r.registrada}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Ventana>
  );
}
