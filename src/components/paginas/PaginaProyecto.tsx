import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PantallaGenesis from "@/components/mockups/PantallaGenesis";
import PantallaFacturas from "@/components/mockups/PantallaFacturas";
import { getProyecto } from "@/lib/proyectos";
import { type Lang, otroIdioma, ruta, rutaProyecto, textos } from "@/lib/i18n";

const PANTALLAS: Record<string, (p: { lang: Lang }) => React.ReactElement> = {
  genesis: PantallaGenesis,
  "carga-automatica-de-comprobantes": PantallaFacturas,
};

export default async function PaginaProyecto({
  slug,
  lang,
}: {
  slug: string;
  lang: Lang;
}) {
  const proyecto = await getProyecto(slug, lang);
  if (!proyecto) notFound();

  const t = textos(lang).caso;
  const Pantalla = PANTALLAS[slug];
  const esProduccion = proyecto.kind === "produccion";
  const repo = proyecto.links?.repo;

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav lang={lang} alternar={rutaProyecto(otroIdioma(lang), slug)} />
        <div className="flex flex-col gap-8 px-6 pb-14 pt-12 md:px-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-x-12">
          <div className="flex flex-col gap-5">
            <p data-revelar className="etiqueta text-oliva-luz">
              {esProduccion ? t.caso : t.estudio} ·{" "}
              {String(proyecto.position).padStart(2, "0")} —{" "}
              {esProduccion ? t.produccion : t.laboratorio}
            </p>
            <h1
              data-revelar
              className="titular max-w-[16ch] text-[clamp(2.2rem,6.5vw,4.75rem)]"
            >
              {proyecto.title}
            </h1>
            {proyecto.subtitle ? (
              <p data-revelar className="subtitular text-xl text-salvia">
                {proyecto.subtitle}
              </p>
            ) : null}
          </div>

          <div data-revelar className="flex max-w-[42ch] flex-col gap-5">
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
          <p className="etiqueta mb-5 text-apagado">{t.vista}</p>
          <Pantalla lang={lang} />
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-10 bg-hueso px-6 py-14 md:px-12 lg:grid-cols-3 lg:gap-14">
        <Bloque titulo={t.problema} texto={proyecto.problem} />
        <Bloque titulo={t.solucion} texto={proyecto.solution} />
        <Bloque titulo={t.resultado} texto={proyecto.outcome} />
      </section>

      <section className="flex flex-col gap-8 bg-hueso px-6 py-14 md:px-12">
        <div data-revelar className="flex flex-col gap-4">
          <p className="etiqueta text-apagado">{t.herramientas}</p>
          <ul className="flex list-none flex-wrap gap-2">
            {proyecto.tech.map((x) => (
              <li
                key={x}
                className="etiqueta border border-linea px-2.5 py-1.5 text-apagado"
              >
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-linea pt-8">
          <Link
            href={ruta(lang, "/")}
            className="etiqueta border border-texto px-5 py-3.5 no-underline transition-colors hover:bg-texto hover:text-hueso"
          >
            {t.volver}
          </Link>
          {repo ? (
            <a
              href={repo}
              target="_blank"
              rel="noreferrer"
              className="etiqueta border border-linea px-5 py-3.5 text-apagado no-underline transition-colors hover:border-texto hover:text-texto"
            >
              {t.repo}
            </a>
          ) : null}
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}

function Bloque({ titulo, texto }: { titulo: string; texto: string | null }) {
  if (!texto) return null;
  return (
    <div data-revelar className="flex flex-col gap-4">
      <h2 className="etiqueta border-b border-linea pb-3 text-apagado">
        {titulo}
      </h2>
      <p className="leading-relaxed">{texto}</p>
    </div>
  );
}
