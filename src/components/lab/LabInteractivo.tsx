"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { LAB } from "@/lib/laboratorio-datos";
import {
  AB_DIA_ESTABLE,
  CHURN_RANGO,
  DIAS_RANGO,
  SERVICIO_RANGO,
  abStats,
  anomaliasConteo,
  churnMetricas,
  forecastPolitica,
  segmentoResumen,
  type FiltroAnomalias,
} from "@/lib/laboratorio-calculos";
import { Ab, Anomalias, CHURN_X, Churn, Forecast, REGLA, Segmentos, W, escala, fmt, nombreSegmento } from "@/components/carrusel/GraficoLab";

/*
  El Laboratorio interactivo: en la ficha de cada estudio, el gráfico tiene un
  control y debajo las cifras que cambian con él. Todo sale de las mismas
  funciones (laboratorio-calculos), así el dibujo y los números no se
  contradicen.

  El control va sobre el gráfico (se eligió en la demo de la fase 11): en
  churn se arrastra la línea del umbral; en forecast y A/B, la regla de abajo.
  Anomalías y segmentos se filtran tocando la leyenda.

  En celular el arrastre tiene que convivir con el scroll de la página: el
  gráfico deja pasar el desplazamiento vertical (touch-action: pan-y) y el
  dedo solo toma el control cuando se mueve de costado, o cuando toca sin
  moverse.

  Sin JavaScript se ve el estado inicial, con sus cifras: el HTML sale del
  servidor igual que antes.
*/

const lim = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Rango = { min: number; max: number; paso: number };

function Deslizable({
  valor,
  rango,
  desde,
  hasta,
  alCambiar,
  etiqueta,
  textoValor,
  children,
}: {
  valor: number;
  rango: Rango;
  /* El tramo del lienzo (en unidades del viewBox) que va de min a max. */
  desde: number;
  hasta: number;
  alCambiar: (v: number) => void;
  etiqueta: string;
  textoValor: string;
  children: ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const toque = useRef<{ id: number; x: number; y: number; tomado: boolean } | null>(null);
  const redondear = (v: number) => {
    const n = Math.round((v - rango.min) / rango.paso) * rango.paso + rango.min;
    return lim(Number(n.toFixed(4)), rango.min, rango.max);
  };
  const desdeX = (clientX: number) => {
    const r = caja.current!.getBoundingClientRect();
    const xLienzo = ((clientX - r.left) / r.width) * W;
    alCambiar(redondear(escala(desde, hasta, rango.min, rango.max)(xLienzo)));
  };
  return (
    <div
      ref={caja}
      role="slider"
      tabIndex={0}
      aria-label={etiqueta}
      aria-valuemin={rango.min}
      aria-valuemax={rango.max}
      aria-valuenow={valor}
      aria-valuetext={textoValor}
      className="cursor-ew-resize select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oliva-luz"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          toque.current = { id: e.pointerId, x: e.clientX, y: e.clientY, tomado: false };
          return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        desdeX(e.clientX);
      }}
      onPointerMove={(e) => {
        const t = toque.current;
        if (t && t.id === e.pointerId) {
          if (!t.tomado) {
            const dx = Math.abs(e.clientX - t.x);
            const dy = Math.abs(e.clientY - t.y);
            if (dx > 8 && dx > dy) {
              t.tomado = true;
              e.currentTarget.setPointerCapture(e.pointerId);
            } else if (dy > 8) {
              toque.current = null;
              return;
            } else return;
          }
          desdeX(e.clientX);
          return;
        }
        if (e.currentTarget.hasPointerCapture(e.pointerId)) desdeX(e.clientX);
      }}
      onPointerUp={(e) => {
        const t = toque.current;
        // Un toque sin arrastre también lleva el control a ese punto.
        if (t && t.id === e.pointerId && !t.tomado) desdeX(e.clientX);
        toque.current = null;
      }}
      onPointerCancel={() => {
        toque.current = null;
      }}
      onKeyDown={(e) => {
        const pasos: Record<string, number> = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -10, PageUp: 10 };
        if (e.key === "Home") alCambiar(rango.min);
        else if (e.key === "End") alCambiar(rango.max);
        else if (e.key in pasos) alCambiar(redondear(valor + pasos[e.key] * (e.shiftKey ? 10 : 1) * rango.paso));
        else return;
        e.preventDefault();
      }}
    >
      {children}
    </div>
  );
}

