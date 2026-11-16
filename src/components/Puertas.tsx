import { type Lang, ruta, textos } from "@/lib/i18n";

/*
  Las dos puertas del inicio. El sitio le habla a dos lectores distintos: el
  dueño de un negocio que necesita ordenar sus números, y un equipo que busca
  sumar a alguien de datos o de IA. Cada uno tiene que encontrar su camino en
  la primera pantalla después de la portada, sin leer todo lo demás.

  La de negocios lleva al formulario; la de equipos, al Laboratorio, que es
  donde está el método a la vista.
*/
export default function Puertas({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang).puertas;
  const puertas = [
    { ...t.negocios, href: ruta(lang, "/#contacto") },
    { ...t.equipos, href: ruta(lang, "/#laboratorio") },
  ];

  return (
    <section id="entrar" className="bg-hueso px-6 pb-16 pt-16 md:px-12 md:pb-20 md:pt-20">
      <div data-revelar className="flex flex-col gap-4">
        <p className="rotulo text-apagado">{t.eyebrow}</p>
        <h2>
          <span className="titular block text-[clamp(2.2rem,6vw,4.75rem)]">{t.titulo1}</span>{" "}
          <span className="titular contorno-oscuro block text-[clamp(2.2rem,6vw,4.75rem)]">{t.titulo2}</span>
        </h2>
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-2">
        {puertas.map((p) => (
          <a
            key={p.rotulo}
            href={p.href}
            data-revelar
            className="group flex min-w-0 flex-col gap-4 border border-linea bg-superficie p-6 text-texto no-underline transition-colors hover:border-oliva hover:bg-white md:p-8"
          >
            <p className="etiqueta text-oliva-texto">{p.rotulo}</p>
            <p className="subtitular text-[clamp(1.35rem,2.6vw,1.75rem)] text-tinta">{p.titulo}</p>
            <p className="max-w-[52ch] text-[1.02rem] leading-relaxed text-texto">{p.texto}</p>
            <ul className="flex list-none flex-wrap gap-2">
              {p.pasos.map((paso) => (
                <li key={paso} className="etiqueta-dato border border-linea px-2.5 py-1.5 text-apagado">
                  {paso}
                </li>
              ))}
            </ul>
            <p className="etiqueta mt-auto pt-2 text-oliva-texto">
              {p.ir} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
