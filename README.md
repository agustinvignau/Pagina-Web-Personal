# Portfolio — Agustín Vignau

Sitio personal en Next.js. Reemplaza la versión estática en HTML.

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Estilos:** Tailwind v4, con la paleta y la tipografía del sistema de diseño
- **Datos:** Supabase (proyecto `portfolio-vignau`, región São Paulo)
- **Deploy previsto:** Vercel

## Arrancar en local

```bash
npm install
npm run dev
```

Queda en http://localhost:3000

> La primera instalación puede tardar un par de minutos. Si ya existe una
> carpeta `node_modules` incompleta, `npm install` la completa sola.

## Variables de entorno

`.env.local` ya está creado y funciona. `.env.local.example` es la plantilla
para cuando haya que recrearlo.

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de lectura |

La clave anónima solo puede leer lo que está publicado y dar de alta leads:
las políticas de seguridad a nivel de fila están activas en las cuatro tablas.

## Subir a GitHub y a Vercel

El repositorio local ya está iniciado con un primer commit.

```bash
# 1. Crear el repo vacío en https://github.com/new  (nombre sugerido: portfolio)
# 2. Conectarlo y subir
git remote add origin https://github.com/agustinvignau/portfolio.git
git branch -M main
git push -u origin main
```

Después, en https://vercel.com/new: importar el repositorio, y antes de
desplegar cargar las dos variables de entorno de arriba en
*Environment Variables*. Vercel detecta Next.js solo.

## Base de datos

| Tabla | Contenido |
|---|---|
| `projects` | 9 proyectos: 4 de producción y 5 de laboratorio |
| `posts` | artículos propios del blog |
| `radar_items` | papers quincenales del radar de tecnología |
| `leads` | altas del formulario de contacto |

El esquema versionado está en `supabase/migrations/`.

## Estado

Fase 0 de 6 — fundaciones. El plan completo está en `docs/plan.md`.
