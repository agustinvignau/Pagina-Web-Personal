"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";

/** Se llama desde cualquier lado para registrar algo que no es una visita. */
export function registrar(tipo: "cv" | "contacto" | "externo", detalle?: string) {
  const lang = document.documentElement.lang === "en" ? "en" : "es";
  const cuerpo = JSON.stringify({
    tipo,
    ruta: window.location.pathname,
    lang,
    detalle,
  });

  /*
    sendBeacon sobrevive a que la página se esté yendo, que es justo lo que
    pasa al hacer clic en el CV o en un enlace externo. Un fetch normal se
    cancela con la navegación y el evento se pierde.
  */
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/evento", new Blob([cuerpo], { type: "application/json" }));
  } else {
    fetch("/api/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: cuerpo,
      keepalive: true,
    }).catch(() => {});
  }
}

export default function Analitica({ lang }: { lang: Lang }) {
  const ruta = usePathname();
  const anterior = useRef<string | null>(null);

  useEffect(() => {
    // Con la cortina entre rutas el efecto puede correr dos veces por la
    // misma ruta; sin esta guarda cada navegación contaría doble.
    if (anterior.current === ruta) return;
    anterior.current = ruta;

    fetch("/api/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: "pagina",
        ruta,
        lang,
        referido: document.referrer,
      }),
    }).catch(() => {});
  }, [ruta, lang]);

  return null;
}
