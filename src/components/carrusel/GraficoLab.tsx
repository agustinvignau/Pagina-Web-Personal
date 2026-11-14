import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { LAB } from "@/lib/laboratorio-datos";
import {
  AB_DIA_ESTABLE,
  DIAS_RANGO,
  SERVICIO_RANGO,
  abStats,
  forecastPolitica,
  type FiltroAnomalias,
} from "@/lib/laboratorio-calculos";

/*
  El gráfico principal de cada estudio del Laboratorio, dibujado con los datos
  del repo. Es SVG y no una imagen a propósito: el mismo dibujo sirve de
  portada en el carrusel (quieto, con los valores del estudio) y de gráfico
  interactivo en la ficha, donde LabInteractivo le pasa el valor del control.

  Este archivo no lleva "use client": en la portada se dibuja en el servidor y
  no manda datos ni código al navegador. Solo la ficha lo hidrata.

  Todo se dibuja en un lienzo de 640 × 400 con una sola escala por eje, y los
  colores salen de la paleta del sitio.
*/

export const W = 640;
export const H = 400;
const M = { l: 54, r: 24, t: 70, b: 44 };
/* En la ficha, abajo va la regla del control: el gráfico deja más lugar. */
const MB_REGLA = 64;
/* La regla de días o de nivel de servicio, en la franja de abajo. */
export const REGLA = { x0: M.l, x1: W - M.r, y: H - 26 };

const C = {
  hueso: "var(--color-hueso)",
  salvia: "var(--color-salvia)",
  acero: "var(--color-acero)",
  luz: "var(--color-oliva-luz)",
  linea: "var(--color-linea-oscura)",
  apagado: "var(--color-apagado-oscuro)",
  arcilla: "#c9a27a",
  fondo: "#1b1c15",
};

export const escala = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/* El área de dibujo del churn, para que el arrastre use la misma escala. */
export const CHURN_X = { x0: M.l, x1: W - M.r };

export const fmt = (lang: Lang, v: number, dec = 0) =>
  v.toLocaleString(lang === "en" ? "en-US" : "es-AR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

function Lienzo({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={etiqueta}
      className="block h-full w-full"
      style={{ background: C.fondo }}
    >
      {children}
    </svg>
  );
}

function Texto({
  x,
  y,
  children,
  ancla = "start",
  color = C.apagado,
  tam = 11,
}: {
  x: number;
  y: number;
  children: ReactNode;
  ancla?: "start" | "middle" | "end";
  color?: string;
  tam?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={ancla}
      style={{ fill: color, fontFamily: "var(--font-mono)", fontSize: tam, letterSpacing: "0.04em" }}
    >
      {children}
    </text>
  );
}

function Grilla({ valores, y, rotulo }: { valores: number[]; y: (v: number) => number; rotulo: (v: number) => string }) {
  return (
    <g>
      {valores.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} style={{ stroke: C.linea }} />
          <Texto x={M.l - 10} y={y(v) + 4} ancla="end">
            {rotulo(v)}
          </Texto>
        </g>
      ))}
    </g>
  );
}

/* La manija que se arrastra: un rectángulo hueso con dos rayas. */
function Manija({ x, y, alto = 22 }: { x: number; y: number; alto?: number }) {
  return (
    <g aria-hidden>
      <rect x={x - 6} y={y - alto / 2} width={12} height={alto} style={{ fill: C.hueso }} />
      <line x1={x - 2} x2={x - 2} y1={y - alto / 2 + 6} y2={y + alto / 2 - 6} style={{ stroke: C.fondo }} />
      <line x1={x + 2} x2={x + 2} y1={y - alto / 2 + 6} y2={y + alto / 2 - 6} style={{ stroke: C.fondo }} />
    </g>
  );
}

