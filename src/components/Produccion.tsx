import ProyectoFila from "./ProyectoFila";
import { getProyectos } from "@/lib/proyectos";
import { type Lang, textos } from "@/lib/i18n";

export default async function Produccion({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang);
  const proyectos = await getProyectos("produccion", lang);

  return (
    <section id="produccion" className="relative overflow-hidden bg-hueso">
      <div className="relative px-6 pt-16 md:px-12 md:pt-20">
        <header
          data-revelar
          className="flex flex-col items-start justify-between gap-6 border-b-2 border-texto pb-7 lg:flex-row lg:items-end"
        >
          <div className="flex flex-col gap-4">
            <p className="etiqueta text-apagado">{t.produccion.eyebrow}</p>
            <h2>
              <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.produccion.titulo1}
              </span>
              <span className="titular contorno-oscuro block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.produccion.titulo2}
              </span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-apagado lg:mb-2">
            {t.produccion.bajada}
          </p>
        </header>

        {proyectos.length > 0 ? (
          <div className="pb-16">
            {proyectos.map((p, i) => (
              <ProyectoFila key={p.id} proyecto={p} indice={i + 1} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="etiqueta py-16 text-apagado">{t.produccion.sinDatos}</p>
        )}
      </div>
    </section>
  );
}
