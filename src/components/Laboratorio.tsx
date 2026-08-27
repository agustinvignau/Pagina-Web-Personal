import { getProyectos } from "@/lib/proyectos";

export default async function Laboratorio() {
  const estudios = await getProyectos("laboratorio");
  if (estudios.length === 0) return null;

  return (
    <section id="laboratorio" className="bg-tinta text-hueso">
      <div className="px-6 py-16 md:px-12 md:py-20">
        <header className="flex flex-col items-start justify-between gap-6 border-b-2 border-hueso pb-7 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-4">
            <p className="etiqueta text-apagado-oscuro">02 — Laboratorio</p>
            <h2>
              <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">
                Cómo pienso
              </span>
              <span className="titular contorno-claro block text-[clamp(2.2rem,6vw,4.75rem)]">
                un problema
              </span>
            </h2>
          </div>
          <p className="max-w-[40ch] text-sm leading-relaxed text-salvia lg:mb-2">
            Cinco estudios de punta a punta con datos sintéticos, inspirados en
            el taller de producción y el depósito mayorista donde trabajé. Los
            datos son inventados a propósito, para poder mostrar el método sin
            exponer a ninguna empresa.
          </p>
        </header>

        <ul className="list-none">
          {estudios.map((e, i) => (
            <li
              key={e.id}
              className="grid grid-cols-1 items-start gap-x-8 gap-y-3 border-b border-linea-oscura py-6 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,26rem)]"
            >
              <span className="cifra text-[0.7rem] text-oliva-luz lg:pt-1.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="subtitular text-xl md:text-2xl">
                  <a
                    href={`/proyectos/${e.slug}`}
                    className="text-hueso no-underline transition-colors hover:text-oliva-luz"
                  >
                    {e.title}
                  </a>
                </h3>
                {e.problem ? (
                  <p className="text-sm text-apagado-oscuro">{e.problem}</p>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-salvia">
                {e.solution ?? e.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
