import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getEdicion, getEdiciones, periodoLegible } from "@/lib/radar";

export const revalidate = 300;

export async function generateStaticParams() {
  const ediciones = await getEdiciones();
  return ediciones.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const edicion = await getEdicion(slug);
  if (!edicion) return { title: "Edición no encontrada" };

  return {
    title: edicion.title,
    description: edicion.summary ?? undefined,
    alternates: { canonical: `/radar/${slug}` },
  };
}

export default async function EdicionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edicion = await getEdicion(slug);
  if (!edicion) notFound();

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav />
        <div className="mx-auto flex max-w-[52rem] flex-col gap-6 px-6 pb-12 pt-12 md:px-12">
          <p data-revelar className="etiqueta text-oliva-luz">
            Radar tecnológico · edición
          </p>
          <h1
            data-revelar
            className="titular text-[clamp(2rem,5.5vw,3.75rem)]"
          >
            {edicion.title}
          </h1>
          <p data-revelar className="etiqueta text-apagado-oscuro">
            {periodoLegible(edicion.period_start, edicion.period_end)}
          </p>

          {edicion.datos.length > 0 ? (
            <ul
              data-revelar
              className="mt-2 flex list-none flex-wrap gap-2.5"
            >
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
          <b className="text-texto">Cómo se arma esto.</b> Un rastreo
          automático deja las novedades y sus enlaces oficiales en un documento.
          Cada quince días un agente lo consolida y redacta el borrador; yo lo
          leo, corrijo lo que haga falta y agrego la lectura propia antes de
          publicarlo. Ninguna edición sale sin pasar por mí.
          {edicion.origen ? (
            <span className="mt-2 block">Origen: {edicion.origen}</span>
          ) : null}
        </aside>

        <div className="mx-auto mt-10 max-w-[52rem]">
          <Link
            href="/radar"
            className="etiqueta border border-texto px-5 py-3.5 no-underline transition-colors hover:bg-texto hover:text-hueso"
          >
            ← Todas las ediciones
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