/*
  En celular la leyenda del gráfico queda chica para el dedo (unos 14 px de
  alto). Ahí se repite como fila de botones grandes; en escritorio se usa la
  leyenda del gráfico.
*/
function Opciones<T extends string | number | null>({
  opciones,
  valor,
  alElegir,
  etiqueta,
}: {
  opciones: { id: T; texto: string }[];
  valor: T;
  alElegir: (v: T) => void;
  etiqueta: string;
}) {
  return (
    <div role="group" aria-label={etiqueta} className="flex flex-wrap gap-2 md:hidden">
      {opciones.map((o) => (
        <button
          key={String(o.id)}
          type="button"
          aria-pressed={valor === o.id}
          onClick={() => alElegir(o.id)}
          className={`etiqueta min-h-10 border px-3 py-2 ${valor === o.id ? "border-hueso bg-hueso text-tinta" : "border-linea-oscura text-salvia"}`}
        >
          {o.texto}
        </button>
      ))}
    </div>
  );
}

function Panel({
  pista,
  cifras,
  lectura,
  opciones,
}: {
  pista: string;
  cifras: { valor: string; rotulo: string; chica?: boolean }[];
  lectura: ReactNode;
  opciones?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-linea-oscura px-5 pb-5 pt-4 text-hueso">
      <p className="etiqueta text-apagado-oscuro">{pista}</p>
      {opciones}
      <dl className="grid grid-cols-3 gap-3">
        {cifras.map((c) => (
          <div key={c.rotulo} className="flex min-w-0 flex-col gap-1">
            <dt className="etiqueta order-last text-apagado-oscuro">{c.rotulo}</dt>
            <dd
              className={`titular m-0 normal-case tabular-nums ${c.chica ? "whitespace-nowrap text-[clamp(1.1rem,3.6vw,2.4rem)]" : "text-[clamp(1.6rem,5vw,2.4rem)]"}`}
            >
              {c.valor}
            </dd>
          </div>
        ))}
      </dl>
      <p aria-live="polite" className="m-0 max-w-[62ch] text-[0.95rem] leading-relaxed text-salvia [&_strong]:font-semibold [&_strong]:text-hueso">
        {lectura}
      </p>
    </div>
  );
}

function Estado({ si, children }: { si: boolean; children: ReactNode }) {
  return (
    <span
      className={`etiqueta mr-2 inline-block border px-2 py-0.5 align-[2px] ${si ? "border-oliva-luz bg-oliva-luz text-tinta" : "border-acero text-acero"}`}
    >
      {children}
    </span>
  );
}

/* ---------- Los cinco estudios ---------- */

function ChurnInteractivo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [umbral, setUmbral] = useState<number>(CHURN_RANGO.inicial);
  const m = churnMetricas(umbral);
  const u = fmt(lang, umbral, 2);
  const pct = (v: number) => `${fmt(lang, v * 100)}${en ? "%" : " %"}`;
  const enDiez = Math.round(m.precision * 10);
  return (
    <>
      <Deslizable
        valor={umbral}
        rango={CHURN_RANGO}
        desde={CHURN_X.x0 + (CHURN_X.x1 - CHURN_X.x0) * CHURN_RANGO.min}
        hasta={CHURN_X.x0 + (CHURN_X.x1 - CHURN_X.x0) * CHURN_RANGO.max}
        alCambiar={setUmbral}
        etiqueta={en ? "Churn risk threshold" : "Umbral de riesgo de abandono"}
        textoValor={
          en
            ? `${u}: ${m.contactos} customers, precision ${pct(m.precision)}, recall ${pct(m.recall)}`
            : `${u}: ${m.contactos} clientes, precisión ${pct(m.precision)}, recall ${pct(m.recall)}`
        }
      >
        <Churn lang={lang} umbral={umbral} />
      </Deslizable>
      <Panel
        pista={en ? "Drag the dashed line · ← → with the chart focused" : "Arrastrá la línea punteada · ← → con el gráfico enfocado"}
        cifras={[
          { valor: fmt(lang, m.contactos), rotulo: en ? "Customers to contact" : "Clientes a contactar" },
          { valor: m.contactos ? pct(m.precision) : "–", rotulo: en ? "Precision" : "Precisión" },
          { valor: pct(m.recall), rotulo: "Recall" },
        ]}
        lectura={
          m.contactos ? (
            en ? (
              <>
                At <strong>{u}</strong> you contact <strong>{m.contactos}</strong> of {m.clientes} customers. Out of every 10 contacted, <strong>{enDiez}</strong> were really
                leaving, and you reach <strong>{m.aciertos} of the {m.totalReales}</strong> who left. Lowering the threshold saves more customers at the cost of calling
                more people who were staying.
              </>
            ) : (
              <>
                Con <strong>{u}</strong> se contacta a <strong>{m.contactos}</strong> de {m.clientes} clientes. De cada 10 contactados, <strong>{enDiez}</strong> se iban de
                verdad, y se llega a <strong>{m.aciertos} de los {m.totalReales}</strong> que se fueron. Bajar el umbral suma clientes rescatados a costa de llamar a más
                gente que no se iba.
              </>
            )
          ) : en ? (
            "At that threshold nobody is left to contact."
          ) : (
            "Con ese umbral no queda nadie para contactar."
          )
        }
      />
    </>
  );
}

