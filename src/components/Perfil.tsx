import { type Lang, textos } from "@/lib/i18n";

export default function Perfil({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang).perfil;

  return (
    <section id="perfil" className="bg-hueso pt-14">
      {/*
        El rótulo vive DENTRO de la banda oliva. Afuera quedaba flotando sobre
        el hueso de la sección anterior y rotulaba un bloque al que no
        pertenecía visualmente.
      */}
      <div
        data-revelar
        className="flex flex-col justify-between gap-10 bg-oliva px-6 py-12 text-superficie md:px-12 md:py-14 lg:flex-row lg:gap-16"
      >
        <div className="flex flex-col gap-4">
          <p className="rotulo text-hueso/80">{t.eyebrow}</p>
          <p className="etiqueta text-hueso">{t.experienciaActual}</p>
          {/* La marca se escribe TuGenesis3D: sin corte forzado y sin
              mayúsculas, que le comían el camel case. */}
          <h2 className="titular normal-case text-[clamp(2.4rem,7vw,5.25rem)]">
            TuGenesis3D
          </h2>
          <p className="etiqueta mt-1 text-hueso">
            {lang === "en" ? "February 2026 — present" : "Febrero 2026 — actualidad"}
          </p>
          {/*
            Los hitos bajan a esta columna. Estaban debajo de la descripción,
            que ya era la más alta de las dos, así que la banda quedaba con
            todo el peso a la derecha y un vacío grande abajo a la izquierda.
            Acá cuelgan del nombre de la empresa, que es de lo que hablan.
          */}
          <ul className="mt-5 flex list-none flex-wrap gap-1.5">
            {t.hitos.map((h) => (
              <li key={h} className="etiqueta-dato border border-hueso/60 px-2 py-1">
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex max-w-[36rem] flex-col gap-4 lg:pt-8">
          <h3 className="subtitular text-2xl md:text-[1.6rem]">{t.rolActual}</h3>
          <p className="text-[0.95rem] leading-relaxed">{t.descripcionActual}</p>
        </div>
      </div>

      <div
        data-revelar
        className="grid grid-cols-1 gap-12 px-6 py-14 md:px-12 lg:grid-cols-2 lg:gap-16"
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
                /* En grilla y no en flex-wrap: con justify-between, el título
                   largo empujaba su meta al renglón siguiente y cada ítem de
                   la lista terminaba alineado distinto. */
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-linea py-3.5"
              >
                <span className="text-[0.95rem]">{c.titulo}</span>
                <span className="etiqueta text-right text-apagado">{c.donde}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
