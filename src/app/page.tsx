import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

async function contarProyectos() {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("kind")
    .eq("published", true);

  if (error || !data) return null;

  return {
    total: data.length,
    produccion: data.filter((p) => p.kind === "produccion").length,
    laboratorio: data.filter((p) => p.kind === "laboratorio").length,
  };
}

export default async function Home() {
  const conteo = await contarProyectos();

  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <header className="flex items-start justify-between">
        <div className="etiqueta leading-relaxed">
          <div style={{ color: "var(--tinta-texto)" }}>AGUSTÍN</div>
          <div style={{ color: "var(--acento)" }}>VIGNAU</div>
        </div>
        <div className="etiqueta flex items-center gap-2">
          <span
            className="block h-[5px] w-[5px]"
            style={{ background: "var(--acento)" }}
          />
          BUENOS AIRES
        </div>
      </header>

      <div className="flex flex-col gap-8 py-16">
        <div>
          <div className="titular text-[clamp(2.6rem,11vw,9rem)]">Analizo,</div>
          <div className="titular contorno text-[clamp(2.6rem,11vw,9rem)]">
            Diseño
          </div>
          <div
            className="titular text-[clamp(2.6rem,11vw,9rem)]"
            style={{ color: "var(--acento)" }}
          >
            Y resuelvo.
          </div>
        </div>

        <p
          className="max-w-[52ch] text-base leading-relaxed md:text-lg"
          style={{ color: "var(--sutil)" }}
        >
          Sistemas de datos y automatización para PyMEs: inventario, carga
          automática de comprobantes y reportes sobre los que se decide.
        </p>
      </div>

      <footer
        className="flex flex-wrap items-center justify-between gap-4 border-t pt-5"
        style={{ borderColor: "var(--borde)" }}
      >
        <span className="etiqueta">EN CONSTRUCCIÓN · FASE 0 DE 6</span>
        <span className="etiqueta">
          {conteo
            ? `${conteo.total} PROYECTOS EN BASE · ${conteo.produccion} EN PRODUCCIÓN · ${conteo.laboratorio} ESTUDIOS`
            : "SIN CONEXIÓN A LA BASE"}
        </span>
        <span className="etiqueta">2026</span>
      </footer>
    </main>
  );
}
