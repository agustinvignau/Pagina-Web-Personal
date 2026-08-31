import Link from "next/link";
import { type Lang, otroIdioma, ruta, rutaEscrito, rutaRadar, textos } from "@/lib/i18n";

export default function Nav({
  lang = "es",
  alternar,
}: {
  lang?: Lang;
  alternar?: string;
}) {
  const t = textos(lang);
  const otro = otroIdioma(lang);

  const secciones = [
    { href: ruta(lang, "/#produccion"), label: t.nav.produccion },
    { href: ruta(lang, "/#laboratorio"), label: t.nav.laboratorio },
    { href: ruta(lang, "/#perfil"), label: t.nav.perfil },
    { href: rutaRadar(lang), label: t.nav.radar },
    { href: rutaEscrito(lang), label: t.nav.escritos },
    { href: ruta(lang, "/#contacto"), label: t.nav.contacto },
  ];

  return (
    <>
      <nav className="flex items-center justify-between gap-6 px-6 pt-6 md:px-12 md:pt-7">
        <Link href={ruta(lang, "/")} className="etiqueta shrink-0 no-underline">
          <span className="block text-hueso">Agustín</span>
          <span className="block text-oliva-luz">Vignau</span>
        </Link>

        <ul className="hidden list-none items-center gap-7 lg:flex">
          {secciones.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                className="etiqueta text-apagado-oscuro no-underline transition-colors hover:text-hueso"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <span className="etiqueta hidden items-center gap-2 text-apagado-oscuro sm:flex">
            <span aria-hidden className="block size-[5px] bg-oliva-luz" />
            {t.ciudad}
          </span>
          <Link
            href={alternar ?? ruta(otro, "/")}
            hrefLang={otro}
            aria-label={otro === "en" ? "Read in English" : "Leer en español"}
            className="etiqueta border border-linea-oscura px-2 py-1 text-hueso no-underline transition-colors hover:border-oliva-luz hover:text-oliva-luz"
          >
            {otro.toUpperCase()}
          </Link>
        </div>
      </nav>

      <ul className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-1 border-y border-linea-oscura px-6 py-3 lg:hidden">
        {secciones.map((s) => (
          <li key={s.href}>
            <a href={s.href} className="etiqueta text-apagado-oscuro no-underline">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