/* La regla de abajo: tramo recorrido en oliva, marcas y la manija. */
function Regla({
  valor,
  min,
  max,
  marcas,
  rotulo,
  hito,
}: {
  valor: number;
  min: number;
  max: number;
  marcas: number[];
  rotulo: (v: number) => string;
  hito?: { valor: number; texto: string } | null;
}) {
  const x = escala(min, max, REGLA.x0, REGLA.x1);
  return (
    <g>
      <line x1={REGLA.x0} x2={REGLA.x1} y1={REGLA.y} y2={REGLA.y} style={{ stroke: C.linea, strokeWidth: 2 }} />
      <line x1={REGLA.x0} x2={x(valor)} y1={REGLA.y} y2={REGLA.y} style={{ stroke: C.luz, strokeWidth: 2 }} />
      {marcas.map((v) => (
        <Texto key={v} x={x(v)} y={REGLA.y + 18} ancla="middle" tam={10}>
          {rotulo(v)}
        </Texto>
      ))}
      {hito ? (
        <g>
          <line x1={x(hito.valor)} x2={x(hito.valor)} y1={REGLA.y - 7} y2={REGLA.y + 7} style={{ stroke: C.hueso }} />
          <Texto x={x(hito.valor)} y={REGLA.y + 18} ancla="middle" tam={10} color={C.hueso}>
            {hito.texto}
          </Texto>
        </g>
      ) : null}
      <Manija x={x(valor)} y={REGLA.y} />
    </g>
  );
}

/* ---------- 1. Forecasting: la serie real, el pronóstico y el colchón de stock ---------- */

