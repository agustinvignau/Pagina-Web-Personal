import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getEdiciones, periodoLegible } from "@/lib/radar";
import { type Lang, otroIdioma, rutaRadar, textos } from "@/lib/i18n";

export default async function PaginaRadar({ lang }: { lang: Lang }) {
  const t = textos(lang).radar;
  const ediciones = await getEdiciones(lang);

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav lang={lang} alternar={rutaRadar(otroIdioma(lang))} />
        <div className="flex flex-col gap-8 px-6 pb-14 pt-12 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-5">
            <p data-revelar className="rotulo text-oliva-luz">
              {t.eyebrow}
            </p>
            <h1 data-revelar>
              <span className="titular block text-[clamp(2.2rem,6.5vw,4.75rem)]">
                {t.titulo1}
              </span>
              <span className="titular contorno-claro block text-[clamp(2.2rem,6.5vw,4.75rem)]">
                {t.titulo2}
              </span>
            </h1>
          </div>
          <p
            data-revelar
            className="max-w-[44ch] leading-relaxed text-salvia lg:mb-2"
          >
            {t.bajada}
          </p>
        </div>
      </header>

      <section className="bg-hueso px-6 py-14 md:px-12">
        {ediciones.length === 0 ? (
          <p className="etiqueta py-10 text-apagado">{t.vacio}</p>
        ) : (
          <ul className="list-none">
            {ediciones.map((e) => (
              <li
                key={e.id}
                data-revelar
                className="group grid grid-cols-1 items-start gap-x-10 gap-y-4 border-b border-linea py-7 transition-colors hover:bg-superficie lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,15rem)]"
              >
                <span className="etiqueta text-apagado lg:pt-2">
                  {periodoLegible(e.period_start, e.period_end, lang)}
                </span>
                <div className="flex flex-col gap-3">
                  <h2 className="subtitular text-2xl md:text-[1.6rem]">
                    <Link
                      href={rutaRadar(lang, e.slug)}
                      data-cursor={lang === "en" ? "Read" : "Leer"}
                      className="text-texto no-underline transition-colors group-hover:text-oliva-texto"
                    >
                      {e.title}
                    </Link>
                  </h2>
                  {e.summary ? (
                    <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-apagado">
                      {e.summary}
                    </p>
                  ) : null}
                </div>

                {/*
                  Los tres datos de cada edición ocupan la columna que antes
                  quedaba vacía. El índice pasa de ser una lista de títulos a
                  dejar ver de qué se trata cada edición sin abrirla, y de paso
                  el listado usa el ancho completo en vez de la mitad.
                */}
                {e.datos.length > 0 ? (
                  <dl className="m-0 flex flex-row flex-wrap gap-x-8 gap-y-3 lg:flex-col lg:gap-y-3.5 lg:pt-1.5">
                    {e.datos.slice(0, 3).map((d) => (
                      /*
                        El rotulo va primero en el marcado y la cifra despues,
                        que es el orden que pide una lista de definiciones y el
                        que lee un lector de pantalla. Al reves se ve: la
                        columna se invierte con flex-col-reverse.
                      */
                      <div key={d.rotulo} className="flex flex-col-reverse gap-0.5">
                        <dt className="etiqueta-dato text-apagado">{d.rotulo}</dt>
                        <dd className="cifra m-0 text-[1.05rem] leading-none text-texto">
                          {d.valor}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <span aria-hidden />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer lang={lang} />
    </main>
  );
}
