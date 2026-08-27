"use client";

import { useState } from "react";

type Estado = "quieto" | "enviando" | "enviado" | "error";

export default function Contacto() {
  const [estado, setEstado] = useState<Estado>("quieto");
  const [mensajeError, setMensajeError] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());

    setEstado("enviando");
    setMensajeError("");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const cuerpo = await res.json();

      if (!res.ok) {
        setMensajeError(cuerpo.error ?? "No se pudo enviar el mensaje.");
        setEstado("error");
        return;
      }
      form.reset();
      setEstado("enviado");
    } catch {
      setMensajeError("No hubo respuesta del servidor. Probá de nuevo.");
      setEstado("error");
    }
  }

  return (
    <section id="contacto" className="bg-superficie">
      <div className="grid grid-cols-1 gap-12 px-6 py-16 md:px-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-20">
        <div data-revelar className="flex flex-col gap-6">
          <p className="etiqueta text-apagado">04 — Contacto</p>
          <h2>
            <span className="titular block text-[clamp(2.2rem,6vw,4.5rem)]">
              Contame
            </span>
            <span className="titular contorno-oscuro block text-[clamp(2.2rem,6vw,4.5rem)]">
              el problema
            </span>
          </h2>
          <p className="max-w-[42ch] leading-relaxed text-apagado">
            Si algo en tu operación se resuelve con planillas y paciencia,
            probablemente se pueda resolver mejor. Escribime qué está pasando y
            te digo con qué lo atacaría.
          </p>
          <div className="flex flex-col gap-2 border-t border-linea pt-5">
            <a
              href="mailto:agustinvignau729@gmail.com"
              className="etiqueta no-underline"
            >
              agustinvignau729@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/agustinvignau/"
              target="_blank"
              rel="noreferrer"
              className="etiqueta no-underline"
            >
              linkedin.com/in/agustinvignau
            </a>
            <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-apagado">
              Si lo que buscás es una consultoría con equipo detrás, lo trabajo
              desde{" "}
              <a href="https://renovatio.ar" target="_blank" rel="noreferrer">
                Renovatio
              </a>
              .
            </p>
          </div>
        </div>

        <form data-revelar onSubmit={enviar} className="flex flex-col gap-5">
          <Campo etiqueta="Nombre" nombre="name" requerido />
          <Campo etiqueta="Mail" nombre="email" tipo="email" requerido />
          <Campo etiqueta="Empresa" nombre="company" />

          <label className="flex flex-col gap-2">
            <span className="etiqueta text-apagado">Qué necesitás</span>
            <textarea
              name="message"
              required
              rows={5}
              className="resize-y border border-linea bg-hueso px-3.5 py-3 text-[0.95rem] text-texto outline-none focus:border-oliva"
            />
          </label>

          {/* Trampa para bots: invisible para personas */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <button
            type="submit"
            disabled={estado === "enviando"}
            className="etiqueta self-start border border-texto px-6 py-4 transition-colors hover:bg-texto hover:text-hueso disabled:cursor-not-allowed disabled:opacity-50"
          >
            {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
          </button>

          <p aria-live="polite" className="min-h-6 text-sm">
            {estado === "enviado" ? (
              <span className="text-oliva-texto">
                Recibido. Te respondo dentro de las próximas 48 horas.
              </span>
            ) : null}
            {estado === "error" ? (
              <span className="text-apagado">{mensajeError}</span>
            ) : null}
          </p>
        </form>
      </div>
    </section>
  );
}

function Campo({
  etiqueta,
  nombre,
  tipo = "text",
  requerido = false,
}: {
  etiqueta: string;
  nombre: string;
  tipo?: string;
  requerido?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="etiqueta text-apagado">{etiqueta}</span>
      <input
        type={tipo}
        name={nombre}
        required={requerido}
        className="border border-linea bg-hueso px-3.5 py-3 text-[0.95rem] text-texto outline-none focus:border-oliva"
      />
    </label>
  );
}
