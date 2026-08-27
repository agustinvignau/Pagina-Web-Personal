import { type Lang, textos } from "@/lib/i18n";

export default function Perfil({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang).perfil;

  return (
    <section id="perfil" className="bg-hueso">
      <p className="etiqueta px-6 pb-6 pt-14 text-apagado md:px-12">
        {t.eyebrow}
      </p>

      <div
        data-revelar
        className="flex flex-col justify-between gap-10 bg-oliva px-6 py-12 text-superficie md:px-12 md:py-14 lg:flex-row lg:gap-16"
      >
        <div className="flex flex-col gap-4">
          <p className="etiqueta text-hueso">{t.experienciaActual}</p>
          <h2 className="titular text-[clamp(2.6rem,7.5vw,5.75rem)]">
            TuGenesis
            <br />
            3D
          </h2>
          <p className="etiqueta mt-1 text-hueso">
            {lang === "en" ? "February 2026 — present" : "Febrero 2026 — actualidad"}
          </p>
        </div>

        <div className="flex max-w-[36rem] flex-col gap-4 lg:pt-8">
          <h3 className="subtitular text-2xl md:text-[1.6rem]">{t.rolActual}</h3>
          <p className="text-[0.95rem] leading-relaxed">{t.descripcionActual}</p>
          <ul className="mt-1 flex list-none flex-wrap gap-1.5">
            {t.hitos.map((h) => (
              <li key={h} className="etiqueta border border-hueso px-2 py-1">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        data-revelar
        className="grid grid-cols-1 gap-12 px-6 py-14 md:px-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16"
      >
        <div className="flex flex-col gap-5">
          <p className="etiqueta border-b-2 border-texto pb-3.5 text-apagado">
            {t.antes}
          </p>
          <ul className="list-none">
            {t.trayectoria.map((x) => (
              <li
                key={x.titulo}
                className="grid grid-cols-1 items-baseline gap-x-5 gap-y-1 border-b border-linea py-4 lg:grid-cols-[6.5rem_minmax(0,1fr)]"
              >
                <span className="etiqueta text-apagado">{x.periodo}</span>
                <div>
                  <h3 className="subtitular text-lg">
                    {x.href ? (
                      <a href={x.href} target="_blank" rel="noreferrer">
                        {x.titulo}
                      </a>
                    ) : (
                      x.titulo
                    )}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-apagado">
                    {x.detalle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <p className="etiqueta border-b-2 border-texto pb-3.5 text-apagado">
            {t.formacion}
          </p>

          <div className="flex flex-col gap-4 border border-linea bg-superficie p-5">
            <h3 className="subtitular text-lg">{t.carrera}</h3>
            <p className="etiqueta text-apagado">{t.carreraDonde}</p>
            <dl className="m-0 flex gap-8 border-t border-linea pt-4">
              <div>
                <dd className="cifra m-0 text-2xl">12/19</dd>
                <dt className="etiqueta mt-1 text-apagado">{t.materias}</dt>
              </div>
              <div>
                <dd className="cifra m-0 text-2xl">8,4</dd>
                <dt className="etiqueta mt-1 text-apagado">{t.promedio}</dt>
              </div>
              <div>
                <dd className="cifra m-0 text-2xl">2028</dd>
                <dt className="etiqueta mt-1 text-apagado">{t.licenciatura}</dt>
              </div>
            </dl>
          </div>

          <ul className="list-none">
            {t.cursos.map((c) => (
              <li
                key={c.titulo}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-linea py-3.5"
              >
                <span className="text-[0.95rem]">{c.titulo}</span>
                <span className="etiqueta text-apagado">{c.donde}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
