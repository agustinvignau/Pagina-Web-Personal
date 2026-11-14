-- Auditoría del 13/11, hallazgo S1 — paso 1 de 2.
--
-- Hasta acá, la clave pública podía insertar directo en `leads` y `eventos`.
-- Eso dejaba saltear el límite de envíos, la trampa para bots y los recortes
-- de largo que hace el servidor.
--
-- Ahora las dos tablas se escriben solo a través de estas funciones, que
-- validan, aplican los límites e insertan en un solo paso. Lo que antes
-- decidía quien llamaba (si el mensaje es sospechoso, si ya fue atendido)
-- lo decide la base.
--
-- Este paso solo crea las funciones: el sitio viejo sigue andando. El paso 2
-- cierra la inserción directa, y va después del deploy.

create or replace function public.contacto_registrar(
  p_name text,
  p_email text,
  p_company text,
  p_message text,
  p_source text,
  p_ip_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(coalesce(p_name, ''));
  v_email text := btrim(coalesce(p_email, ''));
  v_company text := nullif(btrim(coalesce(p_company, '')), '');
  v_message text := btrim(coalesce(p_message, ''));
  v_ip int;
  v_mail int;
  v_total int;
  v_enlaces int;
  v_sospecha text;
begin
  -- Los mismos topes que aplica el servidor. Acá son los que valen.
  if length(v_name) = 0 or length(v_name) > 120
     or length(v_email) > 160
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'
     or length(v_message) = 0 or length(v_message) > 4000
     or length(coalesce(v_company, '')) > 120
     or p_source is null or p_source not in ('web', 'web-en')
     or (p_ip_hash is not null and p_ip_hash !~ '^[0-9a-f]{64}$')
  then
    return jsonb_build_object('ok', false, 'motivo', 'invalido');
  end if;

  select count(*) into v_mail from leads
    where lower(email) = lower(v_email)
      and created_at > now() - interval '1 hour';

  select count(*) into v_ip from leads
    where ip_hash is not null and ip_hash = p_ip_hash
      and created_at > now() - interval '1 hour';

  select count(*) into v_total from leads
    where created_at > now() - interval '1 hour';

  if v_mail >= 2 then
    return jsonb_build_object('ok', false, 'motivo', 'email');
  elsif v_ip >= 3 then
    return jsonb_build_object('ok', false, 'motivo', 'ip');
  elsif v_total >= 20 then
    return jsonb_build_object('ok', false, 'motivo', 'global');
  end if;

  -- Pocas señales y conservadoras: un falso positivo es una consulta real
  -- que no recibe acuse. Nada se descarta: se marca.
  select count(*) into v_enlaces from regexp_matches(v_message, 'https?://', 'gi');
  if v_name ~* 'https?://' then
    v_sospecha := 'enlace en el nombre';
  elsif v_enlaces >= 3 then
    v_sospecha := v_enlaces || ' enlaces en el mensaje';
  end if;

  insert into leads (name, email, company, message, source, ip_hash, flagged, flag_reason)
  values (v_name, v_email, v_company, v_message, p_source, p_ip_hash, v_sospecha is not null, v_sospecha);

  return jsonb_build_object('ok', true, 'motivo', null, 'sospecha', v_sospecha);
end;
$$;

revoke all on function public.contacto_registrar(text, text, text, text, text, text) from public;
grant execute on function public.contacto_registrar(text, text, text, text, text, text) to anon, service_role;


create or replace function public.evento_registrar(
  p_tipo text,
  p_ruta text,
  p_lang text,
  p_referido text,
  p_pais text,
  p_dispositivo text,
  p_detalle text,
  p_visitante text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_del_visitante int;
  v_del_dia int;
begin
  if p_tipo is null or p_tipo not in ('pagina', 'cv', 'contacto', 'externo')
     or p_lang is null or p_lang not in ('es', 'en')
     or p_dispositivo is null or p_dispositivo not in ('movil', 'escritorio', 'otro')
     or p_ruta is null or left(p_ruta, 1) <> '/' or length(p_ruta) > 200
     or length(coalesce(p_referido, '')) > 80
     or (p_pais is not null and p_pais !~ '^[A-Za-z]{2}$')
     or length(coalesce(p_detalle, '')) > 200
     or p_visitante is null or p_visitante !~ '^[0-9a-f]{32}$'
  then
    return false;
  end if;

  -- Topes para que nadie infle las visitas ni llene la base: 300 eventos por
  -- visitante y 5.000 en total por día. El sitio real queda muy por debajo.
  select count(*) into v_del_visitante from eventos
    where visitante = p_visitante and created_at > now() - interval '1 day';
  if v_del_visitante >= 300 then
    return false;
  end if;

  select count(*) into v_del_dia from eventos
    where created_at > now() - interval '1 day';
  if v_del_dia >= 5000 then
    return false;
  end if;

  insert into eventos (tipo, ruta, lang, referido, pais, dispositivo, detalle, visitante)
  values (p_tipo, p_ruta, p_lang, nullif(p_referido, ''), upper(p_pais), p_dispositivo, nullif(p_detalle, ''), p_visitante);

  return true;
end;
$$;

revoke all on function public.evento_registrar(text, text, text, text, text, text, text, text) from public;
grant execute on function public.evento_registrar(text, text, text, text, text, text, text, text) to anon, service_role;
