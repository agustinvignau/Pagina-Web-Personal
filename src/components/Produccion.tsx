import Carril from "./carrusel/Carril";
import TarjetaProyecto from "./carrusel/TarjetaProyecto";
import { getProyectos } from "@/lib/proyectos";
import { type Lang, textos } from "@/lib/i18n";

export default async function Produccion({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang);
  const proyectos = await getProyectos("produccion", lang);

  return (
    <section id="produccion" className="relative overflow-hidden bg-hueso pb-16 pt-16 md:pb-20 md:pt-20">
      <div className="px-6 md:px-12">
        <header
          data-revelar
          className="flex flex-col items-start gap-6 border-b-2 border-texto pb-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-x-12"
        >
          <div className="flex flex-col gap-4">
            <p className="rotulo text-apagado">{t.produccion.eyebrow}</p>
            <h2>
              <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.produccion.titulo1}
              </span>
              <span className="titular contorno-oscuro block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.produccion.titulo2}
              </span>
            </h2>
          </div>
          {/* Más cuerpo y en una columna propia, no empujada contra el borde
              de la pantalla: antes se leía como una nota al pie. */}
          <p className="max-w-[46ch] text-[1.02rem] leading-relaxed text-apagado lg:mb-2">
            {t.produccion.bajada}
          </p>
        </header>
      </div>

      {proyectos.length > 0 ? (
        <div data-revelar>
          <Carril
            tono="claro"
            etiqueta={t.nav.produccion}
            anterior={t.produccion.anterior}
            siguiente={t.produccion.siguiente}
          >
            {proyectos.map((p, i) => (
              <TarjetaProyecto key={p.id} proyecto={p} indice={i + 1} lang={lang} tono="claro" />
            ))}
          </Carril>
        </div>
      ) : (
        <p className="etiqueta px-6 py-16 text-apagado md:px-12">{t.produccion.sinDatos}</p>
      )}
    </section>
  );
}
