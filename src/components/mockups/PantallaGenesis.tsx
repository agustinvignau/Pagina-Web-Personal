const FILAS = [
  { sku: "TG-1042", producto: "Taza sublimable 11oz — blanca", stock: "412", reserva: "36", alerta: false },
  { sku: "TG-0871", producto: "Remera algodón peinado — M", stock: "18", reserva: "24", alerta: true },
  { sku: "TG-2310", producto: "Vaso térmico acero 500ml", stock: "157", reserva: "12", alerta: false },
  { sku: "TG-0455", producto: "Gorra bordada — negra", stock: "89", reserva: "40", alerta: false },
  { sku: "TG-1188", producto: "Mousepad sublimable XL", stock: "7", reserva: "15", alerta: true },
];

const ALERTAS = [
  { texto: "Remera algodón peinado — M por debajo del reorden", meta: "Hace 2 h · Sector textil", fuerte: true },
  { texto: "Mousepad sublimable XL con 2 pedidos en espera", meta: "Hace 5 h · Sector sublimación", fuerte: true },
  { texto: "Precio de proveedor desactualizado hace 34 días", meta: "Ayer · 3 proveedores", fuerte: false },
];

export default function PantallaGenesis() {
  return (
    <div aria-hidden className="overflow-x-auto border border-tinta">
      <div className="flex min-w-[62rem] bg-superficie">
        {/* Barra lateral */}
        <div className="flex w-[13rem] shrink-0 flex-col gap-6 bg-tinta p-5 text-hueso">
          <div className="etiqueta leading-relaxed">
            <span className="block">Génesis</span>
            <span className="block text-oliva-luz">Inventario</span>
          </div>
          <ul className="list-none">
            <li className="etiqueta px-2.5 py-2 text-apagado">Operación</li>
            {["Tablero", "Pedidos", "Recepciones", "Catálogo"].map((s, i) => (
              <li
                key={s}
                className={`etiqueta px-2.5 py-2.5 ${i === 0 ? "bg-oliva-luz text-tinta" : "text-salvia"}`}
              >
                {s}
              </li>
            ))}
            <li className="etiqueta px-2.5 pb-2 pt-4 text-apagado">Análisis</li>
            {["Rotación", "Proveedores"].map((s) => (
              <li key={s} className="etiqueta px-2.5 py-2.5 text-salvia">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2.5 border-t border-linea-oscura pt-4">
            <span className="block size-6 bg-oliva" />
            <span className="etiqueta leading-relaxed">
              <span className="block text-hueso">A. Vignau</span>
              <span className="block text-salvia">Administrador</span>
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="grow">
          <div className="flex items-center justify-between border-b border-linea bg-hueso px-6 py-3.5">
            <div className="flex items-baseline gap-3.5">
              <span className="subtitular text-lg">Tablero de operación</span>
              <span className="etiqueta text-apagado">
                Última sincronía 09:41
              </span>
            </div>
            <div className="flex gap-2">
              <span className="etiqueta border border-linea px-3 py-2 text-apagado">
                Exportar CSV
              </span>
              <span className="etiqueta bg-texto px-3 py-2 text-hueso">
                Nuevo pedido
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-4 gap-3.5">
              <Kpi rotulo="SKUs activos" valor="896" nota="13 tablas · 4 sectores" />
              <Kpi rotulo="Bajo punto de reorden" valor="14" nota="Umbral configurable" acento />
              <Kpi rotulo="Capital inmovilizado" valor="$ 8,42 M" nota="A precio de proveedor" />
              <Kpi rotulo="Rotación mensual" valor="4,2" nota="Promedio 12 meses" />
            </div>

            <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-3.5">
              <div className="border border-linea bg-hueso">
                <div className="flex items-center justify-between border-b border-linea px-4 py-3">
                  <span className="etiqueta">Movimiento por SKU</span>
                  <span className="etiqueta text-apagado">
                    Ordenado por rotación ↓
                  </span>
                </div>
                <div className="grid grid-cols-[5rem_minmax(0,1fr)_4.5rem_4.5rem_5.5rem] border-b border-linea bg-superficie-2">
                  {["SKU", "Producto", "Stock", "Reserva", "Estado"].map((h, i) => (
                    <span
                      key={h}
                      className={`etiqueta px-3 py-2.5 text-apagado ${i > 1 ? "text-right" : ""}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {FILAS.map((f) => (
                  <div
                    key={f.sku}
                    className={`grid grid-cols-[5rem_minmax(0,1fr)_4.5rem_4.5rem_5.5rem] items-center border-b border-superficie-2 last:border-b-0 ${f.alerta ? "bg-superficie" : ""}`}
                  >
                    <span className="cifra px-3 py-3 text-[0.65rem] text-apagado">
                      {f.sku}
                    </span>
                    <span className="px-3 py-3 text-[0.8rem]">{f.producto}</span>
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
                        {f.alerta ? "Reponer" : "OK"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="border border-linea bg-hueso">
                <div className="border-b border-linea px-4 py-3">
                  <span className="etiqueta">Alertas activas</span>
                </div>
                {ALERTAS.map((a) => (
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
