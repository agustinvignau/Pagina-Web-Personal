"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";
import { ESTADOS, type ProjectStatus } from "@/lib/types";
import { textos } from "@/lib/i18n";
import { Boton, Estado, Titulo, Vacio } from "./piezas";

type Fila = {
  id: string;
  slug: string;
  kind: "produccion" | "laboratorio";
  position: number;
  title: string;
  title_en: string | null;
  published: boolean;
  featured: boolean;
  status: ProjectStatus | null;
  cover_url: string | null;
  cover_alt: string | null;
  cover_alt_en: string | null;
};

const BUCKET = "proyectos";
const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS = ["image/webp", "image/png", "image/jpeg", "image/avif"];
const ROTULOS = textos("es").produccion.estados;

/**
 * Devuelve la ruta del objeto dentro del bucket si la URL es nuestra. Una
 * portada cargada a mano desde otro lado no se borra: no es de este bucket.
 */
function rutaEnBucket(url: string | null): string | null {
  if (!url) return null;
  const marca = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marca);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marca.length));
}

export default function SeccionProyectos() {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [abierta, setAbierta] = useState<string | null>(null);
  const [alts, setAlts] = useState<Record<string, { es: string; en: string }>>({});

  const traer = useCallback(async () => {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id,slug,kind,position,title,title_en,published,featured,status,cover_url,cover_alt,cover_alt_en",
      )
      .order("kind", { ascending: false })
      .order("position");
    if (error) setAviso(`No pude leer los proyectos: ${error.message}`);
    const lista = (data ?? []) as Fila[];
    setFilas(lista);
    setAlts(
      Object.fromEntries(
        lista.map((f) => [f.id, { es: f.cover_alt ?? "", en: f.cover_alt_en ?? "" }]),
      ),
    );
    setCargando(false);
  }, []);

  useEffect(() => {
    traer();
  }, [traer]);

  async function guardar(f: Fila, cambios: Partial<Fila>, clave: string) {
    const supabase = getSupabaseNavegador();
    if (!supabase) return false;
    setOcupado(f.id + clave);
    const { error } = await supabase.from("projects").update(cambios).eq("id", f.id);
    setOcupado(null);
    if (error) {
      setAviso(`No se pudo guardar: ${error.message}`);
      return false;
    }
    setAviso("Guardado. El sitio se actualiza en cinco minutos.");
    traer();
    return true;
  }

  async function alternar(f: Fila, campo: "published" | "featured") {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    // Sólo puede haber un proyecto insignia: destacar uno apaga el anterior.
    if (campo === "featured" && !f.featured) {
      await supabase.from("projects").update({ featured: false }).eq("featured", true);
    }
    await guardar(f, { [campo]: !f[campo] }, campo);
  }

  async function subirPortada(f: Fila, archivo: File) {
    if (!TIPOS.includes(archivo.type)) {
      setAviso("La portada tiene que ser WebP, PNG, JPG o AVIF.");
      return;
    }
    if (archivo.size > MAX_BYTES) {
      setAviso("La portada pesa más de 5 MB. Exportala más chica (1400 px de ancho alcanza).");
      return;
    }
    const supabase = getSupabaseNavegador();
    if (!supabase) return;

    // Nombre nuevo en cada subida, en vez de pisar el anterior: así el
    // navegador y la CDN no muestran la portada vieja desde la caché.
    const ext = archivo.name.split(".").pop()?.toLowerCase() || "webp";
    const ruta = `${f.slug}/${Date.now()}.${ext}`;
    setOcupado(f.id + "portada");
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(ruta, archivo, { contentType: archivo.type, cacheControl: "31536000" });
    if (error) {
      setOcupado(null);
      setAviso(`No se pudo subir la portada: ${error.message}`);
      return;
    }
    const url = supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
    const vieja = rutaEnBucket(f.cover_url);
    const ok = await guardar(f, { cover_url: url }, "portada");
    // La vieja se borra recién cuando la nueva ya quedó guardada en la fila.
    if (ok && vieja) await supabase.storage.from(BUCKET).remove([vieja]);
  }

  async function quitarPortada(f: Fila) {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const vieja = rutaEnBucket(f.cover_url);
    const ok = await guardar(f, { cover_url: null }, "portada");
    if (ok && vieja) await supabase.storage.from(BUCKET).remove([vieja]);
  }

  if (cargando) return <Vacio>Cargando proyectos…</Vacio>;

  const grupos = [
    { kind: "produccion" as const, label: "Producción" },
    { kind: "laboratorio" as const, label: "Laboratorio" },
  ];

  return (
    <section>
      <Titulo nota="Acá se decide qué se ve, cuál es el proyecto insignia, su estado y su portada. Los textos se editan en Supabase.">
        Proyectos
      </Titulo>
      <Estado texto={aviso} />

      {grupos.map((g) => (
        <div key={g.kind} className="mb-10">
          <p className="etiqueta mb-3 text-apagado">{g.label}</p>
          <ul className="list-none">
            {filas
              .filter((f) => f.kind === g.kind)
              .map((f) => {
                const alt = alts[f.id] ?? { es: "", en: "" };
                const altCambio =
                  alt.es !== (f.cover_alt ?? "") || alt.en !== (f.cover_alt_en ?? "");
                return (
                  <li key={f.id} className="border-b border-linea py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="h-12 w-[4.8rem] shrink-0 overflow-hidden border border-linea bg-superficie-2">
                          {f.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={f.cover_url} alt="" className="h-full w-full object-cover object-left-top" />
                          ) : null}
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="subtitular text-lg">{f.title}</span>
                          <span className="etiqueta text-apagado">
                            {f.slug}
                            {f.title_en ? "" : " · sin traducción"}
                            {f.cover_url ? "" : " · sin portada"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="sr-only" htmlFor={`estado-${f.id}`}>
                          Estado de {f.title}
                        </label>
                        <select
                          id={`estado-${f.id}`}
                          value={f.status ?? ""}
                          disabled={ocupado === f.id + "status"}
                          onChange={(e) =>
                            guardar(
                              f,
                              { status: (e.target.value || null) as ProjectStatus | null },
                              "status",
                            )
                          }
                          className="etiqueta border border-linea bg-transparent px-3 py-2.5 text-apagado"
                        >
                          <option value="">Sin estado</option>
                          {ESTADOS.map((e) => (
                            <option key={e} value={e}>
                              {ROTULOS[e]}
                            </option>
                          ))}
                        </select>
                        <Boton onClick={() => setAbierta(abierta === f.id ? null : f.id)}>
                          {abierta === f.id ? "Cerrar" : "Portada"}
                        </Boton>
                        <Boton
                          ocupado={ocupado === f.id + "featured"}
                          variante={f.featured ? "fuerte" : "normal"}
                          onClick={() => alternar(f, "featured")}
                        >
                          {f.featured ? "Insignia" : "Destacar"}
                        </Boton>
                        <Boton
                          ocupado={ocupado === f.id + "published"}
                          onClick={() => alternar(f, "published")}
                        >
                          {f.published ? "Visible" : "Oculto"}
                        </Boton>
                      </div>
                    </div>

                    {abierta === f.id ? (
                      <div className="mt-4 grid gap-4 bg-superficie p-4 md:grid-cols-[16rem_minmax(0,1fr)]">
                        <div className="flex flex-col gap-3">
                          <div className="aspect-[16/10] w-full overflow-hidden border border-tinta bg-superficie-2">
                            {f.cover_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={f.cover_url} alt="" className="h-full w-full object-cover object-left-top" />
                            ) : (
                              <p className="etiqueta p-3 text-apagado">
                                Sin portada: el carrusel usa el mockup si existe, o la de reserva.
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <label className="etiqueta cursor-pointer border border-linea px-4 py-2.5 text-apagado hover:border-texto hover:text-texto">
                              {ocupado === f.id + "portada" ? "Subiendo…" : f.cover_url ? "Cambiar" : "Subir"}
                              <input
                                type="file"
                                accept={TIPOS.join(",")}
                                className="sr-only"
                                disabled={ocupado === f.id + "portada"}
                                onChange={(e) => {
                                  const archivo = e.target.files?.[0];
                                  e.target.value = "";
                                  if (archivo) subirPortada(f, archivo);
                                }}
                              />
                            </label>
                            {f.cover_url ? (
                              <Boton onClick={() => quitarPortada(f)}>Quitar</Boton>
                            ) : null}
                          </div>
                          <p className="text-xs text-apagado">
                            Horizontal, 16:10, unos 1400 px de ancho. En celular se ve la esquina
                            superior izquierda más grande: lo importante, arriba a la izquierda.
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="flex flex-col gap-1">
                            <span className="etiqueta text-apagado">Qué muestra la imagen</span>
                            <textarea
                              rows={2}
                              value={alt.es}
                              onChange={(e) =>
                                setAlts({ ...alts, [f.id]: { ...alt, es: e.target.value } })
                              }
                              className="border border-linea bg-hueso p-2 text-sm"
                              placeholder="Tablero de Génesis con los SKUs bajo punto de reorden"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="etiqueta text-apagado">En inglés</span>
                            <textarea
                              rows={2}
                              value={alt.en}
                              onChange={(e) =>
                                setAlts({ ...alts, [f.id]: { ...alt, en: e.target.value } })
                              }
                              className="border border-linea bg-hueso p-2 text-sm"
                            />
                          </label>
                          <div>
                            <Boton
                              ocupado={ocupado === f.id + "alt"}
                              variante={altCambio ? "fuerte" : "normal"}
                              onClick={() =>
                                guardar(
                                  f,
                                  { cover_alt: alt.es || null, cover_alt_en: alt.en || null },
                                  "alt",
                                )
                              }
                            >
                              Guardar texto
                            </Boton>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </section>
  );
}
