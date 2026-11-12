-- Fase 10.1: galería de capturas en la ficha de cada proyecto.
--
-- Génesis y Comprobantes tienen un mockup en código; el resto de las fichas
-- no mostraba ninguna imagen. Cada elemento es una captura real con su texto
-- alternativo y un epígrafe corto, en los dos idiomas:
--   { "src", "ancho", "alto", "alt", "alt_en", "pie", "pie_en" }
-- ancho y alto son los de la imagen, para que la página reserve el lugar y
-- no salte al cargar. Se edita en Supabase, como los textos de la ficha.
alter table public.projects
  add column if not exists gallery jsonb not null default '[]'::jsonb;
