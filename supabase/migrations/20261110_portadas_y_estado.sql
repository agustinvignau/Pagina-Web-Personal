-- Fase 10: cada proyecto tiene una portada y un estado visible.
--
-- La portada es lo primero que se ve en el carrusel. Casi nadie lee las
-- fichas: se mira y se decide, así que cada proyecto tiene que mostrar cómo
-- quedó. El texto alternativo sigue el patrón de traducción del resto: una
-- columna _en al lado, con caída al castellano.
--
-- Solo suma columnas nulas: lo publicado sigue igual mientras estén vacías.
alter table public.projects
  add column if not exists cover_url text,
  add column if not exists cover_alt text,
  add column if not exists cover_alt_en text,
  add column if not exists status text
    check (status in ('en_produccion', 'terminado', 'en_desarrollo', 'uso_personal', 'producto_propio'));

comment on column public.projects.cover_url is
  'URL pública de la portada (bucket proyectos). Nula: el carrusel usa el mockup en vivo si existe, o la portada de reserva.';
comment on column public.projects.status is
  'Estado que se muestra sobre la portada. El rótulo en cada idioma sale de i18n.ts.';

-- Bucket público para las portadas. Público significa que la imagen se sirve
-- por su URL sin sesión. Para los anónimos no hay política de lectura sobre
-- storage.objects a propósito: ven cada imagen, pero no pueden listar el bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('proyectos', 'proyectos', true, 5242880,
        array['image/webp', 'image/png', 'image/jpeg', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Listar, escribir, reemplazar y borrar: solo quien pase es_admin(). La API de
-- Storage necesita leer el objeto para borrarlo o reemplazarlo, por eso el
-- admin sí tiene política de lectura. Igual que en las tablas, los permisos
-- los decide la base, no la pantalla.
drop policy if exists "admin lee portadas" on storage.objects;
create policy "admin lee portadas" on storage.objects
  for select to authenticated
  using (bucket_id = 'proyectos' and public.es_admin());

drop policy if exists "admin sube portadas" on storage.objects;
create policy "admin sube portadas" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'proyectos' and public.es_admin());

drop policy if exists "admin reemplaza portadas" on storage.objects;
create policy "admin reemplaza portadas" on storage.objects
  for update to authenticated
  using (bucket_id = 'proyectos' and public.es_admin())
  with check (bucket_id = 'proyectos' and public.es_admin());

drop policy if exists "admin borra portadas" on storage.objects;
create policy "admin borra portadas" on storage.objects
  for delete to authenticated
  using (bucket_id = 'proyectos' and public.es_admin());
