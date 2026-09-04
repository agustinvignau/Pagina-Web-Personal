import Nav from "./Nav";
import MiniGenesis from "./mockups/MiniGenesis";
import MiniFacturas from "./mockups/MiniFacturas";
import ParallaxMouse from "./motion/ParallaxMouse";
import { type Lang, ruta, textos } from "@/lib/i18n";
import EnlaceMedido from "./EnlaceMedido";

export default function Hero({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang);

  return (
    <section className="flex min-h-svh flex-col overflow-hidden bg-tinta text-hueso">
      <Nav lang={lang} />

      <div className="grid grow items-start gap-y-10 px-6 pt-10 pb-4 md:px-12 lg:grid-cols-[minmax(0,29rem)_minmax(0,1fr)] lg:gap-x-12 lg:pt-12">
        <h1 data-revelar className="order-1 lg:order-3 lg:col-span-2 lg:mt-4">
          <span className="titular block text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.96]">
            {t.hero.linea1}
          </span>
          <span className="titular contorno-claro block text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.96]">
            {t.hero.linea2}
          </span>
          <span className="titular block text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.96] text-oliva-luz">
            {t.hero.linea3}
          </span>
        </h1>

        <div data-revelar className="order-2 flex flex-col gap-5 lg:order-1 lg:pt-8">
          <p className="etiqueta text-oliva-luz">{t.hero.rol}</p>
          <p className="max-w-[46ch] text-base leading-relaxed text-salvia md:text-[1.05rem]">
            {t.hero.bajada}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={ruta(lang, "/#produccion")}
              className="etiqueta border border-oliva-luz px-4 py-3 text-oliva-luz no-underline transition-colors hover:bg-oliva-luz hover:text-tinta"
            >
              {t.hero.verProduccion}
            </a>
            <EnlaceMedido
              href="/CV-Agustin-Vignau.pdf"
              tipo="cv"
              detalle="hero"
              className="etiqueta border border-linea-oscura px-4 py-3 text-apagado-oscuro no-underline transition-colors hover:border-hueso hover:text-hueso"
            >
              {t.hero.descargarCV}
            </EnlaceMedido>
          </div>
        </div>

        <div data-revelar className="order-3 lg:order-2 lg:pt-4">
          <ParallaxMouse className="relative [perspective:1600px] lg:h-[21rem]">
            <MiniFacturas lang={lang} className="hidden lg:absolute lg:left-0 lg:top-2 lg:block lg:w-[19rem] lg:[transform:rotateY(19deg)_rotateX(7deg)_rotateZ(-2deg)]" />
            <MiniGenesis lang={lang} className="lg:absolute lg:left-[14rem] lg:top-16 lg:w-[30rem] lg:[transform:rotateY(17deg)_rotateX(6deg)_rotateZ(-1.5deg)] xl:left-[18rem]" />
          </ParallaxMouse>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 border-t border-linea-oscura px-6 py-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8 md:px-12">
        <span className="etiqueta text-apagado-oscuro">{t.hero.scroll}</span>
        <ul className="flex list-none flex-wrap gap-x-7 gap-y-1">
          {t.hero.pie.map((x) => (
            <li key={x} className="etiqueta text-apagado-oscuro">
              {x}
            </li>
          ))}
        </ul>
        <span className="etiqueta text-apagado-oscuro">2026</span>
      </div>
    </section>
  );
}
