"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";
import Ingreso from "./Ingreso";
import SeccionRadar from "./SeccionRadar";
import SeccionProyectos from "./SeccionProyectos";
import SeccionMensajes from "./SeccionMensajes";

type Solapa = "radar" | "proyectos" | "mensajes";

const ADMIN = "agustinvignau729@gmail.com";

export default function Panel() {
  const [cargando, setCargando] = useState(true);
  const [sesion, setSesion] = useState<Session | null>(null);
  const [solapa, setSolapa] = useState<Solapa>("radar");

  useEffect(() => {
    const supabase = getSupabaseNavegador();
    if (!supabase) {
      setCargando(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setCargando(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSesion(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const salir = useCallback(async () => {
    await getSupabaseNavegador()?.auth.signOut();
  }, []);

  if (cargando) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-tinta">
        <p className="etiqueta text-apagado-oscuro">Cargando…</p>
      </main>
    );
  }

  if (!sesion) return <Ingreso />;

  /*
    Segunda barrera, y es sólo eso: una barrera de pantalla. Quien manda sobre
    los datos son las políticas de la base. Esto existe para que una sesión
    ajena no vea ni la forma del panel.
  */
  if (sesion.user.email !== ADMIN) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-tinta px-6 text-hueso">
        <div className="flex max-w-[26rem] flex-col gap-5">
          <h1 className="titular text-[clamp(1.8rem,6vw,2.6rem)]">Sin acceso</h1>
          <p className="leading-relaxed text-salvia">
            Esta cuenta no tiene permisos sobre el panel.
          </p>
          <button
            type="button"
            onClick={salir}
            className="etiqueta self-start border border-linea-oscura px-5 py-3.5 text-apagado-oscuro transition-colors hover:text-hueso"
          >
            Cerrar sesión
          </button>
        </div>
      </main>
    );
  }

  const solapas: { id: Solapa; label: string }[] = [
    { id: "radar", label: "Radar" },
    { id: "proyectos", label: "Proyectos" },
    { id: "mensajes", label: "Mensajes" },
  ];

  return (
    <main className="min-h-svh bg-hueso">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-tinta px-6 py-5 text-hueso md:px-10">
        <div className="etiqueta leading-relaxed">
          <span className="block">Panel</span>
          <span className="block text-oliva-luz">{sesion.user.email}</span>
        </div>
        <nav className="flex flex-wrap gap-2">
          {solapas.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSolapa(s.id)}
              className={`etiqueta border px-3.5 py-2.5 transition-colors ${
                solapa === s.id
                  ? "border-oliva-luz bg-oliva-luz text-tinta"
                  : "border-linea-oscura text-apagado-oscuro hover:text-hueso"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="flex gap-2">
          <a
            href="/"
            className="etiqueta border border-linea-oscura px-3.5 py-2.5 text-apagado-oscuro no-underline transition-colors hover:text-hueso"
          >
            Ver el sitio
          </a>
          <button
            type="button"
            onClick={salir}
            className="etiqueta border border-linea-oscura px-3.5 py-2.5 text-apagado-oscuro transition-colors hover:text-hueso"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="px-6 py-10 md:px-10">
        {solapa === "radar" ? <SeccionRadar /> : null}
        {solapa === "proyectos" ? <SeccionProyectos /> : null}
        {solapa === "mensajes" ? <SeccionMensajes /> : null}
      </div>
    </main>
  );
}
