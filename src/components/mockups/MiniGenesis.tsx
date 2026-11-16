import type { ReactNode } from "react";
import Ventana from "./Ventana";
import { rotulos } from "@/lib/mockups";
import type { Lang } from "@/lib/i18n";

/*
  La ventana de Génesis de la portada. Es una reducción de PantallaGenesis, la
  pantalla grande de la ficha: mismo menú, mismos indicadores, mismos números.

  Hasta noviembre de 2026 era un esquema (rayas por menú y diez barras sin
  ejes). Ahora lleva dos gráficos con ejes: la rotación de los doce meses como
  línea, con la marca del promedio, y los pedidos de las últimas ocho semanas
  en barras. Los datos son inventados, como en el resto de las maquetas.

  Todo se mide en em para que la ventana escale entera (ver Hero).
*/

// Promedia 4,2, que es el indicador de arriba.
const ROTACION = [3.6, 3.9, 3.8, 4.1, 4.0, 4.3, 4.2, 4.5, 4.3, 4.6, 4.4, 4.7];
const PEDIDOS = [42, 55, 48, 61, 53, 70, 58, 74];

const C = {
  linea: "var(--color-linea)",
  oliva: "var(--color-oliva)",
  salvia: "var(--color-salvia)",
  apagado: "var(--color-apagado)",
  texto: "var(--color-texto)",
  fondo: "var(--color-superficie)",
};

function Rotulo({
  x,
  y,
  children,
  ancla = "start",
  color = C.apagado,
  tam = 7,
}: {
  x: number;
  y: number;
  children: ReactNode;
  ancla?: "start" | "middle" | "end";
  color?: string;
  tam?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={ancla} style={{ fill: color, fontFamily: "var(--font-mono)", fontSize: tam, letterSpacing: "0.04em" }}>
      {children}
    </text>
  );
}

function Rotacion({ meses, promedio, coma }: { meses: string[]; promedio: string; coma: string }) {
  const W = 190;
  const H = 96;
  const m = { l: 16, r: 24, t: 10, b: 14 };
  const x = (i: number) => m.l + (i / (ROTACION.length - 1)) * (W - m.l - m.r);
  const y = (v: number) => H - m.b - ((v - 3) / 2) * (H - m.t - m.b);
  const puntos = ROTACION.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const ultimo = ROTACION[ROTACION.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
      {[3, 4, 5].map((v) => (
        <g key={v}>
          <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} style={{ stroke: C.linea, strokeWidth: 0.6 }} />
          <Rotulo x={m.l - 4} y={y(v) + 2.5} ancla="end">{v}</Rotulo>
        </g>
      ))}
      <polygon points={`${m.l},${y(3)} ${puntos} ${x(ROTACION.length - 1)},${y(3)}`} style={{ fill: C.oliva, fillOpacity: 0.12 }} />
      <line x1={m.l} x2={W - m.r} y1={y(4.2)} y2={y(4.2)} style={{ stroke: C.apagado, strokeWidth: 0.7, strokeDasharray: "3 3" }} />
      <Rotulo x={W - m.r + 3} y={y(4.2) + 2.5} tam={6}>{promedio}</Rotulo>
      <polyline points={puntos} style={{ fill: "none", stroke: C.oliva, strokeWidth: 1.8, strokeLinejoin: "round", strokeLinecap: "round" }} />
      <circle cx={x(ROTACION.length - 1)} cy={y(ultimo)} r={3.2} style={{ fill: C.oliva, stroke: C.fondo, strokeWidth: 1.4 }} />
      <Rotulo x={x(ROTACION.length - 1)} y={y(ultimo) - 6} ancla="middle" color={C.texto} tam={7.5}>
        {String(ultimo).replace(".", coma)}
      </Rotulo>
      {meses.map((mes, i) => (
        <Rotulo key={i} x={x(i)} y={H - 3} ancla="middle" tam={6}>{mes}</Rotulo>
      ))}
    </svg>
  );
}