function ForecastInteractivo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const f = LAB.forecast;
  const [servicio, setServicio] = useState<number>(SERVICIO_RANGO.inicial);
  const p = forecastPolitica(servicio);
  const pct = (v: number) => `${fmt(lang, v, v % 1 ? 1 : 0)}${en ? "%" : " %"}`;
  const optimo = forecastPolitica(f.servicioOptimo);
  return (
    <>
      <Deslizable
        valor={servicio}
        rango={SERVICIO_RANGO}
        desde={REGLA.x0}
        hasta={REGLA.x1}
        alCambiar={setServicio}
        etiqueta={en ? "Service level" : "Nivel de servicio"}
        textoValor={
          en
            ? `${pct(servicio)}: safety stock ${fmt(lang, p.seguridad)} units, reorder point ${fmt(lang, p.reorden)}`
            : `${pct(servicio)}: stock de seguridad ${fmt(lang, p.seguridad)} unidades, punto de reorden ${fmt(lang, p.reorden)}`
        }
      >
        <Forecast lang={lang} servicio={servicio} />
      </Deslizable>
      <Panel
        pista={en ? "Drag along the service-level ruler · ← → with the chart focused" : "Arrastrá sobre la regla de nivel de servicio · ← → con el gráfico enfocado"}
        cifras={[
          { valor: fmt(lang, p.seguridad), rotulo: en ? "Safety stock (u.)" : "Stock de seguridad (u.)" },
          { valor: fmt(lang, p.reorden), rotulo: en ? "Reorder point (u.)" : "Punto de reorden (u.)" },
          { valor: `${p.semanasFalta}/${p.semanas}`, rotulo: en ? "Test weeks short" : "Semanas con quiebre" },
        ]}
        lectura={
          en ? (
            <>
              At <strong>{pct(servicio)}</strong> the buffer is <strong>{fmt(lang, p.seguridad)} units</strong> on top of the forecast (z = {fmt(lang, p.z, 2)} times the
              model&apos;s error of {fmt(lang, f.sigma)} units). In the 12 test weeks, demand went over forecast plus buffer in <strong>{p.semanasFalta}</strong>. Each extra
              point of service costs more stock than the last: the study settled on {pct(f.servicioOptimo)} ({fmt(lang, optimo.seguridad)} units) by weighing the cost
              of running out against the cost of idle stock.
            </>
          ) : (
            <>
              Con <strong>{pct(servicio)}</strong> el colchón es de <strong>{fmt(lang, p.seguridad)} unidades</strong> sobre el pronóstico (z = {fmt(lang, p.z, 2)} veces el
              error del modelo, de {fmt(lang, f.sigma)} unidades). En las 12 semanas de prueba, la demanda pasó pronóstico más colchón en <strong>{p.semanasFalta}</strong>.
              Cada punto de servicio de más cuesta más stock que el anterior: el estudio eligió {pct(f.servicioOptimo)} ({fmt(lang, optimo.seguridad)} unidades)
              comparando el costo de quedarse sin stock con el de tener mercadería parada.
            </>
          )
        }
      />
    </>
  );
}