export function Forecast({ lang, servicio }: { lang: Lang; servicio?: number }) {
  const f = LAB.forecast;
  const en = lang === "en";
  const interactivo = servicio !== undefined;
  const pol = interactivo ? forecastPolitica(servicio) : null;
  const n = f.historia.length;
  const total = n + f.real.length;
  // El techo del eje contempla el colchón más alto que permite el control.
  const techo = Math.max(...f.historia, ...f.real, ...f.pred, ...(interactivo ? f.pred.map((p) => p + forecastPolitica(SERVICIO_RANGO.max).seguridad) : []));
  const max = Math.ceil(techo / 100) * 100;
  const mb = interactivo ? MB_REGLA : M.b;
  const x = escala(0, total - 1, M.l, W - M.r);
  const y = escala(0, max, H - mb, M.t);
  const linea = (vals: readonly number[], desde: number) =>
    vals.map((v, i) => `${x(i + desde).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const paso = max / 4;
  const banda = pol
    ? [
        ...f.pred.map((p, i) => `${x(n + i).toFixed(1)},${y(p + pol.seguridad).toFixed(1)}`),
        ...[...f.pred].reverse().map((p, i) => `${x(n + f.pred.length - 1 - i).toFixed(1)},${y(p).toFixed(1)}`),
      ].join(" ")
    : "";
  const pct = (v: number) => `${fmt(lang, v, v % 1 ? 1 : 0)}${en ? "%" : " %"}`;
  return (
    <Lienzo
      etiqueta={
        pol
          ? en
            ? `Weekly units of ${f.producto} with the ${f.modelo} forecast and a safety stock of ${fmt(lang, pol.seguridad)} units for a ${pct(servicio!)} service level. Demand went over forecast plus safety stock in ${pol.semanasFalta} of ${pol.semanas} test weeks.`
            : `Unidades por semana de ${f.producto} con el pronóstico de ${f.modelo} y un stock de seguridad de ${fmt(lang, pol.seguridad)} unidades para un nivel de servicio del ${pct(servicio!)}. La demanda superó pronóstico más colchón en ${pol.semanasFalta} de ${pol.semanas} semanas de prueba.`
          : en
            ? `Weekly units of ${f.producto}: last year of history, then the 12 test weeks with the actual series and the ${f.modelo} forecast. MAPE ${fmt(lang, f.mape, 1)}%.`
            : `Unidades por semana de ${f.producto}: el último año de historia y después las 12 semanas de test, con la serie real y el pronóstico de ${f.modelo}. MAPE ${fmt(lang, f.mape, 1)} %.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? `${f.producto} · units per week` : `${f.producto} · unidades por semana`}
      </Texto>
      <Texto x={W - M.r} y={34} ancla="end" color={C.luz} tam={12}>
        {pol
          ? en
            ? `safety stock ${fmt(lang, pol.seguridad)} u.`
            : `colchón ${fmt(lang, pol.seguridad)} u.`
          : `MAPE ${fmt(lang, f.mape, 1)}${en ? "%" : " %"}`}
      </Texto>
      <Grilla valores={[0, paso, paso * 2, paso * 3, max]} y={y} rotulo={(v) => fmt(lang, v)} />
      <rect x={x(n - 0.5)} y={M.t - 12} width={W - M.r - x(n - 0.5)} height={H - mb - M.t + 12} style={{ fill: C.luz, fillOpacity: 0.07 }} />
      {pol ? <polygon points={banda} style={{ fill: C.luz, fillOpacity: 0.22 }} /> : null}
      <polyline points={linea(f.historia, 0)} style={{ fill: "none", stroke: C.hueso, strokeWidth: 2, strokeLinejoin: "round" }} />
      <polyline points={linea([f.historia[n - 1], ...f.real], n - 1)} style={{ fill: "none", stroke: C.hueso, strokeWidth: 2, strokeLinejoin: "round", strokeOpacity: 0.55 }} />
      <polyline points={linea([f.historia[n - 1], ...f.pred], n - 1)} style={{ fill: "none", stroke: C.luz, strokeWidth: 2.6, strokeDasharray: "6 5" }} />
      {pol
        ? f.real.map((r, i) =>
            pol.faltas[i] ? (
              <circle key={i} cx={x(n + i)} cy={y(r)} r={5.5} style={{ fill: C.arcilla, stroke: C.fondo, strokeWidth: 2 }} />
            ) : null,
          )
        : null}
      {pol ? (
        <>
          <Texto x={M.l} y={H - mb + 20}>{en ? "← 52 weeks of history" : "← 52 semanas de historia"}</Texto>
          <Texto x={W - M.r} y={H - mb + 20} ancla="end" color={C.luz}>
            {en ? "■ safety stock  ● stockout" : "■ colchón  ● quiebre"}
          </Texto>
          <Regla
            valor={servicio!}
            min={SERVICIO_RANGO.min}
            max={SERVICIO_RANGO.max}
            marcas={[80, 85, 90, 95]}
            rotulo={pct}
            hito={{ valor: f.servicioOptimo, texto: en ? "study" : "estudio" }}
          />
        </>
      ) : (
        <>
          <Texto x={M.l} y={H - 16}>{en ? "← 52 weeks of history" : "← 52 semanas de historia"}</Texto>
          <Texto x={W - M.r} y={H - 16} ancla="end" color={C.luz}>
            {en ? "test: actual vs forecast" : "test: real vs pronóstico"}
          </Texto>
        </>
      )}
    </Lienzo>
  );
}

/* ---------- 2. Anomalías: cada orden según cuánto se aparta su cantidad y su precio ---------- */

