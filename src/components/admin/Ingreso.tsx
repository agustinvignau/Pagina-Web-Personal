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

    /*
      shouldCreateUser en false es lo que cierra la puerta de verdad: si el
      mail no corresponde a un usuario que ya existe, Supabase no crea nada
      ni manda ningún enlace. Para sumar a alguien hay que invitarlo desde el
      panel de Supabase, a propósito.
    */
    const { error: fallo } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (fallo) {
      /*
        El mensaje neutro es para no revelar si una dirección existe. Pero el
        límite de envíos NO es un secreto, y esconderlo detrás de "ya está en
        camino" hace que uno espere un mail que nunca sale. Ese caso se dice
        con todas las letras.
      */
      const codigo = (fallo as { code?: string }).code ?? "";
      const limite =
        codigo === "over_email_send_rate_limit" ||
        fallo.status === 429 ||
        /rate limit/i.test(fallo.message);

      setError(
        limite
          ? "Se alcanzó el límite de mails por hora del servidor de Supabase. No se envió nada: esperá un rato y probá de nuevo."
          : "Si esa dirección tiene acceso, el enlace ya está en camino.",
      );
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
          Sólo las direcciones ya invitadas reciben enlace. Y aunque alguien
          consiguiera entrar, los permisos sobre los datos los decide la base,
          no esta pantalla.
        </p>
      </div>
    </main>
  );
}
