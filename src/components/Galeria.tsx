"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Captura } from "@/lib/types";
import { type Lang, textos } from "@/lib/i18n";

/**
 * Las capturas de la ficha y su visor. La primera va grande, porque es la que
 * cuenta qué es el proyecto; las demás, debajo, de a tres en escritorio. Cada
 * una lleva su epígrafe: una captura sin explicar obliga a adivinar qué mirar.
 *
 * Al tocar una captura no se abre otra pestaña: sube un panel de tinta, con
 * la misma curva que el cambio de página del sitio, y la imagen se revela de
 * abajo hacia arriba con su número y su epígrafe al costado.
 */
export default function Galeria({ capturas, lang }: { capturas: Captura[]; lang: Lang }) {
  const t = textos(lang).visor;
  const [abierta, setAbierta] = useState<number | null>(null);
  const miniaturas = useRef<(HTMLButtonElement | null)[]>([]);

  if (capturas.length === 0) return null;
  const [principal, ...resto] = capturas;

  const miniatura = (c: Captura, i: number, sizes: string, tope = false) => (
    <figure
      key={c.src}
      data-revelar
      className="mx-auto flex w-full flex-col gap-3"
      // La principal no crece más que su ancho real: una captura angosta
      // estirada a todo el ancho de la pantalla se vuelve un afiche borroso.
      style={tope ? { maxWidth: c.ancho } : undefined}
    >
      <button
        ref={(el) => {
          miniaturas.current[i] = el;
        }}
        type="button"
        onClick={() => setAbierta(i)}
        aria-label={`${t.ampliar}: ${c.alt}`}
        aria-haspopup="dialog"
        data-cursor={t.ampliar}
        className="group relative block w-full cursor-zoom-in overflow-hidden border-[1.5px] border-tinta bg-superficie p-0"
      >
        <Image
          src={c.src}
          alt=""
          width={c.ancho}
          height={c.alto}
          sizes={sizes}
          priority={i === 0}
          className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.025]"
        />
        <span
          aria-hidden
          className="etiqueta absolute bottom-2.5 right-2.5 bg-tinta px-2 py-1 text-hueso transition-all duration-300 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100"
        >
          {t.ampliar} ↗
        </span>
      </button>
      {c.pie ? <figcaption className="text-sm leading-relaxed text-apagado">{c.pie}</figcaption> : null}
    </figure>
  );

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {miniatura(principal, 0, "(min-width: 768px) 90vw, 100vw", true)}
        {resto.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {resto.map((c, i) => miniatura(c, i + 1, "(min-width: 768px) 30vw, 100vw"))}
          </div>
        ) : null}
      </div>
      {abierta !== null ? (
        <Visor
          capturas={capturas}
          inicial={abierta}
          lang={lang}
          alCerrar={(ultima) => {
            setAbierta(null);
            miniaturas.current[ultima]?.focus({ preventScroll: true });
          }}
        />
      ) : null}
    </>
  );
}

const CORTINA = "cubic-bezier(0.76, 0, 0.24, 1)";
const SUAVE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

