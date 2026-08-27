import Ventana from "./Ventana";

export default function MiniFacturas({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Ventana titulo="Comprobantes · Cola" className={className}>
      <div className="flex flex-col gap-2.5 p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-linea px-2.5 py-2">
            <div className="etiqueta text-[0.42rem] text-apagado">
              Procesadas
            </div>
            <div className="cifra mt-1 text-base text-texto">128</div>
          </div>
          <div className="border border-linea px-2.5 py-2">
            <div className="etiqueta text-[0.42rem] text-apagado">
              A revisar
            </div>
            <div className="cifra mt-1 text-base text-oliva">03</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {[100, 82, 91, 64, 88].map((w, i) => (
            <span
              key={i}
              style={{ width: `${w}%` }}
              className={`block h-2 ${i === 3 ? "bg-salvia" : "bg-superficie-2"}`}
            />
          ))}
        </div>
      </div>
    </Ventana>
  );
}
