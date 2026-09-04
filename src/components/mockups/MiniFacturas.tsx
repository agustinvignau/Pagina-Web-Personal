import Ventana from "./Ventana";
import { rotulos } from "@/lib/mockups";
import type { Lang } from "@/lib/i18n";

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
        <div className="flex flex-col gap-[0.375em]">
          {[100, 82, 91, 64, 88].map((w, i) => (
            <span
              key={i}
              style={{ width: `${w}%` }}
              className={`block h-[0.5em] ${i === 3 ? "bg-salvia" : "bg-superficie-2"}`}
            />
          ))}
        </div>
      </div>
    </Ventana>
  );
}
