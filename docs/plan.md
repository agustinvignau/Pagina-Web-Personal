# Plan por fases

Estado al 31 de agosto de 2026. El sitio está en línea en
https://www.agustinvignau.com sobre Vercel, con dominio propio, panel
en `/admin` y versión en inglés bajo `/en`.

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Fundaciones: proyecto, tokens, base de datos, contenido cargado | completa |
| 1 | Identidad visual y mockups de producto | completa |
| 2 | Núcleo del portfolio: home, producción, laboratorio, perfil, contacto | completa |
| 3 | Capa premium de movimiento | completa |
| 4 | Radar y blog | completa |
| 5 | Inglés y SEO técnico | completa |
| 6 | Panel propio y dominio | completa |

Las siete fases están cerradas. Ninguna arrancó sin aprobación explícita.

## Qué quedó construido

- **Fase 1–2.** Hero, navegación, fichas de proyecto, mockups de producto
  (Facturas y Génesis, en versión mini y pantalla completa), Laboratorio,
  Perfil, páginas de detalle y contacto funcional contra `/api/contacto`.
- **Fase 3.** Reveals por scroll, cursor propio, cortina entre rutas,
  parallax y barra de progreso.
- **Fase 4.** Sección Radar con índice y notas; los anclajes del menú
  quedaron absolutos para funcionar desde páginas internas.
- **Fase 5.** Inglés bajo `/en` con hreflang y diccionario propio; SEO
  técnico completo: metadatos, canónicas, sitemap, robots, datos
  estructurados e imágenes de vista previa.
- **Fase 6.** Panel `/admin` con ingreso por enlace mágico, aprobación del
  radar, visibilidad de proyectos y bandeja de mensajes. El enlace solo se
  envía a usuarios ya invitados, el panel no se dibuja para sesiones ajenas
  y la lista de accesos vive en la tabla `admins`, no en el código.
- **Auditoría.** Contraste accesible, favicon propio y menos trabajo en el
  hilo principal.
- **Cierre de la fase 4.** Sección Escritos en `/escritos` y `/en/writing`,
  con índice, páginas de detalle, minutos de lectura, etiquetas, imágenes de
  vista previa, entrada en el menú y en el sitemap, y su solapa en el panel.
  La tabla `posts` pasó al mismo patrón de traducción que el resto: una fila
  por artículo con las columnas `_en` al lado, y el cuerpo en HTML como el
  del radar, en vez de una fila por idioma con MDX.
- **Los mails del formulario.** Cada mensaje dispara el aviso a Agustín y un
  acuse de recibo a quien escribió, en su idioma, con copia de lo que mandó.

## Qué hay hoy en la base

| Tabla | Filas | Nota |
|---|---|---|
| `projects` | 9 | 4 de producción y 5 de laboratorio, todos publicados y con traducción al inglés |
| `radar_items` | 1 | una sola edición publicada: el período 17–24 de agosto |
| `posts` | 0 | la sección ya existe y está vacía: falta el primer artículo |
| `leads` | 2 | ninguno marcado como atendido; el último entró el 30 de agosto |
| `admins` | 2 | quiénes pueden entrar a `/admin` |

## Lo que quedó abierto

1. **Resend sin configurar.** El código de los dos mails está escrito y
   probado, pero `RESEND_API_KEY` no existe todavía y el dominio no está
   verificado en Resend, así que no sale ninguno. Los pasos están en el
   README. Hasta que se haga, los mensajes solo se ven entrando al panel.
2. **Escritos sin ningún artículo.** El menú ya muestra la sección y la
   página dice que no hay nada publicado. Conviene tener el primero antes de
   desplegar, o sacar la entrada del menú hasta entonces.
3. **El radar no está automatizado.** Hay índice, notas y aprobación desde
   el panel, pero ninguna ingesta: no hay edge functions, ni tarea
   programada, ni más rutas de API que `/api/contacto`. Las ediciones
   quincenales se cargan a mano, y con una sola publicada la cadencia está
   por cortarse.
4. **Dos mensajes sin responder** en la bandeja del panel, del 30 de agosto.
5. **Sin foto de perfil.** Sigue anotado como mejora futura.

## Decisiones tomadas

- **Meta:** una sola web que sirva a marca personal, empleo y clientes.
  Lo comercial deriva a renovatio.ar.
- **Hero:** "Analizo, diseño y resuelvo."
- **Proyectos en dos niveles:** producción (sistemas reales) arriba,
  laboratorio (estudios con datos sintéticos) abajo, declarados como método.
- **Paleta:** #E9E0D6, #B7B7A4, #8B9797, #7A754B, #3D3E39, más #14150F
  (tinta) y #A8A26A (oliva luz) agregados para tener contraste en oscuro.
- **Tipografía:** Archivo variable — ancho expandido para titulares, normal
  para leer — y Martian Mono para etiquetas y datos.
- **Idioma:** español principal, inglés bajo `/en`; si falta una
  traducción, la pantalla cae al castellano.
- La automatización de facturas se presenta sin nombrar la herramienta.
- **Infraestructura:** dominio en Cloudflare, DNS apuntando a Vercel en
  modo *DNS only* — con el proxy activado Vercel no emite el certificado.
  Base en Supabase (`portfolio-vignau`, São Paulo), RLS activo en todas
  las tablas.

## Posibles próximos pasos

| Opción | Qué implica |
|---|---|
| A. Terminar el correo | Crear la clave en Resend y verificar el dominio en Cloudflare. Sin código: son tres pasos del README |
| B. El primer escrito | Escribir y publicar el artículo que estrena la sección |
| C. Radar automatizado | Ingesta programada de fuentes + borrador automático que se aprueba desde `/admin` |
| D. Contenido | Cargar la edición del radar que falta y responder los dos mensajes |
| E. Pulido | Foto de perfil, o lo que aparezca al mirar el sitio con ojos frescos |
