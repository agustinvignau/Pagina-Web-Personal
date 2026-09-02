"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseNavegador } from "@/lib/supabase-navegador";
import { Boton, Estado, Titulo, Vacio } from "./piezas";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  handled: boolean;
  created_at: string;
  flagged: boolean;
  flag_reason: string | null;
};

export default function SeccionMensajes() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const traer = useCallback(async () => {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setAviso(`No pude leer los mensajes: ${error.message}`);
    setLeads((data ?? []) as Lead[]);
    setCargando(false);
  }, []);

  useEffect(() => {
    traer();
  }, [traer]);

  async function marcar(l: Lead) {
    const supabase = getSupabaseNavegador();
    if (!supabase) return;
    setOcupado(l.id);
    const { error } = await supabase
      .from("leads")
      .update({ handled: !l.handled })
      .eq("id", l.id);
    setOcupado(null);
    if (error) {
      setAviso(`No se pudo guardar: ${error.message}`);
      return;
    }
    traer();
  }

  if (cargando) return <Vacio>Cargando mensajes…</Vacio>;

  const pendientes = leads.filter((l) => !l.handled).length;
  const sospechosos = leads.filter((l) => l.flagged && !l.handled).length;

  return (
    <section>
      <Titulo
        nota={
          pendientes > 0
            ? `${pendientes} sin responder${sospechosos > 0 ? `, ${sospechosos} marcado${sospechosos > 1 ? "s" : ""} como sospechoso${sospechosos > 1 ? "s" : ""}` : ""}.`
            : "Todo respondido. Esta es la única forma de leerlos: la clave pública del sitio no puede."
        }
      >
        Mensajes
      </Titulo>
      <Estado texto={aviso} />

      {leads.length === 0 ? (
        <Vacio>Todavía no llegó ningún mensaje.</Vacio>
      ) : (
        <ul className="list-none">
          {leads.map((l) => (
            <li
              key={l.id}
              className={`border-b border-linea py-5 ${l.handled ? "opacity-55" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="etiqueta text-apagado">
                    {new Date(l.created_at).toLocaleString("es-AR")}
                  </span>
                  <span className="subtitular text-lg">
                    {l.name}
                    {l.company ? ` · ${l.company}` : ""}
                  </span>
                  {l.flagged ? (
                    <span
                      title="No se le mandó acuse de recibo."
                      className="etiqueta self-start border border-linea px-2 py-1 text-oliva-texto"
                    >
                      Sospechoso · {l.flag_reason ?? "sin motivo"}
                    </span>
                  ) : null}
                  <a href={`mailto:${l.email}`} className="etiqueta">
                    {l.email}
                  </a>
                  <p className="mt-1 max-w-[70ch] whitespace-pre-line text-[0.95rem] leading-relaxed">
                    {l.message}
                  </p>
                </div>
                <Boton
                  ocupado={ocupado === l.id}
                  variante={l.handled ? "normal" : "fuerte"}
                  onClick={() => marcar(l)}
                >
                  {l.handled ? "Reabrir" : "Marcar respondido"}
                </Boton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
