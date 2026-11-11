import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { LAB } from "@/lib/laboratorio-datos";

/*
  Las portadas del Laboratorio: el gráfico principal de cada estudio, dibujado
  con los datos del repo. Es SVG y no una imagen a propósito: en la fase 11 se
  le suman controles encima (umbral, nivel de servicio, cantidad de grupos)
  sin rehacerlo.

  Todo se dibuja en un lienzo de 640 × 400 con una sola escala por eje, y los
  colores salen de la paleta del sitio.
*/

const W = 640;
const H = 400;
const M = { l: 54, r: 24, t: 70, b: 44 };

const C = {
  hueso: "var(--color-hueso)",
  salvia: "var(--color-salvia)",
  acero: "var(--color-acero)",
  luz: "var(--color-oliva-luz)",
  linea: "var(--color-linea-oscura)",
  apagado: "var(--color-apagado-oscuro)",
  fondo: "#1b1c15",
};

const escala = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

const fmt = (lang: Lang, v: number, dec = 0) =>
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

/* ---------- 1. Forecasting: la serie real y lo que predijo el modelo ---------- */

function Forecast({ lang }: { lang: Lang }) {
  const f = LAB.forecast;
  const n = f.historia.length;
  const total = n + f.real.length;
  const max = Math.ceil(Math.max(...f.historia, ...f.real, ...f.pred) / 100) * 100;
  const x = escala(0, total - 1, M.l, W - M.r);
  const y = escala(0, max, H - M.b, M.t);
  const linea = (vals: readonly number[], desde: number) =>
    vals.map((v, i) => `${x(i + desde).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const paso = max / 4;
  const en = lang === "en";
  return (
    <Lienzo
      etiqueta={
        en
          ? `Weekly units of ${f.producto}: last year of history, then the 12 test weeks with the actual series and the ${f.modelo} forecast. MAPE ${fmt(lang, f.mape, 1)}%.`
          : `Unidades por semana de ${f.producto}: el último año de historia y después las 12 semanas de test, con la serie real y el pronóstico de ${f.modelo}. MAPE ${fmt(lang, f.mape, 1)} %.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? `${f.producto} · units per week` : `${f.producto} · unidades por semana`}
      </Texto>
      <Texto x={W - M.r} y={34} ancla="end" color={C.luz} tam={12}>
        {`MAPE ${fmt(lang, f.mape, 1)}${en ? "%" : " %"}`}
      </Texto>
      <Grilla valores={[0, paso, paso * 2, paso * 3, max]} y={y} rotulo={(v) => fmt(lang, v)} />
      <rect x={x(n - 0.5)} y={M.t - 12} width={W - M.r - x(n - 0.5)} height={H - M.b - M.t + 12} style={{ fill: C.luz, fillOpacity: 0.07 }} />
      <polyline points={linea(f.historia, 0)} style={{ fill: "none", stroke: C.hueso, strokeWidth: 2, strokeLinejoin: "round" }} />
      <polyline points={linea([f.historia[n - 1], ...f.real], n - 1)} style={{ fill: "none", stroke: C.hueso, strokeWidth: 2, strokeLinejoin: "round", strokeOpacity: 0.55 }} />
      <polyline points={linea([f.historia[n - 1], ...f.pred], n - 1)} style={{ fill: "none", stroke: C.luz, strokeWidth: 2.6, strokeDasharray: "6 5" }} />
      <Texto x={M.l} y={H - 16}>{en ? "← 52 weeks of history" : "← 52 semanas de historia"}</Texto>
      <Texto x={W - M.r} y={H - 16} ancla="end" color={C.luz}>
        {en ? "test: actual vs forecast" : "test: real vs pronóstico"}
      </Texto>
    </Lienzo>
  );
}

/* ---------- 2. Anomalías: cada orden según cuánto se aparta su cantidad y su precio ---------- */

function Anomalias({ lang }: { lang: Lang }) {
  const a = LAB.anomalias;
  const x = escala(-2, 16, M.l, W - M.r);
  const y = escala(-7, 16, H - M.b, M.t);
  const en = lang === "en";
  const ciertas = a.alertas.filter((p) => p[2] === 1).length;
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
        <circle key={i} cx={x(cx)} cy={y(cy)} r={2.6} style={{ fill: C.salvia, fillOpacity: 0.4 }} />
      ))}
      {a.alertas.map(([cx, cy, real], i) =>
        real ? (
          <g key={i}>
            <circle cx={x(cx)} cy={y(cy)} r={7} style={{ fill: "none", stroke: C.luz, strokeWidth: 1.6 }} />
            <circle cx={x(cx)} cy={y(cy)} r={2.8} style={{ fill: C.luz }} />
          </g>
        ) : (
          <circle key={i} cx={x(cx)} cy={y(cy)} r={6} style={{ fill: "none", stroke: C.acero, strokeWidth: 1.2, strokeDasharray: "2 2" }} />
        ),
      )}
      <Texto x={W - M.r} y={H - 16} ancla="end">
        {en ? "Quantity (z) →" : "Cantidad (z) →"}
      </Texto>
      <Texto x={M.l} y={H - 16} color={C.luz}>
        {en ? `● error caught  ◌ false alarm` : `● error detectado  ◌ falsa alarma`}
      </Texto>
    </Lienzo>
  );
}

/* ---------- 3. Churn: cómo se reparte el riesgo y dónde corta el umbral ---------- */

