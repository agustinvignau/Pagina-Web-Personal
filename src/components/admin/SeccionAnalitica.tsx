"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";
import { Estado, Titulo, Vacio } from "./piezas";

type Fila = Record<string, string | number>;
type Resumen = {
  visitas: number;
  visitantes: number;
  cv: number;
  contacto: number;
  por_dia: { dia: string; visitas: number; visitantes: number }[];
  paginas: Fila[];
  referidos: Fila[];
  paises: Fila[];
  dispositivos: Fila[];
  idiomas: Fila[];
};

const RANGOS = [
  { dias: 7, label: "7 días" },
  { dias: 30, label: "30 días" },
  { dias: 90, label: "90 días" },
  { dias: 365, label: "1 año" },
];

function Cifra({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div className="flex flex-col gap-1 border border-linea bg-superficie px-4 py-3.5">
      <span className="etiqueta text-apagado">{rotulo}</span>
      <span className="cifra text-2xl tabular-nums">{valor.toLocaleString("es-AR")}</span>
    </div>
  );
}

/** Barras por día. Una sola serie, así que no lleva leyenda: el título la nombra. */
function PorDia({ datos }: { datos: Resumen["por_dia"] }) {
  const max = Math.max(1, ...datos.map((d) => d.visitas));
  const pico = datos.find((d) => d.visitas === max);

  return (
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="etiqueta text-apagado">
        Visitas por día{pico && max > 0 ? ` · pico de ${max} el ${pico.dia.slice(5)}` : ""}
      </figcaption>
      <div className="flex h-32 items-end gap-[2px]" role="img"
           aria-label={`Visitas por día. Máximo ${max}.`}>
        {datos.map((d) => (
          <div key={d.dia} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-[4px] bg-oliva transition-colors group-hover:bg-texto"
              style={{ height: `${Math.max(d.visitas / max * 100, d.visitas > 0 ? 3 : 0)}%` }}
            />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap border border-linea bg-hueso px-2.5 py-1.5 text-xs shadow-sm group-hover:block">
              <strong className="tabular-nums">{d.visitas}</strong> visitas
              <span className="text-apagado"> · {d.visitantes} únicos</span>
              <span className="block text-apagado">{d.dia}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t border-linea pt-1.5">
        <span className="etiqueta text-apagado">{datos[0]?.dia.slice(5)}</span>
        <span className="etiqueta text-apagado">{datos.at(-1)?.dia.slice(5)}</span>
      </div>
    </figure>
  );
}

function Lista({ titulo, filas, clave, total }: {
  titulo: string; filas: Fila[]; clave: string; total: number;
}) {
  if (filas.length === 0) return null;
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="etiqueta text-apagado">{titulo}</h3>
      <ul className="list-none">
        {filas.map((f) => {
          const visitas = Number(f.visitas);
          return (
            <li key={String(f[clave])} className="relative border-b border-linea py-2">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-superficie"
                style={{ width: `${total ? (visitas / total) * 100 : 0}%` }}
              />
              <span className="relative flex justify-between gap-4 text-sm">
                <span className="truncate">{String(f[clave])}</span>
                <span className="cifra shrink-0 tabular-nums text-apagado">{visitas}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SeccionAnalitica() {
  const [dias, setDias] = useState(30);
  const [datos, setDatos] = useState<Resumen | null>(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);

  const traer = useCallback(async () => {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    setCargando(true);
    const { data, error } = await supabase.rpc("analitica_resumen", { p_dias: dias });
    if (error) setAviso(`No pude leer la analítica: ${error.message}`);
    else setDatos(data as Resumen);
    setCargando(false);
  }, [dias]);

  useEffect(() => { traer(); }, [traer]);

  return (
    <section>
      <Titulo nota="Registro propio, sin cookies. Los visitantes únicos se cuentan por día: el mismo visitante mañana ya es otro hash, así que no hay forma de seguir a nadie entre jornadas.">
        Analítica
      </Titulo>
      <Estado texto={aviso} />

      <div className="mb-7 flex flex-wrap gap-2">
        {RANGOS.map((r) => (
          <button
            key={r.dias}
            type="button"
            onClick={() => setDias(r.dias)}
            className={`etiqueta border px-3.5 py-2 transition-colors ${
              dias === r.dias
                ? "border-texto bg-texto text-hueso"
                : "border-linea text-apagado hover:border-texto hover:text-texto"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {cargando && !datos ? (
        <Vacio>Cargando…</Vacio>
      ) : !datos || datos.visitas === 0 ? (
        <Vacio>Todavía no hay visitas registradas en este período.</Vacio>
      ) : (
        <div className="flex flex-col gap-9">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Cifra valor={datos.visitas} rotulo="Visitas" />
            <Cifra valor={datos.visitantes} rotulo="Visitantes únicos" />
            <Cifra valor={datos.cv} rotulo="Descargas del CV" />
            <Cifra valor={datos.contacto} rotulo="Mensajes enviados" />
          </div>

          <PorDia datos={datos.por_dia} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Lista titulo="Páginas más vistas" filas={datos.paginas} clave="ruta" total={datos.visitas} />
            <Lista titulo="De dónde llegan" filas={datos.referidos} clave="origen" total={datos.visitas} />
            <Lista titulo="Países" filas={datos.paises} clave="pais" total={datos.visitas} />
            <div className="flex flex-col gap-8">
              <Lista titulo="Dispositivos" filas={datos.dispositivos} clave="dispositivo" total={datos.visitas} />
              <Lista titulo="Idioma" filas={datos.idiomas} clave="lang" total={datos.visitas} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
