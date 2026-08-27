import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Devuelve null si faltan las variables de entorno, para que la página
 * siga renderizando en vez de romper el build.
 */
export function getSupabase() {
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