function Churn({ lang }: { lang: Lang }) {
  const c = LAB.churn;
  const en = lang === "en";
  const umbral = 0.5;
  const ancho = 0.05;
  const cajas = Array.from({ length: 20 }, (_, i) => {
    const desde = i * ancho;
    const dentro = c.probs.map((p, j) => ({ p, real: c.reales[j] })).filter((d) => d.p >= desde && (d.p < desde + ancho || (i === 19 && d.p <= 1)));
    return { desde, total: dentro.length, reales: dentro.filter((d) => d.real === 1).length };
  });
  const max = Math.ceil(Math.max(...cajas.map((b) => b.total)) / 10) * 10;
  const x = escala(0, 1, M.l, W - M.r);
  const y = escala(0, max, H - M.b, M.t);
  const bw = x(ancho) - x(0) - 3;
  return (
    <Lienzo
      etiqueta={
        en
          ? `Churn probability across ${c.clientes} customers. ${c.sobreUmbral} are above the 0.50 alert threshold; the darker part of each bar is customers who actually left.`
          : `Probabilidad de abandono de ${c.clientes} clientes. ${c.sobreUmbral} superan el umbral de alerta de 0,50; la parte llena de cada barra son los que de verdad se fueron.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? "Customers by churn probability" : "Clientes según probabilidad de abandono"}
      </Texto>
      <Texto x={W - M.r} y={34} ancla="end" color={C.luz} tam={12}>
        {en ? `${c.sobreUmbral} of ${c.clientes} flagged` : `${c.sobreUmbral} de ${c.clientes} en alerta`}
      </Texto>
      <Grilla valores={[0, max / 2, max]} y={y} rotulo={(v) => fmt(lang, v)} />
      {cajas.map((b) => {
        const alerta = b.desde >= umbral;
        const color = alerta ? C.luz : C.acero;
        return (
          <g key={b.desde}>
            <rect x={x(b.desde) + 1.5} y={y(b.total)} width={bw} height={y(0) - y(b.total)} style={{ fill: color, fillOpacity: 0.3 }} />
            <rect x={x(b.desde) + 1.5} y={y(b.reales)} width={bw} height={y(0) - y(b.reales)} style={{ fill: color }} />
          </g>
        );
      })}
      <line x1={x(umbral)} x2={x(umbral)} y1={M.t - 12} y2={H - M.b} style={{ stroke: C.hueso, strokeDasharray: "4 4" }} />
      <Texto x={x(umbral) + 8} y={M.t} color={C.hueso}>
        {en ? "threshold 0.50" : "umbral 0,50"}
      </Texto>
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

function Segmentos({ lang }: { lang: Lang }) {
  const s = LAB.segmentos;
  const en = lang === "en";
  const colores = [C.acero, "var(--color-oliva)", C.luz, C.hueso, "#c9a27a", C.salvia];
  const x = escala(0, 410, M.l, W - 200);
  const y = escala(0, 30, H - M.b, M.t);
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
        <circle key={i} cx={x(rx)} cy={y(fy)} r={3.2} style={{ fill: colores[g], fillOpacity: 0.8 }} />
      ))}
      {s.nombres.map((n, i) => (
        <g key={n}>
          <circle cx={W - 188} cy={M.t + 6 + i * 24} r={5} style={{ fill: colores[i] }} />
          <Texto x={W - 176} y={M.t + 10 + i * 24} color={C.hueso} tam={10.5}>
            {(en ? NOMBRES_EN : NOMBRES_ES)[n] ?? n}
          </Texto>
        </g>
      ))}
      <Texto x={W - 196} y={H - 16} ancla="end">
        {en ? "Days since last purchase →" : "Días sin comprar →"}
      </Texto>
    </Lienzo>
  );
}

/* ---------- 5. A/B: conversión diaria por variante, con su intervalo ---------- */

function Ab({ lang }: { lang: Lang }) {
  const d = LAB.ab;
  const en = lang === "en";
  const y = escala(0, 0.45, H - M.b, M.t);
  const grupos = [
    { nombre: en ? "Control" : "Control", vals: d.a, media: d.mediaA, ic: d.icA, color: C.acero, cx: 230 },
    { nombre: en ? "New sign" : "Cartel nuevo", vals: d.b, media: d.mediaB, ic: d.icB, color: C.luz, cx: 450 },
  ];
  const pp = (d.mediaB - d.mediaA) * 100;
  // Dispersión horizontal fija (no aleatoria) para que el dibujo sea el mismo en cada render.
  const jitter = (i: number) => (((i * 37) % 23) / 22 - 0.5) * 70;
  return (
    <Lienzo
      etiqueta={
        en
          ? `Daily conversion per branch: control ${fmt(lang, d.mediaA * 100, 1)}%, new sign ${fmt(lang, d.mediaB * 100, 1)}%, with 95% intervals. Difference +${fmt(lang, pp, 1)} points.`
          : `Conversión diaria por sucursal: control ${fmt(lang, d.mediaA * 100, 1)} %, cartel nuevo ${fmt(lang, d.mediaB * 100, 1)} %, con intervalos del 95 %. Diferencia de +${fmt(lang, pp, 1)} puntos.`
      }
    >
      <Texto x={M.l} y={34} color={C.salvia}>
        {en ? "Daily conversion per branch · 95% CI" : "Conversión diaria por sucursal · IC 95 %"}
      </Texto>
      <Texto x={W - M.r} y={34} ancla="end" color={C.luz} tam={12}>
        {en ? `+${fmt(lang, pp, 1)} pts` : `+${fmt(lang, pp, 1)} pts`}
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
            {`${fmt(lang, g.media * 100, 1)}${en ? "%" : " %"}`}
          </Texto>
          <Texto x={g.cx} y={H - 16} ancla="middle" color={C.salvia}>
            {g.nombre}
          </Texto>
        </g>
      ))}
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

/** Devuelve el gráfico del estudio, o nada si ese estudio no tiene uno. */
export function graficoLab(slug: string, lang: Lang): ReactNode {
  const G = GRAFICOS[slug];
  return G ? <G lang={lang} /> : null;
}