function Visor({
  capturas,
  inicial,
  lang,
  alCerrar,
}: {
  capturas: Captura[];
  inicial: number;
  lang: Lang;
  alCerrar: (ultima: number) => void;
}) {
  const t = textos(lang).visor;
  const [i, setI] = useState(inicial);
  const [montado, setMontado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const fondo = useRef<HTMLDivElement>(null);
  const contenido = useRef<HTMLDivElement>(null);
  const foto = useRef<HTMLImageElement>(null);
  const cerrarBoton = useRef<HTMLButtonElement>(null);
  const ocupado = useRef(true);
  const cerrando = useRef(false);
  const actual = useRef(inicial);
  const direccion = useRef(0);
  const reducido = useRef(false);
  // El padre pasa una función nueva en cada render; con un ref, el efecto que
  // abre el visor no se vuelve a correr por eso.
  const alCerrarRef = useRef(alCerrar);
  alCerrarRef.current = alCerrar;

  // Cada animación tiene un tiempo máximo. Si el navegador no está dibujando
  // (pestaña de fondo, ventana tapada, celular con poca batería), la
  // animación no avanza y el visor quedaría esperándola: pasado ese tiempo se
  // completa sola y el visor sigue respondiendo.
  const animar = useCallback(
    (el: Element | null, frames: Keyframe[], ms: number, curva = SUAVE, delay = 0): Promise<void> => {
      if (!el || reducido.current) return Promise.resolve();
      const a = el.animate(frames, { duration: ms, easing: curva, delay, fill: "both" });
      return new Promise((listo) => {
        const tope = window.setTimeout(() => {
          a.finish();
          listo();
        }, ms + delay + 150);
        a.finished
          .catch(() => undefined)
          .then(() => {
            window.clearTimeout(tope);
            listo();
          });
      });
    },
    [],
  );

  const revelarTextos = useCallback(() => {
    raiz.current?.querySelectorAll("[data-entra]").forEach((el, k) => {
      animar(el, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], 500, SUAVE, 260 + k * 80);
    });
  }, [animar]);

  // Cierre real: lo dispara el botón "atrás" del navegador (popstate). Los
  // controles del visor llaman a history.back(), así un solo camino cierra.
  const cerrarDeVerdad = useCallback(async () => {
    if (cerrando.current) return;
    cerrando.current = true;
    ocupado.current = true;
    await animar(contenido.current, [{ opacity: 1 }, { opacity: 0 }], 220);
    await animar(fondo.current, [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], 600, CORTINA);
    alCerrarRef.current(actual.current);
  }, [animar]);

  const cerrar = useCallback(() => {
    if (ocupado.current || cerrando.current) return;
    if (window.history.state?.visor) window.history.back();
    else cerrarDeVerdad();
  }, [cerrarDeVerdad]);

  const ir = useCallback(
    async (j: number) => {
      if (ocupado.current || j < 0 || j >= capturas.length || j === actual.current) return;
      ocupado.current = true;
      const dir = j > actual.current ? 1 : -1;
      direccion.current = dir;
      await Promise.all([
        animar(foto.current, [{ clipPath: "inset(0 0 0 0)" }, { clipPath: dir > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }], 420, CORTINA),
        ...Array.from(raiz.current?.querySelectorAll("[data-entra]") ?? []).map((el) =>
          animar(el, [{ opacity: 1 }, { opacity: 0 }], 200),
        ),
      ]);
      actual.current = j;
      setI(j);
    },
    [animar, capturas.length],
  );

  // Al montar: bloquear el scroll, sumar una entrada al historial y subir la cortina.
  useEffect(() => {
    reducido.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMontado(true);
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    window.history.pushState({ ...window.history.state, visor: true }, "");
    const atras = () => cerrarDeVerdad();
    window.addEventListener("popstate", atras);
    return () => {
      html.style.overflow = antes;
      window.removeEventListener("popstate", atras);
    };
  }, [cerrarDeVerdad]);

  useEffect(() => {
    if (!montado) return;
    (async () => {
      await animar(fondo.current, [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], 650, CORTINA);
      // El contenido aparece recién con la cortina arriba, no mientras sube.
      animar(contenido.current, [{ opacity: 0 }, { opacity: 1 }], 200);
      cerrarBoton.current?.focus({ preventScroll: true });
      revelarTextos();
      await animar(foto.current, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], 700, CORTINA);
      ocupado.current = false;
    })();
    // Solo al abrir; los cambios de captura los maneja el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [montado]);

  // Después de cambiar de captura: la nueva entra desde el lado contrario.
  useEffect(() => {
    if (!montado || direccion.current === 0) return;
    const dir = direccion.current;
    (async () => {
      revelarTextos();
      await animar(foto.current, [{ clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], 520, CORTINA);
      ocupado.current = false;
    })();
  }, [i, montado, animar, revelarTextos]);

  // Teclado: Esc cierra, flechas recorren y Tab no se escapa del visor.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowRight") ir(actual.current + 1);
      else if (e.key === "ArrowLeft") ir(actual.current - 1);
      else if (e.key === "Tab") {
        const focos = Array.from(raiz.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? []).filter(
          (b) => b.offsetParent !== null,
        );
        if (focos.length === 0) return;
        e.preventDefault();
        const k = focos.indexOf(document.activeElement as HTMLElement);
        focos[(k + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [cerrar, ir]);

  // En el celular: deslizar de costado cambia de captura y hacia abajo cierra.
  const toque = useRef<{ x: number; y: number } | null>(null);

  if (!montado) return null;
  const c = capturas[i];
  const pad = (n: number) => String(n).padStart(2, "0");
  const flechas = (
    <div className="flex gap-2">
      {[
        { rotulo: t.anterior, flecha: "←", j: i - 1 },
        { rotulo: t.siguiente, flecha: "→", j: i + 1 },
      ].map((b) => (
        <button
          key={b.flecha}
          type="button"
          aria-label={b.rotulo}
          disabled={b.j < 0 || b.j >= capturas.length}
          onClick={() => ir(b.j)}
          className="cifra flex size-12 items-center justify-center border-[1.5px] border-current text-lg transition-colors enabled:hover:bg-hueso enabled:hover:text-tinta disabled:cursor-default disabled:opacity-30"
        >
          {b.flecha}
        </button>
      ))}
    </div>
  );

  return createPortal(
    <div
      ref={raiz}
      role="dialog"
      aria-modal="true"
      aria-label={t.etiqueta}
      className="fixed inset-0 z-[75] text-hueso"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") toque.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const a = toque.current;
        toque.current = null;
        if (!a) return;
        const dx = e.clientX - a.x;
        const dy = e.clientY - a.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) ir(actual.current + (dx < 0 ? 1 : -1));
        else if (dy > 90 && dy > Math.abs(dx)) cerrar();
      }}
    >
      <div ref={fondo} className="absolute inset-0 bg-tinta" style={{ transform: reducido.current ? "none" : "translateY(100%)" }} />
      <div
        ref={contenido}
        style={{ opacity: reducido.current ? 1 : 0 }}
        className="absolute inset-0 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-5 px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] md:px-12 lg:pb-8"
      >
        <div className="flex items-center gap-4">
          <span className="etiqueta text-oliva-luz">{t.etiqueta}</span>
          <span className="grow" />
          <button
            ref={cerrarBoton}
            type="button"
            aria-label={t.cerrar}
            onClick={cerrar}
            className="cifra flex size-12 items-center justify-center border-[1.5px] border-current text-xl transition-colors hover:bg-hueso hover:text-tinta"
          >
            ×
          </button>
        </div>

        <div className="grid min-h-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Tocar fuera de la imagen cierra; tocar la imagen no. */}
          <div
            className="flex min-h-0 items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) cerrar();
            }}
          >
            {/* La imagen grande se pide recién al abrir: la ficha no carga más de lo que ya cargaba. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={foto}
              key={c.src}
              src={c.src}
              alt={c.alt}
              width={c.ancho}
              height={c.alto}
              draggable={false}
              className="block max-h-full max-w-full select-none border border-linea-oscura object-contain"
              style={{ clipPath: reducido.current ? "none" : "inset(100% 0 0 0)" }}
            />
          </div>

          <div className="hidden min-w-0 flex-col justify-end gap-4 lg:flex">
            <p data-entra className="titular cifra contorno-claro text-[clamp(3.2rem,7vw,6.5rem)]">
              {pad(i + 1)}
              <span className="ml-3 text-[0.35em] tracking-normal text-apagado-oscuro [-webkit-text-stroke:0]">
                / {pad(capturas.length)}
              </span>
            </p>
            {c.pie ? (
              <p data-entra className="leading-relaxed text-salvia">
                {c.pie}
              </p>
            ) : null}
            <div data-entra>{flechas}</div>
          </div>
        </div>

        <div className="flex items-end gap-4 lg:hidden">
          <p className="min-w-0 grow text-[0.92rem] leading-relaxed text-salvia">
            <span className="cifra etiqueta block text-oliva-luz">
              {pad(i + 1)} / {pad(capturas.length)}
            </span>
            {c.pie}
          </p>
          {flechas}
        </div>
      </div>
    </div>,
    document.body,
  );
}
