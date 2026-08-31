import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { fechaLegible, getEscritos, minutosDeLectura } from "@/lib/escritos";
import { type Lang, otroIdioma, rutaEscrito, textos } from "@/lib/i18n";

export default async function PaginaEscritos({ lang }: { lang: Lang }) {
  const t = textos(lang).escritos;
  const escritos = await getEscritos(lang);

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav lang={lang} alternar={rutaEscrito(otroIdioma(lang))} />
        <div className="flex flex-col gap-8 px-6 pb-14 pt-12 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-5">
            <p data-revelar className="etiqueta text-oliva-luz">
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
        {escritos.length === 0 ? (
          <p className="etiqueta py-10 text-apagado">{t.vacio}</p>
        ) : (
          <ul className="list-none">
            {escritos.map((e) => (
              <li
                key={e.id}
                data-revelar
                className="group grid grid-cols-1 items-start gap-x-8 gap-y-3 border-b border-linea py-7 transition-colors hover:bg-superficie lg:grid-cols-[13rem_minmax(0,1fr)]"
              >
                <div className="flex flex-col gap-1 lg:pt-2">
                  <span className="etiqueta text-apagado">
                    {fechaLegible(e.published_at, lang)}
                  </span>
                  <span className="etiqueta text-apagado">
                    {minutosDeLectura(e.body_html)} {t.lectura}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="subtitular text-2xl md:text-[1.6rem]">
                    <Link
                      href={rutaEscrito(lang, e.slug)}
                      data-cursor={lang === "en" ? "Read" : "Leer"}
                      className="text-texto no-underline transition-colors group-hover:text-oliva-texto"
                    >
                      {e.title}
                    </Link>
                  </h2>
                  {e.excerpt ? (
                    <p className="max-w-[70ch] text-sm leading-relaxed text-apagado">
                      {e.excerpt}
                    </p>
                  ) : null}
                  {e.tags.length > 0 ? (
                    <ul className="flex list-none flex-wrap gap-2">
                      {e.tags.map((tag) => (
                        <li
                          key={tag}
                          className="etiqueta border border-linea px-2.5 py-1.5 text-apagado"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer lang={lang} />
    </main>
  );
}
