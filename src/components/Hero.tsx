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

      <div className="grid grow items-start gap-y-10 px-6 pt-10 pb-4 md:px-12 lg:grid-cols-[minmax(0,29rem)_minmax(0,1fr)] lg:gap-x-12 lg:pt-12 xl:grid-cols-[max-content_minmax(0,1fr)] xl:content-start">
        {/*
          El titular va primero también en escritorio. Antes el orden era
          bajada → botones → titular: la tesis de la página llegaba después de
          los botones. En celular ya se leía bien; esto lo alinea.
        */}
        <h1 data-revelar className="order-1 lg:col-span-2 lg:mb-2 xl:col-span-1 xl:col-start-1 xl:row-start-1">
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

        <div data-revelar className="order-2 flex flex-col gap-5 xl:col-start-1 xl:row-start-2">
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

        <div
          data-revelar
          className="order-3 lg:pt-1 xl:col-start-2 xl:row-start-1 xl:row-span-2 xl:self-start xl:pt-0"
        >
          {/*
            Desde xl los mockups dejan de vivir debajo del titular y pasan a
            ocupar la columna derecha entera, de la primera fila a la segunda.
            El titular son tres líneas cortas, así que a partir de 1280px
            sobraba medio ancho de pantalla en negro a su derecha; ese hueco es
            el que llenan ahora.

            Que sean más grandes no es solo ensancharlos: las medidas de
            adentro (barras, KPIs, cuerpo de letra) están en em, y acá se fija
            el cuerpo de letra en cqw — un porcentaje del ancho de esta caja.
            Así la maqueta se agranda entera y en proporción. Si se les diera
            solo más ancho se aplastarían: el alto es el que llena el hueco.

            Debajo de xl no cambia nada: ahí el titular ocupa el ancho completo
            y los mockups van abajo, al tamaño de diseño.
          */}
          <ParallaxMouse className="relative [perspective:1600px] lg:h-[21rem] xl:aspect-[16/10] xl:h-auto xl:[container-type:inline-size]">
            <MiniFacturas lang={lang} className="hidden lg:absolute lg:left-0 lg:top-2 lg:block lg:w-[19rem] lg:[transform:rotateY(19deg)_rotateX(7deg)_rotateZ(-2deg)] xl:top-0 xl:w-[60%] xl:text-[3.16cqw]" />
            <MiniGenesis lang={lang} className="lg:absolute lg:left-[14rem] lg:top-16 lg:w-[30rem] lg:[transform:rotateY(17deg)_rotateX(6deg)_rotateZ(-1.5deg)] xl:left-auto xl:right-0 xl:top-[31%] xl:w-[90%] xl:text-[3cqw]" />
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
