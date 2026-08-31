"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";
import { Boton, Estado, Titulo, Vacio } from "./piezas";

type Escrito = {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  excerpt: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
  body_html: string | null;
  body_html_en: string | null;
};

export default function SeccionEscritos() {
  const [escritos, setEscritos] = useState<Escrito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [idioma, setIdioma] = useState<"es" | "en">("es");

  const traer = useCallback(async () => {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("posts")
      .select("id,slug,title,title_en,excerpt,tags,status,published_at,updated_at,body_html,body_html_en")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false });
    if (error) setAviso(`No pude leer los escritos: ${error.message}`);
    setEscritos((data ?? []) as Escrito[]);
    setCargando(false);
  }, []);

  useEffect(() => {
    traer();
  }, [traer]);

  async function cambiarEstado(e: Escrito) {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const publicar = e.status === "draft";

    setOcupado(e.id);
    /*
      Al despublicar NO se borra published_at: es la fecha en que el artículo
      salió por primera vez, y el sitio la usa para ordenar. Si se limpiara,
      un artículo corregido volvería al final de la lista.
    */
    const { error } = await supabase
      .from("posts")
      .update({
        status: publicar ? "published" : "draft",
        published_at: publicar ? (e.published_at ?? new Date().toISOString()) : e.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", e.id);
    setOcupado(null);

    if (error) {
      setAviso(`No se pudo guardar: ${error.message}`);
      return;
    }
    setAviso(
      publicar
        ? "Publicado. El sitio lo muestra dentro de los próximos cinco minutos."
        : "Vuelto a borrador. Desaparece del sitio en cinco minutos.",
    );
    traer();
  }

  if (cargando) return <Vacio>Cargando escritos…</Vacio>;

  return (
    <section>
      <Titulo nota="Los artículos se cargan desde Supabase. Acá se decide cuáles salen y se leen antes de publicarlos.">
        Escritos
      </Titulo>
      <Estado texto={aviso} />

      {escritos.length === 0 ? (
        <Vacio>Todavía no hay escritos cargados.</Vacio>
      ) : (
        <ul className="list-none">
          {escritos.map((e) => {
            const cuerpo = idioma === "en" ? e.body_html_en : e.body_html;
            const titulo = idioma === "en" ? (e.title_en ?? e.title) : e.title;
            return (
              <li key={e.id} className="border-b border-linea py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="etiqueta text-apagado">
                      {e.published_at ? e.published_at.slice(0, 10) : "sin fecha"}
                      <span aria-hidden> · </span>
                      /{e.slug}
                    </span>
                    <h3 className="subtitular text-xl">{titulo}</h3>
                    {e.excerpt ? (
                      <p className="max-w-[70ch] text-sm text-apagado">{e.excerpt}</p>
                    ) : null}
                    {e.tags.length > 0 ? (
                      <ul className="flex list-none flex-wrap gap-2">
                        {e.tags.map((tag) => (
                          <li
                            key={tag}
                            className="etiqueta border border-linea px-2 py-1 text-apagado"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
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
                      {e.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                    <Boton onClick={() => setAbierto(abierto === e.id ? null : e.id)}>
                      {abierto === e.id ? "Cerrar" : "Leerlo"}
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

                {abierto === e.id ? (
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
                        Este escrito todavía no tiene versión en {idioma === "en" ? "inglés" : "español"}.
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
