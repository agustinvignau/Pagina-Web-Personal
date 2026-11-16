import { type Lang, textos } from "@/lib/i18n";

/*
  "Analizo, diseño y resuelvo" fue el titular del sitio hasta noviembre de
  2026. Dice cómo trabaja Agustín, no qué recibe el que lo contrata, así que
  la portada pasó a decir la oferta y la frase quedó acá, como nombre del
  método, con cada verbo explicado.
*/
export default function Metodo({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang).metodo;

  return (
    <section id="metodo" className="bg-tinta px-6 pb-16 pt-16 text-hueso md:px-12 md:pb-20 md:pt-20">
      <div data-revelar className="flex flex-col gap-4">
        <p className="rotulo text-oliva-luz">{t.eyebrow}</p>
        <h2>
          <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">{t.titulo1}</span>
          <span className="titular contorno-claro block text-[clamp(2.2rem,6vw,4.75rem)]">{t.titulo2}</span>
        </h2>
      </div>

      <ol className="mt-9 grid list-none border-t border-linea-oscura md:grid-cols-3">
        {t.pasos.map((paso, i) => (
          <li
            key={paso.titulo}
            data-revelar
            className={`flex min-w-0 flex-col gap-3 border-b border-linea-oscura py-7 md:border-b-0 md:py-8 md:pr-8 ${
              i > 0 ? "md:border-l md:border-linea-oscura md:pl-8" : ""
            }`}
          >
            <p className="etiqueta text-oliva-luz">{String(i + 1).padStart(2, "0")}</p>
            <p className="subtitular text-[1.7rem]">{paso.titulo}</p>
            <p className="max-w-[44ch] text-[0.98rem] leading-relaxed text-salvia">{paso.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