export function Anomalias({
  lang,
  filtro,
  alFiltrar,
}: {
  lang: Lang;
  filtro?: FiltroAnomalias;
  alFiltrar?: (f: FiltroAnomalias) => void;
}) {
  const a = LAB.anomalias;
  const x = escala(-2, 16, M.l, W - M.r);
  const y = escala(-7, 16, H - M.b, M.t);
  const en = lang === "en";
  const ciertas = a.alertas.filter((p) => p[2] === 1).length;
  const interactivo = filtro !== undefined;
  const ve = (real: number) => !interactivo || filtro === "todas" || (filtro === "reales") === (real === 1);
  const opciones: { id: FiltroAnomalias; texto: string; color: string }[] = [
    { id: "todas", texto: en ? "All" : "Todas", color: C.hueso },
    { id: "reales", texto: en ? "● Errors" : "● Errores", color: C.luz },
    { id: "falsas", texto: en ? "◌ False alarms" : "◌ Falsas alarmas", color: C.acero },
  ];
  const anchos = [62, 104, 150];
  return (
    <Lienzo
      etiqueta={
        en
          ? `Production orders plotted by how far quantity and price deviate from each product's norm. ${a.alertas.length} flagged, ${ciertas} of them real errors.`
          : `Órdenes de producción según cuánto se apartan su cantidad y su precio de lo normal para cada producto. ${a.alertas.length} marcadas, ${ciertas} de ellas errores reales.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? "Price vs quantity · z-score per product" : "Precio vs cantidad · z-score por producto"}
      </Texto>
      <Texto x={W - M.r} y={34} ancla="end" color={C.luz} tam={12}>
        {en ? `${a.alertas.length} flagged` : `${a.alertas.length} marcadas`}
      </Texto>
      <Grilla valores={[-5, 0, 5, 10, 15]} y={y} rotulo={(v) => fmt(lang, v)} />
      {a.normales.map(([cx, cy], i) => (
        <circle key={i} cx={x(cx)} cy={y(cy)} r={2.6} style={{ fill: C.salvia, fillOpacity: interactivo && filtro !== "todas" ? 0.18 : 0.4 }} />
      ))}
      {a.alertas.map(([cx, cy, real], i) => {
        const opacidad = ve(real) ? 1 : 0.15;
        return real ? (
          <g key={i} style={{ opacity: opacidad }}>
            <circle cx={x(cx)} cy={y(cy)} r={7} style={{ fill: "none", stroke: C.luz, strokeWidth: 1.6 }} />
            <circle cx={x(cx)} cy={y(cy)} r={2.8} style={{ fill: C.luz }} />
          </g>
        ) : (
          <circle key={i} cx={x(cx)} cy={y(cy)} r={6} style={{ fill: "none", stroke: C.acero, strokeWidth: 1.2, strokeDasharray: "2 2", opacity: opacidad }} />
        );
      })}
      <Texto x={W - M.r} y={H - 16} ancla="end">
        {en ? "Quantity (z) →" : "Cantidad (z) →"}
      </Texto>
      {interactivo ? (
        <g>
          {opciones.map((o, i) => {
            const x0 = M.l + anchos.slice(0, i).reduce((s, v) => s + v + 8, 0);
            const activo = filtro === o.id;
            return (
              <g
                key={o.id}
                role="button"
                tabIndex={0}
                aria-pressed={activo}
                aria-label={o.texto.replace(/^[●◌] /, "")}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--color-oliva-luz)]"
                onClick={() => alFiltrar?.(o.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    alFiltrar?.(o.id);
                  }
                }}
              >
                <rect
                  x={x0}
                  y={H - 34}
                  width={anchos[i]}
                  height={26}
                  style={{ fill: activo ? C.hueso : "transparent", stroke: activo ? C.hueso : C.linea, strokeWidth: 1.5 }}
                />
                <Texto x={x0 + anchos[i] / 2} y={H - 17} ancla="middle" tam={10.5} color={activo ? C.fondo : o.color}>
                  {o.texto}
                </Texto>
              </g>
            );
          })}
        </g>
      ) : (
        <Texto x={M.l} y={H - 16} color={C.luz}>
          {en ? `● error caught  ◌ false alarm` : `● error detectado  ◌ falsa alarma`}
        </Texto>
      )}
    </Lienzo>
  );
}

/* ---------- 3. Churn: cómo se reparte el riesgo y dónde corta el umbral ---------- */

export function Churn({ lang, umbral: elegido }: { lang: Lang; umbral?: number }) {
  const c = LAB.churn;
  const en = lang === "en";
  const interactivo = elegido !== undefined;
  const umbral = elegido ?? 0.5;
  const ancho = 0.05;
  const cajas = Array.from({ length: 20 }, (_, i) => {
    const desde = i * ancho;
    const dentro = c.probs.map((p, j) => ({ p, real: c.reales[j] })).filter((d) => d.p >= desde && (d.p < desde + ancho || (i === 19 && d.p <= 1)));
    return { desde, total: dentro.length, reales: dentro.filter((d) => d.real === 1).length };
  });
  const enAlerta = c.probs.filter((p) => p >= umbral).length;
  const max = Math.ceil(Math.max(...cajas.map((b) => b.total)) / 10) * 10;
  const x = escala(0, 1, CHURN_X.x0, CHURN_X.x1);
  const y = escala(0, max, H - M.b, M.t);
  const bw = x(ancho) - x(0) - 3;
  const u = fmt(lang, umbral, 2);
  // Cerca del borde derecho, el rótulo del umbral pasa al otro lado de la línea.
  const izquierda = umbral > 0.72;
  return (
    <Lienzo
      etiqueta={
        en
          ? `Churn probability across ${c.clientes} customers. ${enAlerta} are at or above the ${u} alert threshold; the solid part of each bar is customers who actually left.`
          : `Probabilidad de abandono de ${c.clientes} clientes. ${enAlerta} están en el umbral de alerta de ${u} o por encima; la parte llena de cada barra son los que de verdad se fueron.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? "Customers by churn probability" : "Clientes según probabilidad de abandono"}
      </Texto>
      <Texto x={W - M.r} y={34} ancla="end" color={C.luz} tam={12}>
        {en ? `${enAlerta} of ${c.clientes} flagged` : `${enAlerta} de ${c.clientes} en alerta`}
      </Texto>
      <Grilla valores={[0, max / 2, max]} y={y} rotulo={(v) => fmt(lang, v)} />
      {cajas.map((b) => {
        // Una barra queda en alerta si su centro está del lado del umbral.
        const alerta = b.desde + ancho / 2 >= umbral;
        const color = alerta ? C.luz : C.acero;
        return (
          <g key={b.desde}>
            <rect x={x(b.desde) + 1.5} y={y(b.total)} width={bw} height={y(0) - y(b.total)} style={{ fill: color, fillOpacity: 0.3 }} />
            <rect x={x(b.desde) + 1.5} y={y(b.reales)} width={bw} height={y(0) - y(b.reales)} style={{ fill: color }} />
          </g>
        );
      })}
      <line x1={x(umbral)} x2={x(umbral)} y1={M.t - 12} y2={H - M.b} style={{ stroke: C.hueso, strokeDasharray: "4 4", strokeWidth: interactivo ? 1.5 : 1 }} />
      <Texto x={x(umbral) + (izquierda ? -8 : 8)} y={M.t} ancla={izquierda ? "end" : "start"} color={C.hueso}>
        {en ? `threshold ${u}` : `umbral ${u}`}
      </Texto>
      {interactivo ? <Manija x={x(umbral)} y={M.t + 76} alto={34} /> : null}
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <Texto key={v} x={x(v)} y={H - 24} ancla="middle">
          {fmt(lang, v, 2)}
        </Texto>
      ))}
      <Texto x={M.l} y={H - 6}>
        {en ? "■ left  □ stayed" : "■ se fue  □ se quedó"}
      </Texto>
    </Lienzo>
  );
}

