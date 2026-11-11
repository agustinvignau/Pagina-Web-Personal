import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/lib/types";
import { type Lang, rutaProyecto, textos } from "@/lib/i18n";

/**
 * Una tarjeta del carrusel. La portada es la protagonista: casi nadie lee
 * las fichas, se mira y se decide. El texto se reduce a lo que ubica (título,
 * una línea, la cifra) y el detalle queda en la ficha.
 *
 * La portada sale, en este orden, de la imagen cargada desde el panel, de un
 * gráfico vivo (el Laboratorio) o de la portada de reserva con el título.
 */
export default function TarjetaProyecto({
  proyecto: p,
  indice,
  lang,
  tono,
  viva,
}: {
  proyecto: Project;
  indice: number;
  lang: Lang;
  tono: "claro" | "oscuro";
  viva?: ReactNode;
}) {
  const t = textos(lang);
  const claro = tono === "claro";
  // En el Laboratorio los cinco estudios tienen repo público: el rótulo no
  // distingue nada y tapaba el título del gráfico. Va solo en Producción.
  const repo = claro ? p.links?.repo : undefined;

  return (
    <li className="tarjeta" data-tono={tono}>
      <Link
        href={rutaProyecto(lang, p.slug)}
        data-cursor={lang === "en" ? "Open" : "Ver"}
        className="group flex flex-col gap-5 text-inherit no-underline"
      >
        <div className="portada" data-foco={p.cover_focus ?? "izquierda"}>
          {p.cover_url ? (
            <Image
              src={p.cover_url}
              alt={p.cover_alt ?? ""}
              fill
              draggable={false}
              sizes="(min-width: 1280px) 54vw, (min-width: 768px) 64vw, 90vw"
              className="portada-img"
            />
          ) : viva ? (
            <div className="absolute inset-0">{viva}</div>
          ) : (
            <Reserva titulo={p.title} claro={claro} />
          )}

          <ul className="chips absolute left-2 top-2 z-10 flex list-none flex-wrap gap-1 md:left-3 md:top-3 md:gap-1.5">
            {p.featured ? (
              <li className="etiqueta-dato bg-oliva-luz px-2 py-1 text-tinta">{t.produccion.insignia}</li>
            ) : null}
            {p.status ? (
              <li className="etiqueta-dato flex items-center gap-2 bg-tinta px-2 py-1 text-hueso">
                <span aria-hidden className="size-1.5 rounded-full bg-oliva-luz" />
                {t.produccion.estados[p.status]}
              </li>
            ) : null}
            {repo ? (
              <li className="etiqueta-dato border border-tinta bg-hueso px-2 py-1 text-tinta">
                {t.produccion.repoPublico}
              </li>
            ) : null}
          </ul>
        </div>

        <div className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3.5 gap-y-1.5 sm:grid-cols-[2.4rem_minmax(0,1fr)_auto]">
          <span className={`cifra pt-1 text-[0.9rem] ${claro ? "text-oliva-texto" : "text-oliva-luz"}`}>
            {String(indice).padStart(2, "0")}
          </span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <h3 className="subtitular text-[clamp(1.3rem,2.2vw,1.7rem)]">
              {p.title}
              <span
                aria-hidden
                className="ml-2 inline-block -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                →
              </span>
            </h3>
            <p className={`line-clamp-2 text-[0.95rem] leading-relaxed ${claro ? "text-apagado" : "text-salvia"}`}>
              {p.summary}
            </p>
            {!claro && p.tech.length ? (
              <p className="etiqueta-dato mt-1 text-oliva-luz">{p.tech.join(" · ")}</p>
            ) : null}
          </div>
          {p.impact_value ? (
            <p className="col-start-2 flex items-baseline gap-2.5 sm:col-start-3 sm:flex-col sm:items-end sm:gap-0.5 sm:text-right">
              <span className="cifra text-[1.45rem]">{p.impact_value}</span>
              <span className={`etiqueta ${claro ? "text-apagado" : "text-apagado-oscuro"}`}>
                {p.impact_label}
              </span>
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

/** Mientras no haya imagen: el título en contorno sobre una trama, nunca un hueco. */
function Reserva({ titulo, claro }: { titulo: string; claro: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 flex items-end overflow-hidden p-5 ${claro ? "reserva-clara" : "reserva-oscura"}`}
    >
      <span
        className={`titular line-clamp-3 text-[clamp(1.4rem,3vw,2.4rem)] ${claro ? "contorno-oscuro" : "contorno-claro"}`}
      >
        {titulo}
      </span>
    </div>
  );
}
