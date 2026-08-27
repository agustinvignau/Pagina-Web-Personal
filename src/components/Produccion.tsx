import ProyectoFila from "./ProyectoFila";
import { getProyectos } from "@/lib/proyectos";

export default async function Produccion() {
  const proyectos = await getProyectos("produccion");

  return (
    <section id="produccion" className="relative overflow-hidden bg-hueso">
      <span
        aria-hidden
        className="titular contorno-oscuro pointer-events-none absolute -right-8 top-8 hidden select-none text-[22rem] opacity-15 lg:block"
      >
        01
      </span>

      <div className="relative px-6 pt-16 md:px-12 md:pt-20">
        <header className="flex flex-col items-start justify-between gap-6 border-b-2 border-texto pb-7 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-4">
            <p className="etiqueta text-apagado">01 — Producción</p>
            <h2>
              <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">
                Sistemas que
              </span>
              <span className="titular contorno-oscuro block text-[clamp(2.2rem,6vw,4.75rem)]">
                quedan funcionando
              </span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-apagado lg:mb-2">
            Lo que corre hoy en empresas reales, con usuarios que dependen de
            que no se caiga. Cada ficha abre el caso: el problema, la decisión
            de diseño y qué cambió después.
          </p>
        </header>

        {proyectos.length > 0 ? (
          <div className="pb-16">
            {proyectos.map((p, i) => (
              <ProyectoFila key={p.id} proyecto={p} indice={i + 1} />
            ))}
          </div>
        ) : (
          <p className="etiqueta py-16 text-apagado">
            Sin conexión a la base de datos
          </p>
        )}
      </div>

      <a
        href="#laboratorio"
        className="flex flex-wrap items-center justify-between gap-3 bg-tinta px-6 py-6 no-underline md:px-12"
      >
        <span className="etiqueta text-apagado-oscuro">02 — Laboratorio</span>
        <span className="etiqueta text-hueso">
          Cinco estudios metodológicos con datos sintéticos →
        </span>
      </a>
    </section>
  );
}
