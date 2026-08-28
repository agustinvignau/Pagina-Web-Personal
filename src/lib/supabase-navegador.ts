"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

/**
 * Cliente del navegador con sesión persistente, sólo para el panel.
 * Usa la misma clave pública que el resto del sitio: lo que decide qué se
 * puede leer y escribir son las políticas de la base, no este código.
 */
export function getSupabaseNavegador(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  cliente ??= createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cliente;
}
