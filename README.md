# Portfolio — Agustín Vignau

**En línea: https://www.agustinvignau.com**

Sitio personal en Next.js. Reemplaza la versión estática en HTML.

El dominio está registrado en Cloudflare y el DNS apunta a Vercel con un
registro A en el raíz y un CNAME en `www`, ambos en modo **DNS only**: si se
activa el proxy de Cloudflare (la nube naranja), Vercel no puede emitir el
certificado.

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
| `RESEND_API_KEY` | Clave de Resend para los mails del formulario |
| `RESEND_FROM` | Dirección remitente, sobre el dominio verificado |

La clave anónima solo puede leer lo que está publicado y dar de alta leads:
las políticas de seguridad a nivel de fila están activas en las cinco tablas.

## Los mails del formulario

Cada mensaje del formulario dispara dos mails: el aviso a Agustín y el acuse
de recibo a quien escribió. Los dos salen por Resend y ninguno es
obligatorio — si `RESEND_API_KEY` no está cargada, el lead igual se guarda y
queda esperando en el panel, que es exactamente lo que pasó hasta ahora.

Para que salgan:

1. Crear la clave en https://resend.com/api-keys y cargarla como
   `RESEND_API_KEY`, en `.env.local` y en las variables de entorno de Vercel.
2. Verificar `agustinvignau.com` en https://resend.com/domains. Resend da unos
   registros DNS (SPF, DKIM y el de retorno) que van en Cloudflare, en modo
   **DNS only** como el resto.
3. Recién con el dominio verificado poner `RESEND_FROM=web@agustinvignau.com`.

El paso 2 no es opcional. Mientras el remitente sea el de prueba
(`onboarding@resend.dev`), Resend solo entrega mails a la casilla dueña de la
cuenta: el aviso llegaría y el acuse al visitante no.

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
| `posts` | los escritos, en `/escritos` y `/en/writing` |
| `radar_items` | papers quincenales del radar de tecnología |
| `leads` | altas del formulario de contacto |
| `admins` | quiénes pueden entrar a `/admin` |

El esquema versionado está en `supabase/migrations/`.

## Estado

Las siete fases están cerradas. Lo que queda abierto y lo que se decidió en
el camino está en `docs/plan.md`, que es la fuente de verdad del proyecto.
