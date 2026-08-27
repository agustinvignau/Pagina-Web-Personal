"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Revela los bloques marcados con data-revelar cuando entran en pantalla.
 *
 * Tres cosas que este componente tiene que resolver sí o sí, porque si falla
 * alguna la página queda en blanco:
 *
 * 1. Vive en el layout, así que NO se vuelve a montar al cambiar de ruta.
 *    Por eso el efecto depende de la ruta y vuelve a observar los bloques
 *    nuevos cada vez.
 * 2. El contenido puede aparecer después (navegación del router, contenido
 *    diferido). Un MutationObserver engancha lo que llegue tarde.
 * 3. Al volver atrás el navegador puede restaurar la página desde su caché
 *    sin ejecutar nada: el evento pageshow vuelve a barrer todo.
 *
 * Y como red de seguridad final, si algo de esto no corre, a los 2 segundos
 * se muestra todo igual. Preferimos perder la animación antes que el texto.
 */
export default function RevelarScroll() {
  const ruta = usePathname();

  useEffect(() => {
    const raiz = document.documentElement;
    if (!raiz.classList.contains("con-reveal")) return;

    const mostrarTodo = () => {
      document
        .querySelectorAll("[data-revelar]")
        .forEach((b) => b.classList.add("visible"));
    };

    // Solo lo que ya está en pantalla o quedó arriba: lo de más abajo sigue
    // esperando su turno, que es justamente la animación que queremos.
    const mostrarLoVisible = () => {
      document.querySelectorAll("[data-revelar]").forEach((b) => {
        if (b.getBoundingClientRect().top < window.innerHeight) {
          b.classList.add("visible");
        }
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      mostrarTodo();
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    /*
      Acá estuvo el bug que dejaba la página en blanco al volver atrás: antes
      marcábamos cada bloque como "ya observado" con un atributo. Cuando el
      efecto se rehacía al cambiar de ruta, el observador anterior se destruía
      pero la marca quedaba puesta, así que el observador nuevo los salteaba y
      nadie los miraba nunca más. Ahora no guardamos ninguna marca: observar de
      nuevo el mismo elemento con el mismo observador no cuesta nada.
    */
    const observarPendientes = () => {
      const bloques = document.querySelectorAll<HTMLElement>(
        "[data-revelar]:not(.visible)",
      );
      bloques.forEach((b, i) => {
        if (!b.style.getPropertyValue("--retraso")) {
          b.style.setProperty("--retraso", `${Math.min(i % 6, 5) * 70}ms`);
        }
        observador.observe(b);
      });
    };

    observarPendientes();

    // Contenido que llega después del primer render
    const mutaciones = new MutationObserver(() => observarPendientes());
    mutaciones.observe(document.body, { childList: true, subtree: true });

    // Vuelta atrás desde la caché del navegador
    const alVolver = (e: PageTransitionEvent) => {
      if (e.persisted) {
        mostrarLoVisible();
        // La posición del scroll se restaura un instante después
        window.setTimeout(mostrarLoVisible, 300);
      }
      observarPendientes();
    };
    window.addEventListener("pageshow", alVolver);

    // Red de seguridad: si en dos segundos algo que está en pantalla sigue
    // escondido, lo mostramos. Perder la animación es mejor que perder el texto.
    const seguro = window.setTimeout(mostrarLoVisible, 2000);

    return () => {
      observador.disconnect();
      mutaciones.disconnect();
      window.removeEventListener("pageshow", alVolver);
      window.clearTimeout(seguro);
    };
  }, [ruta]);

  return null;
}
