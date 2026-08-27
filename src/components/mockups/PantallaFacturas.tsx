import { rotulos } from "@/lib/mockups";
import type { Lang } from "@/lib/i18n";

export default function PantallaFacturas({ lang = "es" }: { lang?: Lang }) {
  const r = rotulos(lang);
  const CAMPOS = [
    { rotulo: r.rotulos.empresa, valor: "Insumos Gráficos del Sur S.A." },
    { rotulo: r.rotulos.comprobante, valor: "0004-00012877", mono: true },
    { rotulo: r.rotulos.fecha, valor: "2026-08-18", mono: true },
    { rotulo: r.rotulos.tipo, valor: lang === "en" ? "A-type invoice" : "Factura A", regla: true },
    { rotulo: r.rotulos.iva, valor: "269.829,00", mono: true },
    { rotulo: r.rotulos.percepciones, valor: "38.547,00", mono: true },
    { rotulo: r.rotulos.moneda, valor: "ARS", mono: true },
    { rotulo: r.rotulos.cambio, valor: "—", mono: true },
  ];
  return (
    <div aria-hidden className="overflow-x-auto border border-tinta">
      <div className="grid min-w-[54rem] grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 bg-superficie p-5">
        {/* Documento */}
        <div className="border border-linea bg-hueso">
          <div className="flex items-center justify-between border-b border-linea bg-superficie-2 px-4 py-3">
            <span className="etiqueta">{r.documento}</span>
            <span className="etiqueta text-apagado">FC-A-0004-00012877.pdf</span>
          </div>
          <div className="flex flex-col gap-4 px-6 py-6">
            <div className="flex items-start justify-between">
              <span>
                <span className="subtitular block text-base">
                  Insumos Gráficos del Sur S.A.
                </span>
                <span className="etiqueta mt-1 block text-apagado">
                  CUIT 30-71298455-4
                </span>
              </span>
              <span className="cifra border border-texto px-3 py-1.5 text-sm">
                A
              </span>
            </div>
            <span className="block h-px bg-linea" />
            <div className="flex flex-col gap-2 text-[0.8rem]">
              {[
                [r.rotulos.comprobante, "0004-00012877"],
                [r.rotulos.fecha, "18/08/2026"],
                [r.rotulos.cae, "76194028551903"],
              ].map(([k, v]) => (
                <span key={k} className="flex justify-between">
                  <span className="text-apagado">{k}</span>
                  <span className="cifra text-[0.72rem]">{v}</span>
                </span>
              ))}
            </div>
            <span className="block h-px bg-linea" />
            <div className="flex flex-col gap-1.5">
              {[100, 88, 94, 71].map((w, i) => (
                <span
                  key={i}
                  style={{ width: `${w}%` }}
                  className="block h-2 bg-superficie-2"
                />
              ))}
            </div>
            <span className="block h-px bg-linea" />
            <div className="flex flex-col items-end gap-2 text-[0.8rem]">
              {[
                [r.rotulos.subtotal, "1.284.900,00"],
                [r.rotulos.ivaPct, "269.829,00"],
                [r.rotulos.iibb, "38.547,00"],
              ].map(([k, v]) => (
                <span key={k} className="flex gap-8">
                  <span className="text-apagado">{k}</span>
                  <span className="cifra w-24 text-right text-[0.72rem]">{v}</span>
                </span>
              ))}
              <span className="flex gap-8 border-t border-texto pt-2 font-semibold">
                <span>{r.rotulos.total}</span>
                <span className="cifra w-24 text-right text-[0.78rem]">
                  1.593.276,00
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Extracción */}
        <div className="flex flex-col gap-3.5">
          <div className="border border-linea bg-hueso">
            <div className="flex items-center justify-between border-b border-linea bg-superficie-2 px-4 py-3">
              <span className="etiqueta">{r.campos}</span>
              <span className="etiqueta text-apagado">{r.camposNota}</span>
            </div>
            <div className="grid grid-cols-2">
              {CAMPOS.map((c, i) => (
                <div
                  key={c.rotulo}
                  className={`px-4 py-3 ${i % 2 === 0 ? "border-r border-superficie-2" : ""} ${i < CAMPOS.length - 2 ? "border-b border-superficie-2" : ""}`}
                >
                  <span className="etiqueta block text-apagado">{c.rotulo}</span>
                  <span
                    className={`mt-1 block text-[0.8rem] ${c.mono ? "cifra text-[0.75rem]" : ""}`}
                  >
                    {c.valor}
                    {c.regla ? (
                      <span className="etiqueta ml-2 border border-oliva px-1.5 py-0.5 text-oliva-texto">
                        {r.porRegla}
                      </span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 border border-oliva bg-hueso px-4 py-3.5">
            <span className="mt-1.5 block size-1.5 shrink-0 bg-oliva" />
            <span>
              <span className="block text-[0.85rem] leading-snug">
                {r.reglaAviso}
              </span>
              <span className="etiqueta mt-1.5 block text-apagado">
                {r.reglaMeta}
              </span>
            </span>
          </div>

          <div className="border border-linea bg-hueso">
            <div className="border-b border-linea bg-superficie-2 px-4 py-3">
              <span className="etiqueta">{r.cola}</span>
            </div>
            {[
              ["Metalúrgica Rivadavia SRL", false],
              ["Insumos Gráficos del Sur S.A.", true],
              ["Transporte Belgrano", false],
              ["Papelera Continental", false],
            ].map(([nombre, revisar]) => (
              <div
                key={nombre as string}
                className="flex items-center justify-between border-b border-superficie-2 px-4 py-3 last:border-b-0"
              >
                <span className="text-[0.8rem]">{nombre as string}</span>
                <span
                  className={`etiqueta px-1.5 py-1 ${revisar ? "bg-oliva text-hueso" : "border border-linea text-apagado"}`}
                >
                  {revisar ? r.revisar : r.registrada}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
