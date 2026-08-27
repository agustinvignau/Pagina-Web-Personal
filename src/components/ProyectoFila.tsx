import Link from "next/link";
import type { Project } from "@/lib/types";
import { type Lang, rutaProyecto, textos } from "@/lib/i18n";

export default function ProyectoFila({
  proyecto,
  indice,
  lang = "es",
}: {
  proyecto: Project;
  indice: number;
  lang?: Lang;
}) {
  const t = textos(lang);
  const destacado = proyecto.featured;

  return (
    <article
      data-revelar
      className={`group grid grid-cols-1 items-start gap-x-6 gap-y-4 border-b border-linea py-7 transition-colors lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,19rem)_7rem] ${
        destacado ? "bg-superficie px-4 lg:px-5" : "hover:bg-superficie"
      }`}
    >
      <div className="cifra text-[0.7rem] text-oliva-texto lg:pt-1.5">
        {String(indice).padStart(2, "0")}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="subtitular text-2xl md:text-[1.75rem]">
          <Link
            href={rutaProyecto(lang, proyecto.slug)}
            data-cursor={lang === "en" ? "Open" : "Ver"}
            className="text-texto no-underline transition-colors group-hover:text-oliva-texto"
          >
            {proyecto.title}
            {proyecto.subtitle ? (
              <span className="text-apagado"> — {proyecto.subtitle}</span>
            ) : null}
            <span
              aria-hidden
              className="ml-2 inline-block opacity-0 transition-opacity group-hover:opacity-100"
            >
              →
            </span>
          </Link>
        </h3>
        <ul className="flex list-none flex-wrap gap-1.5">
          {destacado ? (
            <li className="etiqueta border border-oliva px-2 py-1 text-oliva-texto">
              {t.produccion.insignia}
            </li>
          ) : null}
          {proyecto.tech.map((x) => (
            <li key={x} className="etiqueta border border-linea px-2 py-1 text-apagado">
              {x}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed text-apagado">{proyecto.summary}</p>

      {proyecto.impact_value ? (
        <div className="flex flex-col gap-1 lg:text-right">
          <span className="cifra text-2xl">{proyecto.impact_value}</span>
          <span className="etiqueta text-apagado">{proyecto.impact_label}</span>
        </div>
      ) : (
        <span aria-hidden />
      )}
    </article>
  );
}
