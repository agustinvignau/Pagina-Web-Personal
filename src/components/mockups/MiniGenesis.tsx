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
        <div className="hidden w-[92px] shrink-0 flex-col gap-2.5 border-r border-linea p-3 sm:flex">
          <span className="block h-[7px] w-[70%] bg-oliva" />
          <span className="block h-[7px] w-[90%] bg-linea" />
          <span className="block h-[7px] w-[60%] bg-linea" />
          <span className="block h-[7px] w-[78%] bg-linea" />
          <span className="block h-[7px] w-[52%] bg-linea" />
        </div>

        <div className="flex grow flex-col gap-3 p-3.5">
          <div className="grid grid-cols-3 gap-2.5">
            <Kpi rotulo={r.skus} valor="896" />
            <Kpi rotulo={r.stockBajo} valor="14" acento />
            <Kpi rotulo={r.rotacion} valor="4,2" />
          </div>

          <div className="flex h-[92px] items-end gap-1.5 border border-linea p-3">
            {BARRAS.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`block w-4 grow ${h > 80 ? "bg-oliva" : "bg-salvia"}`}
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
    <div className="border border-linea px-2.5 py-2">
      <div className="etiqueta text-[0.42rem] text-apagado">{rotulo}</div>
      <div
        className={`cifra mt-1 text-lg ${acento ? "text-oliva" : "text-texto"}`}
      >
        {valor}
      </div>
    </div>
  );
}
