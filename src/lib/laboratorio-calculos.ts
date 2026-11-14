import { LAB } from "./laboratorio-datos";

/*
  Las cuentas del Laboratorio interactivo. Son funciones puras sobre los datos
  de cada estudio: el gráfico las usa para dibujar y el panel de abajo para
  mostrar las cifras, así los dos dicen siempre lo mismo.
*/

/* ---------- Churn ---------- */

export const CHURN_RANGO = { min: 0.1, max: 0.9, paso: 0.01, inicial: 0.5 } as const;

export function churnMetricas(umbral: number) {
  const { probs, reales } = LAB.churn;
  const totalReales = reales.reduce<number>((s, v) => s + v, 0);
  let contactos = 0;
  let aciertos = 0;
  probs.forEach((p, i) => {
    if (p >= umbral) {
      contactos++;
      aciertos += reales[i];
    }
  });
  return {
    contactos,
    aciertos,
    totalReales,
    clientes: probs.length,
    precision: contactos ? aciertos / contactos : 0,
    recall: totalReales ? aciertos / totalReales : 0,
  };
}

/* ---------- Forecast: stock de seguridad según el nivel de servicio ---------- */

export const SERVICIO_RANGO = { min: 80, max: 99.5, paso: 0.5, inicial: 95 } as const;

/** Inversa de la normal estándar (aproximación de Acklam, error < 1e-9). */
export function zDeNivel(p: number): number {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const bajo = 0.02425;
  if (p < bajo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - bajo) return -zDeNivel(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/**
  La misma fórmula del notebook 04 del estudio:
  stock de seguridad = z × σ del error × √lead time, y
  punto de reorden = demanda esperada × lead time + stock de seguridad.
*/
export function forecastPolitica(servicio: number) {
  const f = LAB.forecast;
  const z = zDeNivel(servicio / 100);
  const seguridad = z * f.sigma * Math.sqrt(f.leadTime);
  const reorden = f.demanda * f.leadTime + seguridad;
  // Semanas de prueba en que la demanda real pasó el pronóstico más el colchón.
  const faltas = f.real.map((r, i) => r > f.pred[i] + seguridad);
  return { z, seguridad, reorden, faltas, semanasFalta: faltas.filter(Boolean).length, semanas: f.real.length };
}

/* ---------- A/B: el resultado según cuántos días lleva el experimento ---------- */

export const DIAS_RANGO = { min: 10, max: LAB.ab.dias, paso: 1, inicial: LAB.ab.dias } as const;

const media = (a: readonly number[]) => a.reduce((s, v) => s + v, 0) / a.length;
const varianza = (a: readonly number[]) => {
  const m = media(a);
  return a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1);
};

/** Con los primeros n días de cada variante: medias, intervalos y la diferencia. */
export function abStats(n: number) {
  const a = LAB.ab.a.slice(0, n);
  const b = LAB.ab.b.slice(0, n);
  const ma = media(a);
  const mb = media(b);
  const va = varianza(a);
  const vb = varianza(b);
  const dif = mb - ma;
  const se = Math.sqrt(va / n + vb / n);
  return {
    a,
    b,
    mediaA: ma,
    mediaB: mb,
    icA: 1.96 * Math.sqrt(va / n),
    icB: 1.96 * Math.sqrt(vb / n),
    dif,
    desde: dif - 1.96 * se,
    hasta: dif + 1.96 * se,
  };
}

/** Primer día desde el que la diferencia queda por encima de cero y ya no vuelve a cruzarlo. */
export const AB_DIA_ESTABLE: number | null = (() => {
  for (let n = LAB.ab.dias; n >= DIAS_RANGO.min; n--) {
    if (abStats(n).desde <= 0) return n === LAB.ab.dias ? null : n + 1;
  }
  return DIAS_RANGO.min;
})();

/* ---------- Anomalías ---------- */

export type FiltroAnomalias = "todas" | "reales" | "falsas";

export function anomaliasConteo() {
  const { alertas, totalPedidos } = LAB.anomalias;
  const reales = alertas.filter((p) => p[2] === 1).length;
  return { alertas: alertas.length, reales, falsas: alertas.length - reales, totalPedidos };
}

/* ---------- Segmentos ---------- */

export function segmentoResumen(grupo: number | null) {
  const puntos = LAB.segmentos.puntos.filter((p) => grupo === null || p[2] === grupo);
  return {
    clientes: puntos.length,
    total: LAB.segmentos.puntos.length,
    recencia: media(puntos.map((p) => p[0])),
    frecuencia: media(puntos.map((p) => p[1])),
  };
}
