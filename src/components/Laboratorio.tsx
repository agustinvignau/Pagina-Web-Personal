import { getProyectos } from "@/lib/proyectos";
import { type Lang, rutaProyecto, textos } from "@/lib/i18n";

export default async function Laboratorio({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang);
  const estudios = await getProyectos("laboratorio", lang);
  if (estudios.length === 0) return null;

  return (
    <section id="laboratorio" className="bg-tinta text-hueso">
      <div className="px-6 py-16 md:px-12 md:py-20">
        <header
          data-revelar
          className="flex flex-col items-start justify-between gap-6 border-b-2 border-hueso pb-7 lg:flex-row lg:items-end"
        >
          <div className="flex flex-col gap-4">
            <p className="etiqueta text-apagado-oscuro">{t.laboratorio.eyebrow}</p>
            <h2>
              <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.laboratorio.titulo1}
              </span>
              <span className="titular contorno-claro block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.laboratorio.titulo2}
              </span>
            </h2>
          </div>
          <p className="max-w-[40ch] text-sm leading-relaxed text-salvia lg:mb-2">
            {t.laboratorio.bajada}
          </p>
        </header>

        <ul className="list-none">
          {estudios.map((e, i) => (
            <li
              data-revelar
              key={e.id}
              className="grid grid-cols-1 items-start gap-x-8 gap-y-3 border-b border-linea-oscura py-6 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,26rem)]"
            >
              <span className="cifra text-[0.7rem] text-oliva-luz lg:pt-1.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="subtitular text-xl md:text-2xl">
                  <a
                    href={rutaProyecto(lang, e.slug)}
                    data-cursor={lang === "en" ? "Open" : "Ver"}
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