function AbInteractivo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [dias, setDias] = useState<number>(DIAS_RANGO.inicial);
  const s = abStats(dias);
  const si = s.desde > 0;
  const n1 = (v: number) => fmt(lang, v * 100, 1);
  const signo = s.dif >= 0 ? "+" : "";
  return (
    <>
      <Deslizable
        valor={dias}
        rango={DIAS_RANGO}
        desde={REGLA.x0}
        hasta={REGLA.x1}
        alCambiar={setDias}
        etiqueta={en ? "Days of experiment" : "Días de experimento"}
        textoValor={
          en
            ? `${dias} days: difference ${signo}${n1(s.dif)} points, interval ${n1(s.desde)} to ${n1(s.hasta)}`
            : `${dias} días: diferencia ${signo}${n1(s.dif)} puntos, intervalo de ${n1(s.desde)} a ${n1(s.hasta)}`
        }
      >
        <Ab lang={lang} dias={dias} />
      </Deslizable>
      <Panel
        pista={en ? "Drag along the day ruler · ← → with the chart focused" : "Arrastrá sobre la regla de días · ← → con el gráfico enfocado"}
        cifras={[
          { valor: `${signo}${n1(s.dif)}`, rotulo: en ? "Points of difference" : "Puntos de diferencia" },
          { valor: en ? `${n1(s.desde)} to ${n1(s.hasta)}` : `${n1(s.desde)} a ${n1(s.hasta)}`, rotulo: en ? "95% CI of the difference" : "IC 95 % de la diferencia", chica: true },
          { valor: fmt(lang, dias), rotulo: en ? "Days per variant" : "Días por variante" },
        ]}
        lectura={
          <>
            <Estado si={si}>{si ? (en ? "Holds up" : "Se sostiene") : en ? "Could be chance" : "Puede ser casualidad"}</Estado>
            {si ? (
              en ? (
                <>
                  With <strong>{dias} days</strong>, the whole interval of the difference sits above zero: the new sign converts more, and it is not chance.
                </>
              ) : (
                <>
                  Con <strong>{dias} días</strong>, el intervalo de la diferencia queda entero por encima de cero: el cartel nuevo convierte más y no es casualidad.
                </>
              )
            ) : en ? (
              <>
                With <strong>{dias} days</strong>, the interval of the difference still includes zero. Stopping here would mean deciding on noise.
              </>
            ) : (
              <>
                Con <strong>{dias} días</strong>, el intervalo de la diferencia todavía incluye el cero. Cortar acá sería decidir con ruido.
              </>
            )}
            {AB_DIA_ESTABLE ? (
              en ? (
                <> The difference only holds for good from day <strong>{AB_DIA_ESTABLE}</strong> (the white mark on the ruler).</>
              ) : (
                <> La diferencia se sostiene recién desde el día <strong>{AB_DIA_ESTABLE}</strong> (la marca blanca en la regla).</>
              )
            ) : null}
          </>
        }
      />
    </>
  );
}

function AnomaliasInteractivo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [filtro, setFiltro] = useState<FiltroAnomalias>("todas");
  const c = anomaliasConteo();
  const pct = (v: number) => `${fmt(lang, v * 100)}${en ? "%" : " %"}`;
  const lecturas: Record<FiltroAnomalias, ReactNode> = en
    ? {
        todas: (
          <>
            The system flagged <strong>{c.alertas}</strong> orders for their quantity or price. <strong>{c.reales}</strong> were real errors: {pct(c.reales / c.alertas)} of the
            alerts are worth a review.
          </>
        ),
        reales: (
          <>
            The <strong>{c.reales} errors caught</strong> are quantities or prices that don&apos;t fit what that product usually has. Most of them sit far from the cloud of
            normal orders.
          </>
        ),
        falsas: (
          <>
            The <strong>{c.falsas} false alarms</strong> are unusual but correct orders. Each one is an order someone checks for nothing: that is the cost of not missing
            the real ones.
          </>
        ),
      }
    : {
        todas: (
          <>
            El sistema marcó <strong>{c.alertas}</strong> órdenes por su cantidad o su precio. <strong>{c.reales}</strong> eran errores de verdad: el {pct(c.reales / c.alertas)} de
            las alertas vale la revisión.
          </>
        ),
        reales: (
          <>
            Los <strong>{c.reales} errores detectados</strong> son cantidades o precios que no cuadran con lo que ese producto suele tener. La mayoría queda lejos de la
            nube de órdenes normales.
          </>
        ),
        falsas: (
          <>
            Las <strong>{c.falsas} falsas alarmas</strong> son órdenes raras pero correctas. Cada una es una orden que alguien revisa sin necesidad: es el costo de no
            dejar pasar las reales.
          </>
        ),
      };
  return (
    <>
      <Anomalias lang={lang} filtro={filtro} alFiltrar={setFiltro} />
      <Panel
        pista={en ? "Tap a filter to see only those alerts" : "Tocá un filtro para ver solo esas alertas"}
        opciones={
          <Opciones<FiltroAnomalias>
            etiqueta={en ? "Filter alerts" : "Filtrar alertas"}
            valor={filtro}
            alElegir={setFiltro}
            opciones={[
              { id: "todas", texto: en ? "All" : "Todas" },
              { id: "reales", texto: en ? "Errors" : "Errores" },
              { id: "falsas", texto: en ? "False alarms" : "Falsas alarmas" },
            ]}
          />
        }
        cifras={[
          { valor: fmt(lang, c.alertas), rotulo: en ? "Flagged orders" : "Órdenes marcadas" },
          { valor: fmt(lang, c.reales), rotulo: en ? "Real errors" : "Errores reales" },
          { valor: fmt(lang, c.falsas), rotulo: en ? "False alarms" : "Falsas alarmas" },
        ]}
        lectura={lecturas[filtro]}
      />
    </>
  );
}

