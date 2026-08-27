import Nav from "./Nav";
import MiniGenesis from "./mockups/MiniGenesis";
import MiniFacturas from "./mockups/MiniFacturas";

const PIE = [
  "4 sistemas en producción",
  "5 estudios",
  "896 SKUs bajo gestión",
];

export default function Hero() {
  return (
    <section className="flex min-h-svh flex-col overflow-hidden bg-tinta text-hueso">
      <Nav />

      <div className="grid grow items-start gap-y-10 px-6 pt-10 pb-4 md:px-12 lg:grid-cols-[minmax(0,29rem)_minmax(0,1fr)] lg:gap-x-12 lg:pt-12">
        {/* Titular: primero en celular, debajo en escritorio */}
        <h1 className="order-1 lg:order-3 lg:col-span-2 lg:mt-4">
          <span className="titular block text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.96]">
            Analizo,
          </span>
          <span className="titular contorno-claro block text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.96]">
            Diseño
          </span>
          <span className="titular block text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.96] text-oliva-luz">
            Y resuelvo.
          </span>
        </h1>

        {/* Bajada */}
        <div className="order-2 flex flex-col gap-5 lg:order-1 lg:pt-8">
          <p className="etiqueta text-oliva-luz">
            Técnico Superior en Ciencia de Datos e IA
          </p>
          <p className="max-w-[46ch] text-base leading-relaxed text-salvia md:text-[1.05rem]">
            Diseño sistemas que sacan a las PyMEs de la planilla: inventario,
            carga automática de comprobantes y reportes sobre los que se decide.
            Entiendo el problema, armo el proyecto y lo dejo funcionando.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#produccion"
              className="etiqueta border border-oliva-luz px-4 py-3 text-oliva-luz no-underline transition-colors hover:bg-oliva-luz hover:text-tinta"
            >
              Ver producción
            </a>
            <a
              href="/CV-Agustin-Vignau.pdf"
              className="etiqueta border border-linea-oscura px-4 py-3 text-apagado-oscuro no-underline transition-colors hover:border-hueso hover:text-hueso"
            >
              Descargar CV
            </a>
          </div>
        </div>

        {/* Mockups */}
        <div className="order-3 lg:order-2 lg:pt-4">
          <div className="relative [perspective:1600px] lg:h-[21rem]">
            <MiniFacturas className="hidden lg:absolute lg:left-0 lg:top-2 lg:block lg:w-[19rem] lg:[transform:rotateY(19deg)_rotateX(7deg)_rotateZ(-2deg)]" />
            <MiniGenesis className="lg:absolute lg:left-[14rem] lg:top-16 lg:w-[30rem] lg:[transform:rotateY(17deg)_rotateX(6deg)_rotateZ(-1.5deg)] xl:left-[18rem]" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-linea-oscura px-6 py-4 md:px-12">
        <span className="etiqueta text-apagado-oscuro">Scroll</span>
        <ul className="flex list-none flex-wrap gap-x-7 gap-y-1">
          {PIE.map((t) => (
            <li key={t} className="etiqueta text-apagado-oscuro">
              {t}
            </li>
          ))}
        </ul>
        <span className="etiqueta text-apagado-oscuro">2026</span>
      </div>
    </section>
  );
}
