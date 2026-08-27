import { ACTUAL, ANTES, FORMACION } from "@/lib/trayectoria";

export default function Perfil() {
  return (
    <section id="perfil" className="bg-hueso">
      <p className="etiqueta px-6 pb-6 pt-14 text-apagado md:px-12">
        03 — Perfil
      </p>

      {/* Banda del trabajo actual */}
      <div data-revelar className="flex flex-col justify-between gap-10 bg-oliva px-6 py-12 text-superficie md:px-12 md:py-14 lg:flex-row lg:gap-16">
        <div className="flex flex-col gap-4">
          <p className="etiqueta text-hueso">Experiencia actual</p>
          <h2 className="titular text-[clamp(2.6rem,7.5vw,5.75rem)]">
            TuGenesis
            <br />
            3D
          </h2>
          <p className="etiqueta mt-1 text-hueso">{ACTUAL.periodo}</p>
        </div>

        <div className="flex max-w-[36rem] flex-col gap-4 lg:pt-8">
          <h3 className="subtitular text-2xl md:text-[1.6rem]">{ACTUAL.rol}</h3>
          <p className="text-[0.95rem] leading-relaxed">{ACTUAL.descripcion}</p>
          <ul className="mt-1 flex list-none flex-wrap gap-1.5">
            {ACTUAL.hitos.map((h) => (
              <li key={h} className="etiqueta border border-hueso px-2 py-1">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trayectoria y formación */}
      <div data-revelar className="grid grid-cols-1 gap-12 px-6 py-14 md:px-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="etiqueta border-b-2 border-texto pb-3.5 text-apagado">
            Antes
          </p>
          <ul className="list-none">
            {ANTES.map((t) => (
              <li
                key={t.titulo}
                className="grid grid-cols-1 items-baseline gap-x-5 gap-y-1 border-b border-linea py-4 lg:grid-cols-[6.5rem_minmax(0,1fr)]"
              >
                <span className="etiqueta text-apagado">{t.periodo}</span>
                <div>
                  <h3 className="subtitular text-lg">
                    {t.href ? (
                      <a href={t.href} target="_blank" rel="noreferrer">
                        {t.titulo}
                      </a>
                    ) : (
                      t.titulo
                    )}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-apagado">
                    {t.detalle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <p className="etiqueta border-b-2 border-texto pb-3.5 text-apagado">
            Formación
          </p>

          <div className="flex flex-col gap-4 border border-linea bg-superficie p-5">
            <h3 className="subtitular text-lg">
              Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial
            </h3>
            <p className="etiqueta text-apagado">IFTS N°18 · 2025 — 2027</p>
            <dl className="m-0 flex gap-8 border-t border-linea pt-4">
              <div>
                <dd className="cifra m-0 text-2xl">12/19</dd>
                <dt className="etiqueta mt-1 text-apagado">Materias</dt>
              </div>
              <div>
                <dd className="cifra m-0 text-2xl">8,4</dd>
                <dt className="etiqueta mt-1 text-apagado">Promedio</dt>
              </div>
              <div>
                <dd className="cifra m-0 text-2xl">2028</dd>
                <dt className="etiqueta mt-1 text-apagado">Licenciatura</dt>
              </div>
            </dl>
          </div>

          <ul className="list-none">
            {FORMACION.map((f) => (
              <li
                key={f.titulo}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-linea py-3.5"
              >
                <span className="text-[0.95rem]">{f.titulo}</span>
                <span className="etiqueta text-apagado">{f.donde}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