function SegmentosInteractivo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [grupo, setGrupo] = useState<number | null>(null);
  const r = segmentoResumen(grupo);
  const nombre = grupo === null ? null : nombreSegmento(lang, grupo);
  return (
    <>
      <Segmentos lang={lang} grupo={grupo} alElegir={setGrupo} />
      <Panel
        pista={en ? "Tap a segment to highlight it · tap again to see all" : "Tocá un segmento para resaltarlo · otra vez para ver todos"}
        opciones={
          <Opciones<number | null>
            etiqueta={en ? "Segment" : "Segmento"}
            valor={grupo}
            alElegir={setGrupo}
            opciones={[
              { id: null, texto: en ? "All" : "Todos" },
              ...LAB.segmentos.nombres.map((_, i) => ({ id: i, texto: nombreSegmento(lang, i) })),
            ]}
          />
        }
        cifras={[
          { valor: fmt(lang, r.clientes), rotulo: en ? "Customers" : "Clientes" },
          { valor: fmt(lang, r.recencia), rotulo: en ? "Avg. days since last purchase" : "Días sin comprar, promedio" },
          { valor: fmt(lang, r.frecuencia, 1), rotulo: en ? "Avg. orders" : "Pedidos, promedio" },
        ]}
        lectura={
          nombre ? (
            en ? (
              <>
                <strong>{nombre}</strong>: {r.clientes} of {r.total} customers, {fmt(lang, (r.clientes / r.total) * 100)}% of the base. They last bought{" "}
                <strong>{fmt(lang, r.recencia)} days</strong> ago on average, with <strong>{fmt(lang, r.frecuencia, 1)} orders</strong> each.
              </>
            ) : (
              <>
                <strong>{nombre}</strong>: {r.clientes} de {r.total} clientes, el {fmt(lang, (r.clientes / r.total) * 100)} % de la base. Compraron por última vez hace{" "}
                <strong>{fmt(lang, r.recencia)} días</strong> en promedio, con <strong>{fmt(lang, r.frecuencia, 1)} pedidos</strong> cada uno.
              </>
            )
          ) : en ? (
            <>
              {r.total} customers in {LAB.segmentos.nombres.length} segments. Each one gets a different action: you don&apos;t write to a champion the same way as to someone
              who stopped buying.
            </>
          ) : (
            <>
              {r.total} clientes en {LAB.segmentos.nombres.length} segmentos. Cada uno pide una acción distinta: no se le escribe igual a un campeón que a alguien que dejó de
              comprar.
            </>
          )
        }
      />
    </>
  );
}

const INTERACTIVOS: Record<string, (p: { lang: Lang }) => ReactNode> = {
  "forecasting-de-demanda-e-inventario": ForecastInteractivo,
  "deteccion-de-anomalias-en-ordenes": AnomaliasInteractivo,
  "prediccion-de-churn": ChurnInteractivo,
  "segmentacion-de-clientes": SegmentosInteractivo,
  "experimento-ab-en-retail": AbInteractivo,
};

export default function LabInteractivo({ slug, lang }: { slug: string; lang: Lang }) {
  const I = INTERACTIVOS[slug];
  return I ? <I lang={lang} /> : null;
}
