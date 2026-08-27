import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PantallaGenesis from "@/components/mockups/PantallaGenesis";
import PantallaFacturas from "@/components/mockups/PantallaFacturas";
import { getProyecto, getSlugs } from "@/lib/proyectos";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);
  if (!proyecto) return { title: "Proyecto no encontrado" };

  return {
    title: proyecto.title,
    description: proyecto.summary,
    alternates: { canonical: `/proyectos/${slug}` },
  };
}

const PANTALLAS: Record<string, () => React.ReactElement> = {
  genesis: PantallaGenesis,
  "carga-automatica-de-comprobantes": PantallaFacturas,
};

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);
  if (!proyecto) notFound();

  const Pantalla = PANTALLAS[slug];
  const esProduccion = proyecto.kind === "produccion";
  const repo = proyecto.links?.repo;

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav />
        <div className="flex flex-col gap-8 px-6 pb-14 pt-12 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="etiqueta text-oliva-luz">
              {esProduccion ? "Caso" : "Estudio"} ·{" "}
              {String(proyecto.position).padStart(2, "0")} —{" "}
              {esProduccion ? "Producción" : "Laboratorio"}
            </p>
            <h1 className="titular max-w-[16ch] text-[clamp(2.2rem,6.5vw,4.75rem)]">
              {proyecto.title}
            </h1>
            {proyecto.subtitle ? (
              <p className="subtitular text-xl text-salvia">
                {proyecto.subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex max-w-[42ch] flex-col gap-5">
            <p className="leading-relaxed text-salvia">{proyecto.summary}</p>
            {proyecto.impact_value ? (
              <p className="flex items-baseline gap-3 border-t border-linea-oscura pt-4">
                <span className="cifra text-3xl text-hueso">
                  {proyecto.impact_value}
                </span>
                <span className="etiqueta text-apagado-oscuro">
                  {proyecto.impact_label}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {Pantalla ? (
        <section className="bg-hueso px-6 py-14 md:px-12">
          <p className="etiqueta mb-5 text-apagado">
            Vista del sistema · datos de demostración
          </p>
          <Pantalla />
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-10 bg-superficie px-6 py-14 md:px-12 lg:grid-cols-3 lg:gap-14">
        <Bloque titulo="El problema" texto={proyecto.problem} />
        <Bloque titulo="Qué construí" texto={proyecto.solution} />
        <Bloque titulo="Qué cambió" texto={proyecto.outcome} />
      </section>

      <section className="flex flex-col gap-8 bg-hueso px-6 py-14 md:px-12">
        <div className="flex flex-col gap-4">
          <p className="etiqueta text-apagado">Herramientas</p>
          <ul className="flex list-none flex-wrap gap-2">
            {proyecto.tech.map((t) => (
              <li
                key={t}
                className="etiqueta border border-linea px-2.5 py-1.5 text-apagado"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-linea pt-8">
          <Link
            href="/"
            className="etiqueta border border-texto px-5 py-3.5 no-underline transition-colors hover:bg-texto hover:text-hueso"
          >
            ← Volver al portfolio
          </Link>
          {repo ? (
            <a
              href={repo}
              target="_blank"
              rel="noreferrer"
              className="etiqueta border border-linea px-5 py-3.5 text-apagado no-underline transition-colors hover:border-texto hover:text-texto"
            >
              Ver el repositorio
            </a>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Bloque({ titulo, texto }: { titulo: string; texto: string | null }) {
  if (!texto) return null;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="etiqueta border-b border-linea pb-3 text-apagado">
        {titulo}
      </h2>
      <p className="leading-relaxed">{texto}</p>
    </div>
  );
}
