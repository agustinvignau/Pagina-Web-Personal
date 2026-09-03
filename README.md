# Portfolio — Agustín Vignau

**En línea: https://www.agustinvignau.com**

Sitio personal en Next.js. Reemplaza la versión estática en HTML.

Además del portfolio en sí, el sitio tiene dos secciones que se alimentan
solas: el **Radar**, que se publica cada quince días sin intervención, y
**Escritos**, que deja un borrador semanal listo para aprobar. Cómo funcionan
está más abajo.

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Estilos:** Tailwind v4, con la paleta y la tipografía del sistema de diseño
- **Datos:** Supabase (proyecto `portfolio-vignau`, ref `ettrvdlseiamhyswiznu`, São Paulo)
- **Correo:** Resend, sobre el dominio propio verificado
- **Deploy:** Vercel, plan Hobby, desde `agustinvignau/Pagina-Web-Personal`

El registro de fases y las decisiones de diseño están en **`docs/plan.md`**,
que es la fuente de verdad del proyecto.

## Arrancar en local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run typecheck  # chequeo de tipos del código fuente
```

`npm run typecheck` usa su propio `tsconfig.check.json` en vez del principal,
porque aquel incluye `.next/types`, que queda viejo entre builds y tira
errores fantasma sobre archivos que ya no existen.

## Variables de entorno

`.env.local` para local, y las mismas cargadas en Vercel para producción.
`.env.local.example` es la plantilla.

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de lectura |
| `RESEND_API_KEY` | Clave de Resend para los mails del formulario |
| `RESEND_FROM` | Remitente, sobre el dominio verificado |

La clave anónima solo puede leer lo publicado y dar de alta leads: las
políticas de seguridad a nivel de fila están activas en las cinco tablas.

> **Cargar una variable en Vercel no alcanza.** Las variables se leen cuando
> se construye el sitio, así que el deploy que ya está publicado sigue sin
> verlas hasta que lo rehagas. Después de agregar o editar una, hay que
> redesplegar. Esto costó dos vueltas enteras de diagnóstico.

## Base de datos

| Tabla | Contenido |
|---|---|
| `projects` | 9 proyectos: 4 de producción y 5 de laboratorio |
| `posts` | los escritos, en `/escritos` y `/en/writing` |
| `radar_items` | las ediciones quincenales del radar |
| `leads` | altas del formulario de contacto |
| `admins` | quiénes pueden entrar a `/admin` |

El esquema versionado está en `supabase/migrations/`.

**Traducciones:** no hay una fila por idioma. Cada fila lleva sus columnas
`_en` al lado (`title_en`, `body_html_en`), y si falta la traducción la
pantalla cae al castellano. Vale para las tres tablas de contenido.

**Rutas:** el castellano vive en la raíz y el inglés bajo `/en` con el nombre
traducido (`/proyectos` → `/en/projects`, `/escritos` → `/en/writing`). Se
hizo así para no romper las URLs ya publicadas.

## El panel

`/admin`, con ingreso por enlace mágico. Tres barreras, en este orden:

1. El enlace solo se manda a direcciones que ya existen como usuario
   (`shouldCreateUser: false`). Para sumar a alguien hay que invitarlo desde
   Supabase, a propósito.
2. El panel no se dibuja si la sesión no pasa `es_admin()`, que consulta la
   tabla `admins`. Sumar o sacar a alguien es una fila, no un deploy.
3. Los permisos sobre los datos los decide la base, no la pantalla. Aunque
   alguien se saltara las dos anteriores, RLS no le da nada.

Desde ahí se aprueban escritos, se cambia la visibilidad de proyectos, se
corrigen ediciones del radar y se leen los mensajes.

## Los mails del formulario

Cada mensaje dispara dos mails por Resend: el aviso a Agustín, con
*reply-to* a quien escribió, y el acuse de recibo a esa persona, en su
idioma y con copia de lo que mandó.

Ninguno es obligatorio: si Resend falla o falta la clave, el lead ya quedó
guardado y la respuesta al visitante sigue siendo un éxito. Los fallos se
escriben en los logs — antes se perdían en silencio, y eso hizo que dos
consultas reales pasaran días sin que nadie se enterara.

**Si los mails no llegan, revisar en este orden:**

1. ¿Llegó el lead a `leads`? Si sí, el formulario y la base están bien.
2. ¿Se redesplegó después de tocar las variables? (ver el aviso de arriba)
3. El *valor* de las variables, no solo que existan. Un `RESEND_FROM` mal
   tipeado hace que Resend rechace el envío **antes** de registrarlo, así que
   la bandeja de Emails queda vacía en vez de mostrar errores.
4. `node scripts/probar-resend.mjs` prueba la clave sin pasar por el
   formulario. Correrlo desde la terminal, en la raíz del proyecto.

Un 401 `restricted_api_key` al leer `/domains` **no** es un problema: la
clave es de solo envío y no puede listar dominios.

## Protección del formulario

- Campo trampa oculto: si viene completo, se corta sin decir por qué.
- Límite por hora, contado por la base: 2 por dirección de destino, 3 por IP,
  20 en total. El de la dirección se evalúa primero y es el que importa —
  sin él, el acuse de recibo convierte el formulario en una máquina de
  mandarle mails a un tercero desde el dominio propio. Cambiar de IP no lo
  esquiva.
- De la IP se guarda un hash, no la IP.
- Los mensajes con enlaces de más quedan **marcados, no descartados**: un
  falso positivo es una consulta real que se pierde. Al marcado no se le
  manda acuse, para no contestarle a la dirección de otro.

## Las dos automatizaciones

Ninguna de las dos corre en Vercel: son tareas programadas de Cowork, que
leen Google Drive y escriben en Supabase. No dependen de que haya una
computadora prendida.

### Radar — se publica solo

1. Una tarea de Gemini escribe cada 3 o 4 días en el Google Doc
   *"Registro de Novedades y Documentación - Radar Tecnológico"*.
2. Los días **1 y 16 a las 9**, una tarea consolida las entradas del período
   en una edición, la escribe en los dos idiomas y la **publica**.
3. El informe de la corrida llega por mail. Ese es el único aviso; si algo
   salió mal se corrige o se baja desde `/admin`.

El período se encadena desde el `period_end` de la última edición hasta ayer,
así no quedan huecos.

### Escritos — deja borrador

1. **Domingos 20:00** — Gemini Spark entrevista a Agustín sobre la semana y
   escribe un bloque en el doc *"Bitácora semanal - Escritos"*. El prompt de
   esa entrevista está en `docs/prompt-escritos.md`.
2. **Lunes 9:00** — una tarea convierte el bloque en una nota y la deja en
   **borrador**. El mail trae el texto completo, para decidir sin abrir el panel.

**Por qué uno publica y el otro no:** el radar es consolidación de novedades
técnicas, donde un error es un dato mal citado. Un escrito es la voz y la
opinión de Agustín; un párrafo torpe firmado por él hace más daño. La tarea
tampoco escribe si la semana no dio para nota.

## Infraestructura

El dominio está en Cloudflare y el DNS apunta a Vercel, con los registros en
modo **DNS only** — la nube gris, no la naranja.

> Cloudflare muestra un cartel recomendando activar el proxy. **Ignorarlo.**
> Con el proxy activado, Vercel no puede emitir el certificado y Resend no
> puede verificar el dominio (error 1004).

Los registros de Resend (`send` MX y TXT, `resend._domainkey` TXT) también
van en DNS only.

### Cabeceras de seguridad

Están en `next.config.ts` y no en la configuración de Vercel, para que valgan
también en local: HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`
y `Permissions-Policy`.

No hay Content-Security-Policy a propósito: hacerla bien en Next exige nonces
por request, y una CSP a medias rompe la página sin proteger nada.

## Deploy

Push a `main` dispara el deploy en Vercel. No hay más ceremonia.

Antes de desplegar por primera vez en un proyecto nuevo hay que cargar las
cuatro variables de entorno; Vercel detecta Next.js solo.

## Límites que conviene conocer

- **Resend, plan gratuito:** 100 mails por día, 3.000 por mes. Cada consulta
  manda dos, así que el techo real son unas 50 consultas diarias.
- **Vercel Hobby:** las tareas programadas admiten una ejecución por día como
  máximo, con precisión de ±59 minutos. Por eso el radar corre los días 1 y
  16 y no cada quince días exactos.