/* ---------- 4. Segmentación: recencia contra frecuencia, un color por segmento ---------- */

// Los nombres del repo son largos para la leyenda: se acortan sin cambiar el sentido.
const NOMBRES_ES: Record<string, string> = {
  "Ocasionales de bajo valor": "Ocasionales chicos",
  "Grandes compradores ocasionales": "Grandes ocasionales",
};

const NOMBRES_EN: Record<string, string> = {
  "Fieles de bajo gasto": "Loyal, low spend",
  "Ocasionales de bajo valor": "Occasional, low value",
  Campeones: "Champions",
  "Nuevos prometedores": "Promising newcomers",
  "En riesgo / dormidos": "At risk / dormant",
  "Grandes compradores ocasionales": "Big occasional",
};

export const nombreSegmento = (lang: Lang, i: number) => {
  const n = LAB.segmentos.nombres[i];
  return (lang === "en" ? NOMBRES_EN : NOMBRES_ES)[n] ?? n;
};

export function Segmentos({
  lang,
  grupo,
  alElegir,
}: {
  lang: Lang;
  grupo?: number | null;
  alElegir?: (g: number | null) => void;
}) {
  const s = LAB.segmentos;
  const en = lang === "en";
  const interactivo = grupo !== undefined;
  const colores = [C.acero, "var(--color-oliva)", C.luz, C.hueso, C.arcilla, C.salvia];
  const x = escala(0, 410, M.l, W - 200);
  const y = escala(0, 30, H - M.b, M.t);
  const atenuado = (g: number) => interactivo && grupo !== null && grupo !== g;
  return (
    <Lienzo
      etiqueta={
        en
          ? `${s.puntos.length} customers by days since their last purchase and number of orders, grouped into ${s.nombres.length} segments.`
          : `${s.puntos.length} clientes según los días desde su última compra y la cantidad de pedidos, agrupados en ${s.nombres.length} segmentos.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? "Orders vs days since last purchase" : "Pedidos vs días desde la última compra"}
      </Texto>
      <Grilla valores={[0, 10, 20, 30]} y={y} rotulo={(v) => fmt(lang, v)} />
      {s.puntos.map(([rx, fy, g], i) => (
        <circle key={i} cx={x(rx)} cy={y(fy)} r={3.2} style={{ fill: colores[g], fillOpacity: atenuado(g) ? 0.1 : 0.8 }} />
      ))}
      {s.nombres.map((n, i) => {
        const etiqueta = nombreSegmento(lang, i);
        const activo = interactivo && grupo === i;
        const contenido = (
          <>
            {interactivo ? (
              <rect
                x={W - 196}
                y={M.t - 7 + i * 24}
                width={186}
                height={24}
                style={{ fill: activo ? "rgba(233,224,214,0.1)" : "transparent", stroke: activo ? C.hueso : "transparent" }}
              />
            ) : null}
            <circle cx={W - 188} cy={M.t + 6 + i * 24} r={5} style={{ fill: colores[i], opacity: atenuado(i) ? 0.35 : 1 }} />
            <Texto x={W - 176} y={M.t + 10 + i * 24} color={atenuado(i) ? C.apagado : C.hueso} tam={10.5}>
              {etiqueta}
            </Texto>
          </>
        );
        return interactivo ? (
          <g
            key={n}
            role="button"
            tabIndex={0}
            aria-pressed={activo}
            aria-label={etiqueta}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--color-oliva-luz)]"
            onClick={() => alElegir?.(activo ? null : i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                alElegir?.(activo ? null : i);
              }
            }}
          >
            {contenido}
          </g>
        ) : (
          <g key={n}>{contenido}</g>
        );
      })}
      <Texto x={W - 196} y={H - 16} ancla="end">
        {en ? "Days since last purchase →" : "Días sin comprar →"}
      </Texto>
    </Lienzo>
  );
}

/* ---------- 5. A/B: conversión diaria por variante, con su intervalo ---------- */

export function Ab({ lang, dias }: { lang: Lang; dias?: number }) {
  const d = LAB.ab;
  const en = lang === "en";
  const interactivo = dias !== undefined;
  const s = abStats(dias ?? d.dias);
  // Los totales del estudio vienen del script: con todos los días, son esos.
  const mediaA = interactivo ? s.mediaA : d.mediaA;
  const mediaB = interactivo ? s.mediaB : d.mediaB;
  const mb = interactivo ? MB_REGLA : M.b;
  const y = escala(0, 0.45, H - mb, M.t);
  const grupos = [
    { nombre: en ? "Control" : "Control", vals: s.a, media: mediaA, ic: interactivo ? s.icA : d.icA, color: C.acero, cx: 230 },
    { nombre: en ? "New sign" : "Cartel nuevo", vals: s.b, media: mediaB, ic: interactivo ? s.icB : d.icB, color: C.luz, cx: 450 },
  ];
  const pp = (mediaB - mediaA) * 100;
  const signo = pp >= 0 ? "+" : "";
  // Dispersión horizontal fija (no aleatoria) para que el dibujo sea el mismo en cada render.
  const jitter = (i: number) => (((i * 37) % 23) / 22 - 0.5) * 70;
  const pct = (v: number) => `${fmt(lang, v * 100, 1)}${en ? "%" : " %"}`;
  return (
    <Lienzo
      etiqueta={
        en
          ? `Daily conversion per branch${interactivo ? ` over the first ${dias} days` : ""}: control ${pct(mediaA)}, new sign ${pct(mediaB)}, with 95% intervals. Difference ${signo}${fmt(lang, pp, 1)} points.`
          : `Conversión diaria por sucursal${interactivo ? ` en los primeros ${dias} días` : ""}: control ${pct(mediaA)}, cartel nuevo ${pct(mediaB)}, con intervalos del 95 %. Diferencia de ${signo}${fmt(lang, pp, 1)} puntos.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? "Daily conversion per branch · 95% CI" : "Conversión diaria por sucursal · IC 95 %"}
      </Texto>
      <Texto x={W - M.r} y={34} ancla="end" color={C.luz} tam={12}>
        {`${signo}${fmt(lang, pp, 1)} pts`}
      </Texto>
      <Grilla valores={[0, 0.1, 0.2, 0.3, 0.4]} y={y} rotulo={(v) => `${fmt(lang, v * 100)}${en ? "%" : " %"}`} />
      {grupos.map((g) => (
        <g key={g.nombre}>
          {g.vals.map((v, i) => (
            <circle key={i} cx={g.cx + jitter(i)} cy={y(v)} r={2.6} style={{ fill: g.color, fillOpacity: 0.35 }} />
          ))}
          <line x1={g.cx} x2={g.cx} y1={y(g.media - g.ic)} y2={y(g.media + g.ic)} style={{ stroke: g.color, strokeWidth: 3 }} />
          <line x1={g.cx - 16} x2={g.cx + 16} y1={y(g.media - g.ic)} y2={y(g.media - g.ic)} style={{ stroke: g.color, strokeWidth: 3 }} />
          <line x1={g.cx - 16} x2={g.cx + 16} y1={y(g.media + g.ic)} y2={y(g.media + g.ic)} style={{ stroke: g.color, strokeWidth: 3 }} />
          <circle cx={g.cx} cy={y(g.media)} r={7} style={{ fill: g.color, stroke: C.fondo, strokeWidth: 2 }} />
          <Texto x={g.cx + 24} y={y(g.media) + 4} color={C.hueso}>
            {pct(g.media)}
          </Texto>
          <Texto x={g.cx} y={interactivo ? y(0) + 18 : H - 16} ancla="middle" color={C.salvia}>
            {g.nombre}
          </Texto>
        </g>
      ))}
      {interactivo ? (
        <Regla
          valor={dias!}
          min={DIAS_RANGO.min}
          max={DIAS_RANGO.max}
          marcas={[10, 30, 60, 90, 120]}
          rotulo={(v) => fmt(lang, v)}
          hito={AB_DIA_ESTABLE ? { valor: AB_DIA_ESTABLE, texto: en ? `day ${AB_DIA_ESTABLE}` : `día ${AB_DIA_ESTABLE}` } : null}
        />
      ) : null}
    </Lienzo>
  );
}

const GRAFICOS: Record<string, (p: { lang: Lang }) => ReactNode> = {
  "forecasting-de-demanda-e-inventario": Forecast,
  "deteccion-de-anomalias-en-ordenes": Anomalias,
  "prediccion-de-churn": Churn,
  "segmentacion-de-clientes": Segmentos,
  "experimento-ab-en-retail": Ab,
};

/** Si el estudio tiene gráfico propio. */
export const tieneGrafico = (slug: string) => slug in GRAFICOS;

/** Devuelve el gráfico quieto del estudio (portada), o nada si no tiene uno. */
export function graficoLab(slug: string, lang: Lang): ReactNode {
  const G = GRAFICOS[slug];
  return G ? <G lang={lang} /> : null;
}