function Pedidos() {
  const W = 130;
  const H = 96;
  const m = { l: 16, r: 4, t: 10, b: 14 };
  const paso = (W - m.l - m.r) / PEDIDOS.length;
  const y = (v: number) => H - m.b - (v / 80) * (H - m.t - m.b);
  const ultimo = PEDIDOS.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
      {[0, 40, 80].map((v) => (
        <g key={v}>
          <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} style={{ stroke: C.linea, strokeWidth: 0.6 }} />
          <Rotulo x={m.l - 4} y={y(v) + 2.5} ancla="end">{v}</Rotulo>
        </g>
      ))}
      {PEDIDOS.map((v, i) => (
        <g key={i}>
          <rect
            x={m.l + i * paso + paso * 0.18}
            y={y(v)}
            width={paso * 0.64}
            height={y(0) - y(v)}
            style={{ fill: i === ultimo ? C.oliva : C.salvia }}
          />
          <Rotulo x={m.l + i * paso + paso / 2} y={H - 3} ancla="middle" tam={6}>{i + 1}</Rotulo>
        </g>
      ))}
      <Rotulo x={m.l + ultimo * paso + paso / 2} y={y(PEDIDOS[ultimo]) - 3} ancla="middle" color={C.texto} tam={7.5}>
        {PEDIDOS[ultimo]}
      </Rotulo>
    </svg>
  );
}

export default function MiniGenesis({
  className = "",
  lang = "es",
}: {
  className?: string;
  lang?: Lang;
}) {
  const r = rotulos(lang);
  const coma = lang === "en" ? "." : ",";
  return (
    <Ventana titulo={r.genesis} className={className}>
      <div className="flex">
        <div className="hidden w-[6.4em] shrink-0 flex-col gap-[0.35em] border-r border-linea px-[0.55em] py-[0.75em] sm:flex">
          <span className="etiqueta mb-[0.5em] block text-[0.4em] text-apagado">{r.operacion}</span>
          {r.menu.map((item, i) => (
            <span
              key={item}
              className={`block whitespace-nowrap px-[0.9em] py-[0.6em] text-[0.56em] leading-none ${
                i === 0 ? "bg-oliva font-semibold text-superficie" : "text-apagado"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 grow flex-col gap-[0.65em] p-[0.8em]">
          <div className="grid grid-cols-3 gap-[0.55em]">
            <Kpi rotulo={r.skus} valor="896" nota={r.sectores4} />
            <Kpi rotulo={r.stockBajo} valor="14" nota="▲ 3" acento />
            <Kpi rotulo={r.rotacion} valor={`4${coma}2`} nota={r.meses12} />
          </div>

          <div className="grid grid-cols-[1.45fr_1fr] gap-[0.55em]">
            <Caja titulo={r.rotacionMes}>
              <Rotacion meses={r.meses} promedio={r.promedio} coma={coma} />
            </Caja>
            <Caja titulo={r.pedidosSemana}>
              <Pedidos />
            </Caja>
          </div>
        </div>
      </div>
    </Ventana>
  );
}

function Caja({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-[0.3em] border border-linea px-[0.6em] pb-[0.4em] pt-[0.5em]">
      <span className="etiqueta block truncate text-[0.42em] text-grafito">{titulo}</span>
      {children}
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
    <div className="min-w-0 border border-linea px-[0.625em] py-[0.5em]">
      <div className="etiqueta truncate text-[0.42em] text-apagado">{rotulo}</div>
      <div className="mt-[0.22em] flex items-baseline gap-[0.4em]">
        <span className={`cifra text-[1.125em] ${acento ? "text-oliva-texto" : "text-texto"}`}>{valor}</span>
        <span className={`cifra whitespace-nowrap text-[0.42em] ${acento ? "text-oliva-texto" : "text-apagado"}`}>{nota}</span>
      </div>
    </div>
  );
}
