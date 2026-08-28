import { rotulos } from "@/lib/mockups";
import type { Lang } from "@/lib/i18n";

const FILAS = [
  { sku: "TG-1042", stock: "412", reserva: "36", alerta: false },
  { sku: "TG-0871", stock: "18", reserva: "24", alerta: true },
  { sku: "TG-2310", stock: "157", reserva: "12", alerta: false },
  { sku: "TG-0455", stock: "89", reserva: "40", alerta: false },
  { sku: "TG-1188", stock: "7", reserva: "15", alerta: true },
];

export default function PantallaGenesis({ lang = "es" }: { lang?: Lang }) {
  const r = rotulos(lang);
  const alertas = r.avisos.map((a, i) => ({ ...a, fuerte: i < 2 }));
  return (
    <div aria-hidden className="overflow-x-auto border border-tinta">
      <div className="flex min-w-[62rem] bg-superficie">
        {/* Barra lateral */}
        <div className="flex w-[13rem] shrink-0 flex-col gap-6 bg-tinta p-5 text-hueso">
          <div className="etiqueta leading-relaxed">
            <span className="block">Génesis</span>
            <span className="block text-oliva-luz">
              {lang === "en" ? "Inventory" : "Inventario"}
            </span>
          </div>
          <ul className="list-none">
            <li className="etiqueta px-2.5 py-2 text-apagado-oscuro">{r.operacion}</li>
            {r.menu.map((s, i) => (
              <li
                key={s}
                className={`etiqueta px-2.5 py-2.5 ${i === 0 ? "bg-oliva-luz text-tinta" : "text-salvia"}`}
              >
                {s}
              </li>
            ))}
            <li className="etiqueta px-2.5 pb-2 pt-4 text-apagado-oscuro">{r.analisis}</li>
            {r.menu2.map((s) => (
              <li key={s} className="etiqueta px-2.5 py-2.5 text-salvia">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2.5 border-t border-linea-oscura pt-4">
            <span className="block size-6 bg-oliva" />
            <span className="etiqueta leading-relaxed">
              <span className="block text-hueso">A. Vignau</span>
              <span className="block text-salvia">{r.admin}</span>
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="grow">
          <div className="flex items-center justify-between border-b border-linea bg-hueso px-6 py-3.5">
            <div className="flex items-baseline gap-3.5">
              <span className="subtitular text-lg">{r.tablero}</span>
              <span className="etiqueta text-apagado">{r.sincronia}</span>
            </div>
            <div className="flex gap-2">
              <span className="etiqueta border border-linea px-3 py-2 text-apagado">
                {r.exportar}
              </span>
              <span className="etiqueta bg-texto px-3 py-2 text-hueso">
                {r.nuevoPedido}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-4 gap-3.5">
              <Kpi rotulo={r.skus} valor="896" nota={r.skusNota} />
              <Kpi rotulo={r.reorden} valor="14" nota={r.reordenNota} acento />
              <Kpi rotulo={r.capital} valor="$ 8,42 M" nota={r.capitalNota} />
              <Kpi rotulo={r.rotacionMes} valor="4,2" nota={r.rotacionNota} />
            </div>

            <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-3.5">
              <div className="border border-linea bg-hueso">
                <div className="flex items-center justify-between border-b border-linea px-4 py-3">
                  <span className="etiqueta">{r.movimiento}</span>
                  <span className="etiqueta text-apagado">{r.orden}</span>
                </div>
                <div className="grid grid-cols-[5rem_minmax(0,1fr)_4.5rem_4.5rem_5.5rem] border-b border-linea bg-superficie-2">
                  {r.cols.map((h, i) => (
                    <span
                      key={h}
                      className={`etiqueta px-3 py-2.5 text-apagado ${i > 1 ? "text-right" : ""}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {FILAS.map((f, idx) => (
                  <div
                    key={f.sku}
                    className={`grid grid-cols-[5rem_minmax(0,1fr)_4.5rem_4.5rem_5.5rem] items-center border-b border-superficie-2 last:border-b-0 ${f.alerta ? "bg-superficie" : ""}`}
                  >
                    <span className="cifra px-3 py-3 text-[0.65rem] text-apagado">
                      {f.sku}
                    </span>
                    <span className="px-3 py-3 text-[0.8rem]">{r.productos[idx]}</span>
                    <span
                      className={`cifra px-3 py-3 text-right text-[0.7rem] ${f.alerta ? "text-oliva-texto" : ""}`}
                    >
                      {f.stock}
                    </span>
                    <span className="cifra px-3 py-3 text-right text-[0.7rem] text-apagado">
                      {f.reserva}
                    </span>
                    <span className="px-3 py-3 text-right">
                      <span
                        className={`etiqueta px-1.5 py-1 ${f.alerta ? "bg-oliva text-hueso" : "border border-linea text-apagado"}`}
                      >
                        {f.alerta ? r.reponer : r.ok}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="border border-linea bg-hueso">
                <div className="border-b border-linea px-4 py-3">
                  <span className="etiqueta">{r.alertas}</span>
                </div>
                {alertas.map((a) => (
                  <div
                    key={a.texto}
                    className="flex items-start gap-3 border-b border-superficie-2 px-4 py-3 last:border-b-0"
                  >
                    <span
                      className={`mt-1.5 block size-1.5 shrink-0 ${a.fuerte ? "bg-oliva" : "bg-acero"}`}
                    />
                    <span>
                      <span className="block text-[0.8rem] leading-snug">
                        {a.texto}
                      </span>
                      <span className="etiqueta mt-1 block text-apagado">
                        {a.meta}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  rotulo,
  valor,
  nota,
  acento = false,
}: {
  rotulo: string;
  valor: string;
  nota: string;
  acento?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 bg-hueso px-4 py-3.5 ${acento ? "border border-oliva" : "border border-linea"}`}
    >
      <span className={`etiqueta ${acento ? "text-oliva-texto" : "text-apagado"}`}>
        {rotulo}
      </span>
      <span className={`cifra text-2xl ${acento ? "text-oliva-texto" : ""}`}>
        {valor}
      </span>
      <span className="etiqueta text-apagado">{nota}</span>
    </div>
  );
}
