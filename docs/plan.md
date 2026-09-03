# Registro de fases y decisiones

Del 26 de agosto al 2 de septiembre de 2026. Este archivo es la fuente de
verdad del proyecto: qué se construyó, qué se decidió y por qué. El README
cuenta cómo operarlo; esto cuenta cómo llegó a ser así.

El sitio está en línea en https://www.agustinvignau.com.

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Fundaciones: proyecto, tokens, base de datos, contenido cargado | completa |
| 1 | Identidad visual y mockups de producto | completa |
| 2 | Núcleo: home, producción, laboratorio, perfil, contacto | completa |
| 3 | Capa premium de movimiento | completa |
| 4 | Radar y Escritos | completa |
| 5 | Inglés y SEO técnico | completa |
| 6 | Panel propio y dominio | completa |
| 7 | Correo, automatización y seguridad | completa |

Ninguna fase arrancó sin aprobación explícita.

---

## Fase 0 — Fundaciones · 26-27 de agosto

Proyecto en Next.js 15 con App Router, Tailwind v4, y el esquema en Supabase
con las cuatro tablas iniciales y RLS activo desde el principio.

## Fase 1 — Identidad visual · 27 de agosto

Sistema de diseño en código: hero, navegación, fichas de proyecto y los
mockups de producto (Facturas y Génesis, en versión mini y pantalla completa).

## Fase 2 — El núcleo · 27 de agosto

Laboratorio, Perfil, páginas de detalle con las pantallas de producto, y el
formulario de contacto funcional contra `/api/contacto`.

## Fase 3 — Movimiento · 27 de agosto

Reveals por scroll, cursor propio, cortina entre rutas, parallax y barra de
progreso.

> **Un bug que enseñó algo:** volver atrás dejaba la página en blanco. Los
> bloques quedaban marcados como observados por un `IntersectionObserver` ya
> destruido. Vale la pena recordarlo si se vuelve a tocar la capa de
> movimiento.

## Fase 4 — Radar y Escritos · 27 de agosto y 31 de agosto

El radar salió el 27. **Escritos quedó afuera cuatro días** y se terminó el
31: la tabla `posts` existía desde la fase 0 sin que ninguna pantalla la
tocara. Al retomarlo se migró al patrón de traducción del resto del sitio
—una fila con columnas `_en`, en vez de una fila por idioma— y el cuerpo pasó
de MDX a HTML, como el del radar, para no sumar un pipeline entero por una
sola sección.

También en esta fase: los anclajes del menú pasaron a ser absolutos, para que
funcionen desde las páginas internas.

## Fase 5 — Inglés y SEO · 27 de agosto

Versión en inglés bajo `/en` con hreflang y diccionario propio. SEO técnico
completo sobre el dominio: metadatos, canónicas, sitemap, robots, datos
estructurados e imágenes de vista previa.

## Fase 6 — Panel y dominio · 28 de agosto

Panel `/admin` con enlace mágico. Se endureció en tres commits sucesivos: el
enlace solo va a usuarios ya invitados, el panel no se dibuja para sesiones
ajenas, y la lista de accesos salió del código a la tabla `admins`.

## Fase 7 — Correo, automatización y seguridad · 31 de agosto al 2 de septiembre

### El correo

El código de Resend estaba escrito desde la fase 2 pero **nunca configurado**,
así que el formulario guardaba los mensajes sin avisar. Dos consultas reales
pasaron días esperando en el panel sin que nadie lo supiera.

Se sumó el acuse de recibo al visitante, se verificó el dominio y se cargaron
las variables en Vercel. La depuración fue larga y dejó tres lecciones que
están en el README: las variables necesitan redeploy, el valor importa tanto
como la existencia, y un fallo en silencio es peor que un error.

### Las automatizaciones

Ver el README para cómo funcionan. La decisión de fondo fue **dónde corren**:
no en Vercel con una clave de LLM paga, sino como tareas programadas que ya
tienen acceso a Drive y a Supabase. Sin clave nueva, sin costo, sin cron.

### La seguridad

Límite de envíos y marcado de sospechosos en el formulario, cabeceras de
seguridad, y `es_admin()` fuera del alcance de los anónimos.

---

## Decisiones tomadas

**Producto**

- **Meta:** una sola web que sirva a marca personal, empleo y clientes. Lo
  comercial deriva a renovatio.ar.
- **Hero:** "Analizo, diseño y resuelvo."
- **Proyectos en dos niveles:** producción (sistemas reales) arriba,
  laboratorio (estudios con datos sintéticos) abajo, declarados como método.
  Los datos son inventados a propósito, para mostrar el trabajo sin exponer a
  ninguna empresa.
- La automatización de facturas se presenta sin nombrar la herramienta.
- **Sin foto** por ahora; anotado como mejora futura.

**Forma**

- **Paleta:** #E9E0D6, #B7B7A4, #8B9797, #7A754B, #3D3E39, más #14150F
  (tinta) y #A8A26A (oliva luz), agregados para tener contraste en oscuro.
- **Tipografía:** Archivo variable — ancho expandido para titulares, normal
  para leer — y Martian Mono para etiquetas y datos.

**Código**

- Todo en castellano: nombres, comentarios y mensajes de commit, sin prefijos
  tipo `feat:`. Los comentarios explican *por qué*, no *qué*.
- Traducciones como columnas `_en` en la misma fila, con caída al castellano.
- Rutas en castellano en la raíz, inglés bajo `/en` con el nombre traducido.

**Automatización**

- **El radar publica solo; los escritos no.** Un error en el radar es un dato
  mal citado; un párrafo torpe firmado por Agustín hace más daño.
- Al automatizar el publicado del radar **se reescribió la copia**, que
  prometía revisión humana previa. Ahora dice lo que el sistema hace, y usa la
  automatización como argumento de venta en vez de esconderla. Si vuelve a
  cambiar la cadencia o el criterio, hay que tocar a la vez el prompt de la
  tarea y `radar.bajada` y `radar.comoSeArma` en `src/lib/i18n.ts`, en los dos
  idiomas.
- El doc de Gemini del radar tiene defectos conocidos —bloques fuera de orden
  cronológico, fechas repetidas, emojis mal codificados— y la tarea los
  contempla. Si sale una edición rara, mirar primero el doc.

**Lo que se decidió NO hacer**

- **Sin página de testimonios inventados.** Llegó una oferta de spam para
  "escribir los textos" de reseñas que no existen. Se descartó: el sitio vende
  confiabilidad con datos ajenos, y reseñas falsas destruyen justo eso. La
  versión honesta es pedir una cita real a TuGenesis3D o una recomendación en
  LinkedIn, y la sección va **después** de tener las citas, no antes.
- **Sin Content-Security-Policy** hasta poder hacerla con nonces.
- **Sin Turnstile** por ahora: un spam cada dos meses no lo justifica.

---

## Lo que queda abierto

1. **Ningún escrito publicado todavía.** La sección está en el menú y vacía.
   Se resuelve con la primera bitácora del domingo.
2. **El teléfono en el CV público.** El PDF del pie lleva el número personal y
   lo van a rastrear los bots. Decisión pendiente: sacarlo del CV público y
   mantener una versión con teléfono para mandar a mano.
3. **Sin foto de perfil.**
4. **Las canónicas apuntan a `www`** y el dominio sirve desde la raíz sin
   `www`. No rompe nada; conviene alinearlo.
