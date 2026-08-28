"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";
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
};

export default function SeccionProyectos() {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const traer = useCallback(async () => {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("projects")
      .select("id,slug,kind,position,title,title_en,published,featured")
      .order("kind", { ascending: false })
      .order("position");
    if (error) setAviso(`No pude leer los proyectos: ${error.message}`);
    setFilas((data ?? []) as Fila[]);
    setCargando(false);
  }, []);

  useEffect(() => {
    traer();
  }, [traer]);

  async function alternar(f: Fila, campo: "published" | "featured") {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;

    // Sólo puede haber un proyecto insignia: destacar uno apaga el anterior.
    setOcupado(f.id + campo);
    if (campo === "featured" && !f.featured) {
      await supabase
        .from("projects")
        .update({ featured: false })
        .eq("featured", true);
    }
    const { error } = await supabase
      .from("projects")
      .update({ [campo]: !f[campo] })
      .eq("id", f.id);
    setOcupado(null);

    if (error) {
      setAviso(`No se pudo guardar: ${error.message}`);
      return;
    }
    setAviso("Guardado. El sitio se actualiza en cinco minutos.");
    traer();
  }

  if (cargando) return <Vacio>Cargando proyectos…</Vacio>;

  const grupos = [
    { kind: "produccion" as const, label: "Producción" },
    { kind: "laboratorio" as const, label: "Laboratorio" },
  ];

  return (
    <section>
      <Titulo nota="Acá se decide qué se ve y cuál es el proyecto insignia. Los textos se editan en Supabase.">
        Proyectos
      </Titulo>
      <Estado texto={aviso} />

      {grupos.map((g) => (
        <div key={g.kind} className="mb-10">
          <p className="etiqueta mb-3 text-apagado">{g.label}</p>
          <ul className="list-none">
            {filas
              .filter((f) => f.kind === g.kind)
              .map((f) => (
                <li
                  key={f.id}
                  className="flex flex-wrap items-center justify-between gap-4 border-b border-linea py-4"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="subtitular text-lg">{f.title}</span>
                    <span className="etiqueta text-apagado">
                      {f.slug}
                      {f.title_en ? "" : " · sin traducción"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
