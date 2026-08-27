import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getEdicion, periodoLegible } from "@/lib/radar";
import { type Lang, otroIdioma, rutaRadar, textos } from "@/lib/i18n";

export default async function PaginaEdicion({
  slug,
  lang,
}: {
  slug: string;
  lang: Lang;
}) {
  const edicion = await getEdicion(slug, lang);
  if (!edicion) notFound();

  const t = textos(lang).radar;

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav lang={lang} alternar={rutaRadar(otroIdioma(lang), slug)} />
        <div className="mx-auto flex max-w-[52rem] flex-col gap-6 px-6 pb-12 pt-12 md:px-12">
          <p data-revelar className="etiqueta text-oliva-luz">
            {t.edicion}
          </p>
          <h1 data-revelar className="titular text-[clamp(2rem,5.5vw,3.75rem)]">
            {edicion.title}
          </h1>
          <p data-revelar className="etiqueta text-apagado-oscuro">
            {periodoLegible(edicion.period_start, edicion.period_end, lang)}
          </p>

          {edicion.datos.length > 0 ? (
            <ul data-revelar className="mt-2 flex list-none flex-wrap gap-2.5">
              {edicion.datos.map((d) => (
                <li
                  key={d.rotulo}
                  className="border border-linea-oscura px-3.5 py-2.5"
                >
                  <span className="etiqueta block text-apagado-oscuro">
                    {d.rotulo}
                  </span>
                  <span className="cifra mt-1 block text-base text-hueso">
                    {d.valor}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      <article className="bg-hueso px-6 py-14 md:px-12">
        <div
          data-revelar
          className="prosa mx-auto max-w-[52rem]"
          dangerouslySetInnerHTML={{ __html: edicion.body_html ?? "" }}
        />

        <aside
          data-revelar
          className="mx-auto mt-12 max-w-[52rem] border border-linea bg-superficie px-6 py-5 text-sm leading-relaxed text-apagado"
        >
          {t.comoSeArma}
          {edicion.origen ? (
            <span className="mt-2 block">
              {t.origen}: {edicion.origen}
            </span>
          ) : null}
        </aside>

        <div className="mx-auto mt-10 max-w-[52rem]">
          <Link
            href={rutaRadar(lang)}
            className="etiqueta border border-texto px-5 py-3.5 no-underline transition-colors hover:bg-texto hover:text-hueso"
          >
            {t.todas}
          </Link>
        </div>
      </article>

      <Footer lang={lang} />
    </main>
  );
}
