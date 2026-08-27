const CAMPOS = [
  { rotulo: "Empresa", valor: "Insumos Gráficos del Sur S.A." },
  { rotulo: "N° de comprobante", valor: "0004-00012877", mono: true },
  { rotulo: "Fecha de emisión", valor: "2026-08-18", mono: true },
  { rotulo: "Tipo", valor: "Factura A", regla: true },
  { rotulo: "IVA", valor: "269.829,00", mono: true },
  { rotulo: "Percepciones", valor: "38.547,00", mono: true },
  { rotulo: "Moneda", valor: "ARS", mono: true },
  { rotulo: "Tipo de cambio", valor: "—", mono: true },
];

export default function PantallaFacturas() {
  return (
    <div aria-hidden className="overflow-x-auto border border-tinta">
      <div className="grid min-w-[54rem] grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 bg-superficie p-5">
        {/* Documento */}
        <div className="border border-linea bg-hueso">
          <div className="flex items-center justify-between border-b border-linea bg-superficie-2 px-4 py-3">
            <span className="etiqueta">Documento recibido</span>
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
                ["Comprobante", "0004-00012877"],
                ["Fecha de emisión", "18/08/2026"],
                ["CAE", "76194028551903"],
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
                ["Subtotal", "1.284.900,00"],
                ["IVA 21%", "269.829,00"],
                ["Percep. IIBB", "38.547,00"],
              ].map(([k, v]) => (
                <span key={k} className="flex gap-8">
                  <span className="text-apagado">{k}</span>
                  <span className="cifra w-24 text-right text-[0.72rem]">{v}</span>
                </span>
              ))}
              <span className="flex gap-8 border-t border-texto pt-2 font-semibold">
                <span>Total</span>
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
              <span className="etiqueta">Campos extraídos</span>
              <span className="etiqueta text-apagado">11 de 11 · 1,8 s</span>
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
                        Por regla
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
                El comprobante no traía CAE, pero el número contiene «-A»: se
                clasificó como Factura A por regla y queda marcado para revisión.
              </span>
              <span className="etiqueta mt-1.5 block text-apagado">
                Regla fiscal 04 · Aplicada automáticamente
              </span>
            </span>
          </div>

          <div className="border border-linea bg-hueso">
            <div className="border-b border-linea bg-superficie-2 px-4 py-3">
              <span className="etiqueta">Cola del día</span>
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
                  {revisar ? "A revisar" : "Registrada"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
