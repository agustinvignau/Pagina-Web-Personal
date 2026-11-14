-- Auditoría del 13/11, hallazgos S1 y S7 — paso 2 de 2.
-- Va DESPUÉS del deploy que usa contacto_registrar y evento_registrar.

-- S1: la clave pública ya no inserta directo. Sin política, RLS lo rechaza.
drop policy if exists "alta de leads" on public.leads;
drop policy if exists "alta de eventos" on public.eventos;

-- La función vieja del límite queda reemplazada por contacto_registrar.
-- Además dejaba saber si una dirección había escrito en la última hora.
drop function if exists public.contacto_puede_enviar(text, text);

-- S7: es_admin() solo la necesita quien tiene sesión.
-- La política de lectura de eventos estaba abierta al rol público y la
-- evaluaba también sin sesión: se acota a usuarios con sesión.
alter policy "admin lee eventos" on public.eventos to authenticated;
revoke execute on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated, service_role;
