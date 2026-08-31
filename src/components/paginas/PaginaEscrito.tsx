import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { fechaLegible, getEscrito, minutosDeLectura } from "@/lib/escritos";
import { type Lang, otroIdioma, rutaEscrito, textos } from "@/lib/i18n";

export default async function PaginaEscrito({
  slug,
  lang,
}: {
  slug: string;
  lang: Lang;
}) {
  const escrito = await getEscrito(slug, lang);
  if (!escrito) notFound();

  const t = textos(lang).escritos;

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav lang={lang} alternar={rutaEscrito(otroIdioma(lang), slug)} />
        <div className="mx-auto flex max-w-[52rem] flex-col gap-6 px-6 pb-12 pt-12 md:px-12">
          <p data-revelar className="etiqueta text-oliva-luz">
            {t.articulo}
          </p>
          <h1 data-revelar className="titular text-[clamp(2rem,5.5vw,3.75rem)]">
            {escrito.title}
          </h1>
          <p data-revelar className="etiqueta text-apagado-oscuro">
            {fechaLegible(escrito.published_at, lang)}
            <span aria-hidden> · </span>
            {minutosDeLectura(escrito.body_html)} {t.lectura}
          </p>

          {escrito.tags.length > 0 ? (
            <ul data-revelar className="flex list-none flex-wrap gap-2.5">
              {escrito.tags.map((tag) => (
                <li
                  key={tag}
                  className="etiqueta border border-linea-oscura px-3.5 py-2 text-apagado-oscuro"
                >
                  {tag}
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
          dangerouslySetInnerHTML={{ __html: escrito.body_html ?? "" }}
        />

        <div className="mx-auto mt-10 max-w-[52rem]">
          <Link
            href={rutaEscrito(lang)}
            className="etiqueta border border-texto px-5 py-3.5 no-underline transition-colors hover:bg-texto hover:text-hueso"
          >
            {t.todos}
          </Link>
        </div>
      </article>

      <Footer lang={lang} />
    </main>
  );
}
