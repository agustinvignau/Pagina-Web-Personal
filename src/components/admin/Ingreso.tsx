"use client";

import { useState } from "react";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";

type Estado = "quieto" | "enviando" | "enviado" | "error";

export default function Ingreso() {
  const [estado, setEstado] = useState<Estado>("quieto");
  const [error, setError] = useState("");

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = getSupabaseNavegador();
    if (!supabase) {
      setError("Faltan las variables de entorno de Supabase.");
      setEstado("error");
      return;
    }

    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    setEstado("enviando");
    setError("");

    const { error: fallo } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });

    if (fallo) {
      setError(fallo.message);
      setEstado("error");
      return;
    }
    setEstado("enviado");
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-tinta px-6 text-hueso">
      <div className="flex w-full max-w-[26rem] flex-col gap-7">
        <div className="etiqueta leading-relaxed">
          <span className="block text-hueso">Agustín</span>
          <span className="block text-oliva-luz">Vignau</span>
        </div>

        <h1 className="titular text-[clamp(2rem,7vw,3rem)]">Panel</h1>

        {estado === "enviado" ? (
          <p className="leading-relaxed text-salvia">
            Te mandé un enlace. Abrilo desde este mismo dispositivo y entrás
            directo — no hay contraseña que recordar. El enlace vence en una
            hora.
          </p>
        ) : (
          <form onSubmit={entrar} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="etiqueta text-apagado-oscuro">Tu mail</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="border border-linea-oscura bg-transparent px-3.5 py-3 text-[0.95rem] text-hueso outline-none focus:border-oliva-luz"
              />
            </label>
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="etiqueta self-start border border-oliva-luz px-5 py-3.5 text-oliva-luz transition-colors hover:bg-oliva-luz hover:text-tinta disabled:opacity-50"
            >
              {estado === "enviando" ? "Enviando…" : "Enviarme el enlace"}
            </button>
            {estado === "error" ? (
              <p className="text-sm text-salvia">{error}</p>
            ) : null}
          </form>
        )}

        <p className="text-sm leading-relaxed text-apagado-oscuro">
          Cualquiera puede pedir un enlace, pero sólo tu dirección tiene
          permisos sobre los datos. Eso lo decide la base, no esta pantalla.
        </p>
      </div>
    </main>
  );
}
