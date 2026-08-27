import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getEdiciones, periodoLegible } from "@/lib/radar";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Radar",
  alternates: { canonical: "/radar" },
  description:
    "Qué se movió en IA, agentes, datos e infraestructura, leído cada quince días.",
};

export default async function RadarPage() {
  const ediciones = await getEdiciones();

  return (
    <main>
      <header className="bg-tinta text-hueso">
        <Nav />
        <div className="flex flex-col gap-8 px-6 pb-14 pt-12 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-5">
            <p data-revelar className="etiqueta text-oliva-luz">
              Radar tecnológico
            </p>
            <h1 data-revelar>
              <span className="titular block text-[clamp(2.2rem,6.5vw,4.75rem)]">
                Qué se movió
              </span>
              <span className="titular contorno-claro block text-[clamp(2.2rem,6.5vw,4.75rem)]">
                estas dos semanas
              </span>
            </h1>
          </div>
          <p
            data-revelar
            className="max-w-[44ch] leading-relaxed text-salvia lg:mb-2"
          >
            Sigo los lanzamientos y cambios de IA, agentes, machine learning e
            infraestructura. Cada quince días un agente consolida lo que se
            acumuló, yo lo leo, agrego qué me parece que importa y recién ahí se
            publica.
          </p>
        </div>
      </header>

      <section className="bg-hueso px-6 py-14 md:px-12">
        {ediciones.length === 0 ? (
          <p className="etiqueta py-10 text-apagado">
            La primera edición está en revisión.
          </p>
        ) : (
          <ul className="list-none">
            {ediciones.map((e) => (
              <li
                key={e.id}
                data-revelar
                className="group grid grid-cols-1 items-start gap-x-8 gap-y-3 border-b border-linea py-7 transition-colors hover:bg-superficie lg:grid-cols-[13rem_minmax(0,1fr)]"
              >
                <span className="etiqueta text-apagado lg:pt-2">
                  {periodoLegible(e.period_start, e.period_end)}
                </span>
                <div className="flex flex-col gap-3">
                  <h2 className="subtitular text-2xl md:text-[1.6rem]">
                    <Link
                      href={`/radar/${e.slug}`}
                      data-cursor="Leer"
                      className="text-texto no-underline transition-colors group-hover:text-oliva-texto"
                    >
                      {e.title}
                    </Link>
                  </h2>
                  {e.summary ? (
                    <p className="max-w-[70ch] text-sm leading-relaxed text-apagado">
                      {e.summary}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </main>
  );
}
