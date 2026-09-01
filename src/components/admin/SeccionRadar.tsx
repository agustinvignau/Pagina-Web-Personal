"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";
import { Boton, Estado, Titulo, Vacio } from "./piezas";

type Edicion = {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  summary: string | null;
  period_start: string;
  period_end: string;
  status: "draft" | "published";
  body_html: string | null;
  body_html_en: string | null;
};

export default function SeccionRadar() {
  const [ediciones, setEdiciones] = useState<Edicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [abierta, setAbierta] = useState<string | null>(null);
  const [idioma, setIdioma] = useState<"es" | "en">("es");

  const traer = useCallback(async () => {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("radar_items")
      .select("id,slug,title,title_en,summary,period_start,period_end,status,body_html,body_html_en")
      .order("period_end", { ascending: false });
    if (error) setAviso(`No pude leer las ediciones: ${error.message}`);
    setEdiciones((data ?? []) as Edicion[]);
    setCargando(false);
  }, []);

  useEffect(() => {
    traer();
  }, [traer]);

  async function cambiarEstado(e: Edicion) {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const publicar = e.status === "draft";

    setOcupado(e.id);
    const { error } = await supabase
      .from("radar_items")
      .update({
        status: publicar ? "published" : "draft",
        published_at: publicar ? new Date().toISOString() : null,
      })
      .eq("id", e.id);
    setOcupado(null);

    if (error) {
      setAviso(`No se pudo guardar: ${error.message}`);
      return;
    }
    setAviso(
      publicar
        ? "Publicada. El sitio la muestra dentro de los próximos cinco minutos."
        : "Vuelta a borrador. Desaparece del sitio en cinco minutos.",
    );
    traer();
  }

  if (cargando) return <Vacio>Cargando ediciones…</Vacio>;

  return (
    <section>
      <Titulo nota="La tarea automática publica la edición sola los días 1 y 16, y te avisa por mail. Acá la corregís o la bajás si algo salió mal.">
        Radar
      </Titulo>
      <Estado texto={aviso} />

      {ediciones.length === 0 ? (
        <Vacio>Todavía no hay ediciones.</Vacio>
      ) : (
        <ul className="list-none">
          {ediciones.map((e) => {
            const cuerpo = idioma === "en" ? e.body_html_en : e.body_html;
            const titulo = idioma === "en" ? (e.title_en ?? e.title) : e.title;
            return (
              <li key={e.id} className="border-b border-linea py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="etiqueta text-apagado">
                      {e.period_start} → {e.period_end}
                    </span>
                    <h3 className="subtitular text-xl">{titulo}</h3>
                    {e.summary ? (
                      <p className="max-w-[70ch] text-sm text-apagado">{e.summary}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`etiqueta px-2.5 py-1.5 ${
                        e.status === "published"
                          ? "bg-oliva text-hueso"
                          : "border border-linea text-apagado"
                      }`}
                    >
                      {e.status === "published" ? "Publicada" : "Borrador"}
                    </span>
                    <Boton onClick={() => setAbierta(abierta === e.id ? null : e.id)}>
                      {abierta === e.id ? "Cerrar" : "Leerla"}
                    </Boton>
                    <Boton
                      variante={e.status === "draft" ? "fuerte" : "normal"}
                      ocupado={ocupado === e.id}
                      onClick={() => cambiarEstado(e)}
                    >
                      {e.status === "draft" ? "Publicar" : "Despublicar"}
                    </Boton>
                  </div>
                </div>

                {abierta === e.id ? (
                  <div className="mt-6 border border-linea bg-superficie p-6">
                    <div className="mb-5 flex gap-2">
                      {(["es", "en"] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setIdioma(l)}
                          className={`etiqueta border px-3 py-2 ${
                            idioma === l
                              ? "border-texto bg-texto text-hueso"
                              : "border-linea text-apagado"
                          }`}
                        >
                          {l === "es" ? "Español" : "Inglés"}
                        </button>
                      ))}
                    </div>
                    {cuerpo ? (
                      <div
                        className="prosa"
                        dangerouslySetInnerHTML={{ __html: cuerpo }}
                      />
                    ) : (
                      <p className="etiqueta text-apagado">
                        Esta edición todavía no tiene versión en {idioma === "en" ? "inglés" : "español"}.
                      </p>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
