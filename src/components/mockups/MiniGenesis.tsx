import Ventana from "./Ventana";
import { rotulos } from "@/lib/mockups";
import type { Lang } from "@/lib/i18n";

const BARRAS = [34, 52, 44, 71, 61, 83, 55, 92, 47, 66];

export default function MiniGenesis({
  className = "",
  lang = "es",
}: {
  className?: string;
  lang?: Lang;
}) {
  const r = rotulos(lang);
  return (
    <Ventana titulo={r.genesis} className={className}>
      <div className="flex">
        <div className="hidden w-[5.75em] shrink-0 flex-col gap-[0.625em] border-r border-linea p-[0.75em] sm:flex">
          <span className="block h-[0.4375em] w-[70%] bg-oliva" />
          <span className="block h-[0.4375em] w-[90%] bg-linea" />
          <span className="block h-[0.4375em] w-[60%] bg-linea" />
          <span className="block h-[0.4375em] w-[78%] bg-linea" />
          <span className="block h-[0.4375em] w-[52%] bg-linea" />
        </div>

        <div className="flex grow flex-col gap-[0.75em] p-[0.875em]">
          <div className="grid grid-cols-3 gap-[0.625em]">
            <Kpi rotulo={r.skus} valor="896" />
            <Kpi rotulo={r.stockBajo} valor="14" acento />
            <Kpi rotulo={r.rotacion} valor="4,2" />
          </div>

          <div className="flex h-[5.75em] items-end gap-[0.375em] border border-linea p-[0.75em]">
            {BARRAS.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`block w-[1em] grow ${h > 80 ? "bg-oliva" : "bg-salvia"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Ventana>
  );
}

function Kpi({
  rotulo,
  valor,
  acento = false,
}: {
  rotulo: string;
  valor: string;
  acento?: boolean;
}) {
  return (
    <div className="border border-linea px-[0.625em] py-[0.5em]">
      <div className="etiqueta text-[0.42em] text-apagado">{rotulo}</div>
      <div
        className={`cifra mt-[0.22em] text-[1.125em] ${acento ? "text-oliva-texto" : "text-texto"}`}
      >
        {valor}
      </div>
    </div>
  );
}
