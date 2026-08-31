-- posts pasa al mismo patron de traduccion que projects y radar_items:
-- una fila por articulo, con las columnas _en al lado. Antes guardaba una
-- fila por idioma, que era la unica tabla del esquema funcionando distinto.
alter table public.posts
  add column if not exists body_html text,
  add column if not exists title_en text,
  add column if not exists excerpt_en text,
  add column if not exists body_html_en text;

-- el cuerpo se renderiza como html, igual que el del radar: no hay pipeline
-- de mdx en el sitio y sumar uno solo para esto no se justifica.
update public.posts set body_html = body_mdx where body_html is null;

alter table public.posts drop column if exists body_mdx;
alter table public.posts drop column if exists lang;

-- Las politicas RLS no cambian: lectura publica de lo publicado y gestion
-- completa para quien pase es_admin().
