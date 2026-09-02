-- Columnas para limitar envios y marcar mensajes sospechosos.
-- ip_hash NO guarda la IP: guarda un hash, que alcanza para contar y no
-- para identificar a nadie.
alter table public.leads
  add column if not exists ip_hash text,
  add column if not exists flagged boolean not null default false,
  add column if not exists flag_reason text;

create index if not exists leads_ip_hash_creado
  on public.leads (ip_hash, created_at desc);
create index if not exists leads_email_creado
  on public.leads (lower(email), created_at desc);

/*
  El formulario usa la clave anonima, que por RLS no puede leer `leads`.
  Esta funcion corre con los permisos del dueno y devuelve UNICAMENTE si el
  envio esta permitido y por que no. No expone conteos ni datos de nadie.

  Tres limites, cada uno tapa un abuso distinto:
   - por IP: alguien insistiendo desde un lugar.
   - por direccion de destino: el reenvio masivo a un tercero, que es el
     riesgo que abre el acuse de recibo. Este es el que importa, y por eso se
     evalua primero: cambiar de IP no lo esquiva.
   - global: freno de emergencia si el abuso viene distribuido, para no
     quemar la reputacion del dominio.
*/
create or replace function public.contacto_puede_enviar(
  p_ip_hash text,
  p_email text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip int;
  v_email int;
  v_total int;
begin
  select count(*) into v_ip from leads
    where ip_hash is not null and ip_hash = p_ip_hash
      and created_at > now() - interval '1 hour';

  select count(*) into v_email from leads
    where lower(email) = lower(p_email)
      and created_at > now() - interval '1 hour';

  select count(*) into v_total from leads
    where created_at > now() - interval '1 hour';

  if v_email >= 2 then
    return jsonb_build_object('permitido', false, 'motivo', 'email');
  elsif v_ip >= 3 then
    return jsonb_build_object('permitido', false, 'motivo', 'ip');
  elsif v_total >= 20 then
    return jsonb_build_object('permitido', false, 'motivo', 'global');
  end if;

  return jsonb_build_object('permitido', true, 'motivo', null);
end;
$$;

revoke all on function public.contacto_puede_enviar(text, text) from public;
grant execute on function public.contacto_puede_enviar(text, text) to anon, authenticated;
