import Carril from "./carrusel/Carril";
import TarjetaProyecto from "./carrusel/TarjetaProyecto";
import { graficoLab } from "./carrusel/GraficoLab";
import { getProyectos } from "@/lib/proyectos";
import { type Lang, textos } from "@/lib/i18n";

export default async function Laboratorio({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang);
  const estudios = await getProyectos("laboratorio", lang);
  if (estudios.length === 0) return null;

  return (
    <section id="laboratorio" className="bg-tinta pb-16 pt-16 text-hueso md:pb-20 md:pt-20">
      <div className="px-6 md:px-12">
        <header
          data-revelar
          className="flex flex-col items-start gap-6 border-b-2 border-hueso pb-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-x-12"
        >
          <div className="flex flex-col gap-4">
            <p className="rotulo text-apagado-oscuro">{t.laboratorio.eyebrow}</p>
            <h2>
              <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.laboratorio.titulo1}
              </span>
              <span className="titular contorno-claro block text-[clamp(2.2rem,6vw,4.75rem)]">
                {t.laboratorio.titulo2}
              </span>
            </h2>
          </div>
          {/* Igual que en Producción: cuerpo de lectura y columna propia. */}
          <p className="max-w-[46ch] text-[1.02rem] leading-relaxed text-salvia lg:mb-2">
            {t.laboratorio.bajada}
          </p>
        </header>
      </div>

      <div data-revelar>
        <Carril
          tono="oscuro"
          etiqueta={t.nav.laboratorio}
          anterior={t.laboratorio.anterior}
          siguiente={t.laboratorio.siguiente}
        >
          {estudios.map((e, i) => (
            <TarjetaProyecto
              key={e.id}
              proyecto={e}
              indice={i + 1}
              lang={lang}
              tono="oscuro"
              viva={graficoLab(e.slug, lang)}
            />
          ))}
        </Carril>
      </div>
    </section>
  );
}
