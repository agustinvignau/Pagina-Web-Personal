-- Analitica propia. Existe porque el plan Hobby de Vercel guarda un solo mes
-- y no admite eventos personalizados: aca la retencion es infinita y los
-- eventos los define uno.
--
-- Sin cookies y sin identificador persistente. `visitante` es un hash de
-- IP + navegador + FECHA DEL DIA: alcanza para contar visitantes unicos de
-- una jornada y se vuelve inservible al dia siguiente, porque el mismo
-- visitante genera otro hash.
--
-- El SQL completo se conserva en el historial de migraciones de Supabase.
create table if not exists public.eventos (
  id bigint generated always as identity primary key,
  tipo text not null default 'pagina'
    check (tipo in ('pagina', 'cv', 'contacto', 'externo')),
  ruta text not null,
  lang text not null default 'es' check (lang in ('es', 'en')),
  referido text,
  pais text,
  dispositivo text check (dispositivo in ('movil', 'escritorio', 'otro')),
  detalle text,
  visitante text,
  created_at timestamptz not null default now()
);

alter table public.eventos enable row level security;
-- Cualquiera registra; solo un admin lee. El resumen del panel va por la
-- funcion analitica_resumen(), que devuelve agregados y nunca filas crudas.
