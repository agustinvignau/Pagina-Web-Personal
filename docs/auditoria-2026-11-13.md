# Spec — Auditoría de seguridad, SEO y velocidad

**Sitio:** agustinvignau.com · **Fecha:** 13 de noviembre de 2026 · **Commit auditado:** `82d6b70` (Fase 11)

**Estado:** solo diagnóstico. No se cambió código, base de datos ni configuración.
Cada hallazgo tiene un identificador para aprobarlo o descartarlo por separado.

---

## 1. Resumen

| Área | Estado | Lo más importante |
|---|---|---|
| Seguridad | Base sana, con 3 huecos reales | Cualquiera puede escribir directo en `leads` y `eventos` salteando el límite del formulario (S1). El HTML del Radar y de Escritos se publica sin filtrar y no hay CSP (S2). Las tareas programadas leen la web con acceso SQL total a la base (S3). |
| SEO | Bien armado, con 1 error que afecta a todas las páginas internas | Al compartir cualquier ficha, edición o nota, el título y la descripción que se ven son los del inicio (O1). Faltan datos estructurados de artículo (O2). |
| Velocidad | Buena | Inicio en celular: 93–95 de 100. Lo que se puede mejorar: el HTML del inicio pesa 499 KB (V1) y el texto principal espera al JavaScript para mostrarse (V2). |

Orden sugerido: **S1 → S2 → O1 → S3 → S4 → V1 → V2**, y después lo demás.

---

## 2. Cómo se hizo y qué no se pudo medir

- **Código:** lectura del repo en el commit `82d6b70`.
- **Base:** políticas, permisos y funciones leídas de Supabase, más su revisor de seguridad y de rendimiento.
- **Sitio en vivo:** cabeceras, robots, sitemap, metadatos y peso de las páginas, leídos desde el navegador.
- **Velocidad:** Lighthouse 13.6 sobre una **copia local** del sitio (build de producción), porque desde acá no se llega al dominio. Tres corridas en celular y una en escritorio.

Límites de esta auditoría:

- Los números de velocidad son de la copia local: no incluyen la red real, las portadas que vienen de Supabase ni las fuentes de Google. Sirven para comparar antes y después, no como nota definitiva. **Falta correr PageSpeed Insights sobre el dominio real.**
- No se pudo ver la configuración de Supabase Auth (registro abierto o cerrado, confirmación de mail) ni la de Vercel (variables, protección de previews). Están marcadas como "a verificar".
- No se hicieron pruebas de escritura contra producción: los huecos S1 y S5 salen de leer las políticas, no de explotarlos.
- No se revisó Search Console (indexación real, consultas, errores de rastreo).

---

## 3. Seguridad

### Lo que está bien

- RLS activo en las 6 tablas. Los borradores de Radar y Escritos no se pueden leer sin sesión de admin.
- `leads` no se puede leer con la clave pública.
- No hay claves secretas en el repo ni en el historial. La clave de Resend vive solo en el servidor.
- El panel entra por enlace al mail, sin contraseña y sin crear usuarios nuevos desde el formulario.
- Cabeceras presentes en vivo: HSTS con preload, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- El bucket de portadas limita tipo de archivo y tamaño (5 MB), y solo un admin puede subir o borrar.
- El formulario tiene trampa para bots, límite por mail, por IP y global, y no manda acuse a mensajes sospechosos.
- El contenido actual de Radar y Escritos no tiene scripts ni atributos peligrosos (se buscó en la base).

### Hallazgos

#### S1 — Se puede escribir en `leads` y `eventos` sin pasar por el sitio · **Alta**

- **Qué pasa:** las políticas "alta de leads" y "alta de eventos" permiten insertar al rol público sin ninguna condición. La clave pública está en el JavaScript del sitio, así que cualquiera puede llamar a la API de Supabase directamente.
- **Consecuencias:**
  - Se saltea el límite de envíos, la trampa para bots y el recorte de largos (en la base no hay tope de tamaño para el mensaje).
  - **Se puede apagar el formulario:** el límite global cuenta todas las filas de `leads` de la última hora. Con 20 inserciones directas por hora, el formulario real responde "son varios mensajes" a todo el mundo.
  - Se pueden falsear las estadísticas de visitas y llenar la base (plan gratuito).
  - Quien inserta puede fijar `flagged`, `handled` e `ip_hash` a gusto.
- **Qué no pasa:** no se disparan mails (eso lo hace solo `/api/contacto`) y no se puede leer nada.
- **Propuesta:** que las dos rutas del servidor escriban con una clave de servidor (service role, solo en variables de Vercel) y quitar las dos políticas de inserción pública. Alternativa sin clave nueva: una función por tabla que valide largos y aplique el límite adentro.
- **Cómo se verifica:** una inserción directa con la clave pública devuelve error; el formulario y la analítica siguen andando.

#### S2 — El HTML de Radar y Escritos se publica sin filtrar, y no hay CSP · **Alta**

- **Qué pasa:** `body_html` se inserta tal cual en la página pública (`PaginaEdicion`, `PaginaEscrito`) y en el panel (`SeccionRadar`, `SeccionEscritos`). No hay Content-Security-Policy.
- **Por qué importa ahora:** desde la Fase 12 el Radar lo escribe un agente que lee páginas de terceros y **publica solo**. Si una fuente trae texto pensado para manipularlo, puede terminar un `<script>` en una edición publicada.
- **Consecuencia:** el script correría para cada visitante, y también dentro del panel con la sesión de admin abierta (la sesión se guarda en el navegador), lo que daría control de todo el contenido y lectura de los mensajes.
- **Propuesta, en dos capas:**
  1. Filtrar el HTML al mostrarlo con una lista corta de etiquetas permitidas (`h2`, `h3`, `p`, `ul`, `li`, `code`, `a` con `href` http/https, `strong`, `em`), en el sitio y en el panel.
  2. Sumar una CSP con nonces. El `next.config.ts` ya la tiene anotada como mejora pendiente.
- **Cómo se verifica:** un borrador de prueba con `<script>` y con `onerror=` se muestra sin ejecutarlos.

#### S3 — Las tareas programadas leen la web con acceso total a la base · **Alta**

- **Qué pasa:** las tareas de Radar y Escritos corren con el conector de Supabase completo (cualquier SQL sobre cualquier tabla), más Gmail, Drive, Calendar, Zapier y Higgsfield, que no necesitan. La de Radar lee 13 fuentes externas sin nadie mirando.
- **Riesgo:** una instrucción escondida en una página podría hacer que el agente borre tablas, lea `leads` o mande datos afuera por otro conector. El filtro de S2 no cubre esto.
- **Propuesta:**
  - Dejarle a cada tarea solo los conectores que usa (Supabase; Gmail solo si hace falta para el aviso).
  - Que el Radar escriba con un rol de base limitado a insertar y actualizar `radar_items`, o a través de una función que solo acepte una edición.
  - Evaluar que el Radar deje **borrador** y se publique con un clic desde el mail, al menos hasta tener S2 resuelto.
- **Cómo se verifica:** con el rol limitado, un `select` sobre `leads` o un `delete` sobre `projects` fallan.

#### S4 — Dependencias con avisos de seguridad · **Media**

- **Qué pasa:** `npm audit` marca 4 avisos: `next` 15.5.24 (crítico: envenenamiento de caché en páginas ISR, ejecución remota en el optimizador de imágenes con SVG, y caída por Server Actions), `postcss`, `sharp` y `source-map-js` (altos).
- **Alcance real:** dos de los avisos de Next hablan de instalaciones propias, no de Vercel, y el sitio no usa Server Actions ni permite SVG en el optimizador. No se verificó aviso por aviso cuáles aplican.
- **Propuesta:** `npm audit fix`, build, prueba visual y deploy. Sumar Dependabot o una revisión mensual.
- **Cómo se verifica:** `npm audit --omit=dev` sin avisos altos ni críticos.

#### S5 — Hay un admin en la tabla que no tiene usuario · **Media, a verificar**

- **Qué pasa:** `admins` tiene 2 mails y solo 1 tiene usuario creado. `es_admin()` da permiso por el mail que figura en la sesión.
- **Riesgo:** si en Supabase Auth el registro público está abierto y la confirmación de mail apagada, alguien podría registrarse con ese segundo mail y quedar como admin. Con la confirmación prendida no alcanza, porque necesitaría entrar a esa casilla.
- **Propuesta:** revisar en Supabase → Authentication que el registro esté cerrado (o la confirmación activa) y borrar de `admins` el mail que no se usa.

#### S6 — El acuse de recibo reenvía el mensaje a cualquier dirección · **Media**

- **Qué pasa:** el acuse va al mail que se escribió en el formulario e incluye copia del mensaje (hasta 4.000 caracteres, con hasta 2 enlaces sin marcar).
- **Riesgo:** sirve para mandarle a un tercero un texto elegido por el atacante, desde tu dominio. El límite (2 por hora por dirección, 3 por IP, 20 en total) lo acota pero no lo elimina, y puede dañar la reputación del dominio en Resend.
- **Propuesta:** que el acuse no incluya la copia del mensaje, o que no salga si el mensaje trae algún enlace.

#### S7 — Funciones internas expuestas a cualquiera · **Baja**

- `es_admin()` y `contacto_puede_enviar()` se pueden llamar sin sesión (aviso del revisor de Supabase; el plan decía que no).
- `es_admin()` sin sesión devuelve siempre falso: no filtra nada.
- `contacto_puede_enviar()` permite saber si una dirección escribió en la última hora. Se resuelve junto con S1, al pasar el control al servidor.
- **Propuesta:** quitarle a `anon` el permiso de ejecutar las dos.

#### S8 — `/api/evento` y `/api/contacto` aceptan pedidos de cualquier origen y tamaño · **Baja**

- `/api/evento` no tiene límite: se pueden mandar miles de eventos falsos (el filtro de bots mira solo el nombre del navegador).
- Ninguna de las dos revisa la cabecera `Origin` ni corta cuerpos grandes antes de leerlos.
- **Propuesta:** revisar `Origin`, rechazar cuerpos de más de unos KB y poner un tope de eventos por visitante y por día.

#### S9 — Detalles · **Baja**

- La cabecera `X-Powered-By: Next.js` está a la vista: se apaga con `poweredByHeader: false`.
- El mail de contacto está en texto plano en la página y en los datos estructurados: es cómodo para quien quiere escribir y también para los recolectores de spam. Decisión tuya.
- Las vistas previas de Vercel piden iniciar sesión (se comprobó hoy): bien.
- "Leaked password protection" figura apagado en Supabase. Como el panel no usa contraseñas, no tiene efecto.

---

## 4. SEO

### Lo que está bien

- Lighthouse SEO: 100 de 100 en inicio y en ficha de proyecto (copia local).
- Un solo `h1` por página, títulos y descripciones propios por página, `lang` correcto en cada idioma.
- `canonical` y `hreflang` (es-AR / en) en todas las páginas, y repetidos en el sitemap.
- Sitemap con 52 direcciones y robots.txt correctos; `/admin` fuera del rastreo y con `noindex`.
- Las direcciones que no existen devuelven 404 real.
- La ficha vieja "widget-para-el-erp" redirige de forma permanente a MerchBot.
- Imagen para compartir generada para cada página. Todas las imágenes tienen texto alternativo.
- Datos estructurados de persona en el inicio.

### Hallazgos

#### O1 — Al compartir una página interna, se ve el título del inicio · **Alta**

- **Qué pasa:** las fichas, ediciones y notas definen título y descripción, pero no `openGraph`. Heredan el del layout.
- **Comprobado en vivo:** en `/proyectos/prediccion-de-churn` el `<title>` es "Predicción de churn de clientes B2B — Agustín Vignau", pero `og:title` es "Agustín Vignau — Analizo, diseño y resuelvo" y `og:type` es `website`. La dirección de `og:url` también es la del inicio.
- **Consecuencia:** en LinkedIn, WhatsApp y X, cualquier enlace a un proyecto o a una nota muestra el título y la descripción genéricos (la imagen sí es la propia). Es justo donde más se comparte un portfolio.
- **Propuesta:** en cada `generateMetadata`, sumar `openGraph` con título, descripción y dirección propios, y `type: "article"` con fecha en notas y ediciones.
- **Cómo se verifica:** el inspector de publicaciones de LinkedIn muestra el título de la ficha.

#### O2 — Faltan datos estructurados en notas, ediciones y fichas · **Media**

- Solo el inicio tiene JSON-LD (persona).
- **Propuesta:** `BlogPosting` en Escritos y en el Radar (título, fecha, autor, idioma), `BreadcrumbList` en las páginas internas y `WebSite` en el inicio.

#### O3 — Los datos de persona dicen algo distinto al objetivo actual · **Media**

- `jobTitle` es "Analista de datos y automatización de procesos" y `knowsAbout` no nombra LLMs, RAG, MCP ni agentes más que de forma general. Está solo en castellano, también en la versión en inglés.
- La descripción del sitio habla de PyMEs, inventario y comprobantes; no aparece "AI Engineer", "data analyst" ni "data science" en títulos ni descripciones.
- **Propuesta:** definir las 3 o 4 búsquedas por las que querés aparecer (por ejemplo "data analyst Buenos Aires", "AI engineer junior", "automatización para PyMEs") y alinear título del inicio, descripción y JSON-LD, con versión en inglés. Es una decisión de posicionamiento, no solo técnica.

#### O4 — `x-default` solo en el inicio · **Baja**

- Las páginas internas declaran es-AR y en, pero no `x-default`. Sumarlo en cada una y en el sitemap.

#### O5 — El sitemap no dice cuándo cambió cada proyecto · **Baja**

- 26 de 52 direcciones tienen fecha: Radar y Escritos sí, proyectos y páginas principales no. `projects.updated_at` ya existe.

#### O6 — Contenido que se contradice · **Baja**

- El inicio dice "4 sistemas en producción" y hay 3 proyectos marcados como en producción.
- La descripción de `/radar` todavía dice "IA, agentes, datos e infraestructura"; la introducción de la página ya habla del stack.

#### O7 — Pendientes fuera del código · **Media**

- Confirmar en Google Search Console que el dominio está verificado, el sitemap enviado y las páginas indexadas. No se pudo ver desde acá.
- No hay foto de perfil (ya figura en el plan): suma a la confianza y a la ficha de persona.
- Enlaces entrantes: perfil de LinkedIn, GitHub y los README de los repos apuntando al sitio.

#### O8 — Accesibilidad que toca al SEO · **Baja**

- El botón de idioma tiene un nombre accesible ("Read in English") que no contiene el texto visible ("EN"). Es el único punto que marca Lighthouse (accesibilidad 100 igual).

---

## 5. Velocidad

### Mediciones (copia local, Lighthouse 13.6)

| Página | Dispositivo | Nota | Primer contenido | Contenido principal (LCP) | Bloqueo (TBT) | Saltos (CLS) |
|---|---|---|---|---|---|---|
| Inicio | Celular (3 corridas) | 93 · 95 · 95 | 1,1 s | 2,8 s | 120–160 ms | 0 |
| Inicio | Escritorio | 100 | 0,3 s | 0,7 s | 0 ms | 0 |
| Ficha de churn | Celular | 95 | 0,8 s | 2,7 s | 120 ms | 0 |

Una primera corrida del inicio dio 47, con el servidor recién levantado. No se repitió en las tres siguientes y se descarta como arranque en frío.

Datos del sitio en vivo:

- HTML del inicio: **499 KB** (49 KB comprimido). De eso, 288 KB son datos que Next repite para el navegador.
- JavaScript: 13 archivos, 405 KB sin comprimir. Dos archivos de ~170 KB son React y Next.
- CSS: 1 archivo de 43 KB que bloquea el primer pintado (~150 ms estimados).
- Fuentes: 2 archivos, 111 KB, servidas desde el propio dominio.
- Sin scripts de terceros. Respuesta del servidor desde caché de Vercel.
- 1.982 elementos en el inicio, 1.211 de ellos puntos de los gráficos del Laboratorio.

### Hallazgos

#### V1 — El inicio manda dos veces los gráficos del Laboratorio · **Media**

- **Qué pasa:** el carrusel es un componente de cliente y las portadas del Laboratorio (5 gráficos SVG, 1.211 puntos) viajan como HTML y otra vez como datos. Por eso el inicio pesa 499 KB y una ficha 41 KB.
- **Propuesta (elegir una):**
  1. Bajar la muestra de las portadas: de 500 a ~150 órdenes normales en anomalías y un punto de cada dos en A/B y segmentos. La ficha interactiva sigue usando todos.
  2. Convertir las 5 portadas en imágenes generadas en el build y dejar el SVG vivo solo en la ficha.
  3. Que el carrusel reciba las portadas de forma que no se repitan en los datos.
- **Meta:** HTML del inicio por debajo de 200 KB.

#### V2 — El texto principal espera al JavaScript para aparecer · **Media**

- **Qué pasa:** el contenido con `data-revelar` arranca oculto y se muestra cuando corre el JavaScript. El elemento principal del inicio (el párrafo del hero) tarda 2,8 s en celular, y 2,1 s de eso son espera, no red.
- **Propuesta:** que lo que está en la primera pantalla (título y párrafo del hero, encabezado de las fichas) no dependa del JavaScript: animación solo con CSS, o sin animación. El resto de la página sigue igual.
- **Meta:** LCP en celular por debajo de 2,5 s (el umbral "bueno" de Google).

#### V3 — Las imágenes de `/portadas` y `/proyectos` no se guardan en caché · **Baja**

- Se sirven con `max-age=0`: cada visita vuelve a consultar al servidor. Como los nombres ya cambian cuando cambia la imagen (`comprobantes-2.webp`), se les puede dar caché de un año.
- Las portadas van todas con carga diferida, incluidas las primeras del carrusel. Marcar con prioridad la primera de cada carrusel si queda visible al cargar.

#### V4 — Las listas traen el cuerpo completo de cada nota · **Baja**

- `getEdiciones()` y `getEscritos()` piden todas las columnas, incluidos `body_html` en los dos idiomas, para listas que solo muestran título y resumen. Hoy son 13 filas y no se nota; crece con cada edición. Pedir solo las columnas que se usan.

#### V5 — Base de datos · **Baja**

- En `posts`, `projects` y `radar_items` hay dos políticas de lectura para usuarios con sesión; se pueden unir en una (aviso del revisor de Supabase). Solo afecta al panel.
- `eventos` no tiene limpieza: 536 filas hoy. Definir cuánto se guarda (por ejemplo 12 meses).
- Los dos índices de `leads` figuran sin uso porque hay 11 filas; son los que usa el límite de envíos. Se dejan.

#### V6 — Detalles · **Baja**

- 12 KB de JavaScript son compatibilidad con navegadores viejos; se quita declarando navegadores modernos en `browserslist`.
- En la copia local Lighthouse marca errores en consola por las portadas remotas y el script de Vercel, que solo existen en producción. Falta confirmar que la consola del sitio real está limpia.

---

## 6. Plan propuesto

Cada tanda es un deploy separado, con tu OK antes de subir.

| Tanda | Qué incluye | Esfuerzo |
|---|---|---|
| **A — Cerrar los huecos** | S1, S7, S4, S5, S9 (`X-Powered-By`) | Medio. Requiere una variable nueva en Vercel y una migración. |
| **B — Contenido seguro** | S2 (filtro de HTML y después CSP), S6 | Medio. La CSP se prueba aparte porque puede romper estilos. |
| **C — Tareas programadas** | S3 | Bajo en código; hay que revisar los conectores de cada tarea. |
| **D — Compartir y buscar** | O1, O2, O4, O5, O6, O8 | Bajo. |
| **E — Posicionamiento** | O3, O7 | Primero la decisión de qué búsquedas apuntar; después el texto. |
| **F — Velocidad** | V1, V2, V3, V4, V6 | Medio. V1 y V2 necesitan demo visual antes. |
| **G — Mantenimiento** | S8, V5, PageSpeed sobre el dominio real | Bajo. |

## 7. Decisiones tomadas (14 de noviembre)

| Tema | Decisión |
|---|---|
| S3 — Radar | Deja de publicar solo. La tarea deja **borrador** y Agustín publica desde el panel. Hecho el 14/11 en la tarea programada, que además solo puede usar una lista corta de etiquetas HTML y trata el contenido de las páginas como información, no como instrucciones. |
| S1 — Escritura en `leads` y `eventos` | Con **funciones en la base**, sin clave de servidor. Ver "Tanda A". |
| S6 — Acuse de recibo | Sale **sin el nombre ni la copia del mensaje**. |
| O3 — Posicionamiento | Se deja para el final, para definirlo bien: científico de datos que además construye los sistemas con los que una empresa sin datos empieza a tenerlos. |
| V1 — Peso del inicio | **Se deja como está.** |
| S9 — Mail visible | Se queda. |

## 8. Tanda A — preparada el 14 de noviembre

**Qué incluye**

- **S1:** `contacto_registrar` y `evento_registrar` validan, limitan e insertan. Las rutas `/api/contacto` y `/api/evento` las llaman en lugar de insertar. Después se quitan las dos políticas de inserción pública y la función `contacto_puede_enviar`. Si un mensaje es sospechoso lo decide la base, no quien llama.
- **S7:** `es_admin()` deja de poder llamarse sin sesión, y la lectura de `eventos` se acota a usuarios con sesión.
- **S6:** acuse sin nombre ni copia.
- **S4:** `npm audit fix`. Next pasa de 15.5.24 a 15.5.29 y se van el aviso crítico y los de `sharp` y `source-map-js`. Queda uno alto de `postcss`, que viene adentro de Next 15 y solo se usa al compilar los estilos propios: se resuelve al pasar a Next 16, que es una migración aparte.
- **S9:** se apaga la cabecera `X-Powered-By`.
- **Analítica:** tope de 300 eventos por visitante y 5.000 en total por día.

**Orden de publicación** (para que el formulario no tenga un rato caído)

1. Migración `20261114_a`: crea las funciones. El sitio actual sigue andando.
2. Deploy del código.
3. Probar el formulario y una visita en el sitio.
4. Migración `20261114_b`: cierra la inserción directa.

**Probado** en la base real dentro de una transacción que se deshizo (no quedó nada): mensaje válido, mail inválido, mensaje de más de 4.000 caracteres, origen desconocido, tres enlaces (queda marcado), tercer envío a la misma dirección (frenado), evento válido e inválidos, inserción directa en las dos tablas (rechazada), `es_admin()` sin sesión (rechazada), y lectura pública de proyectos, radar y escritos (sigue andando).

**Lo que esta solución no cierra.** La función se puede llamar con la clave pública sin pasar por el sitio: la base no tiene forma de distinguir al servidor de otro que llame. Quien lo haga queda sujeto a los mismos límites y validaciones, pero puede inventar el dato de origen y gastar el cupo global de 20 mensajes por hora, con lo que el formulario respondería "son varios mensajes" durante esa hora. Ya no puede marcar mensajes como atendidos, mandar textos sin tope ni saltear el filtro de sospechosos. Cerrarlo del todo requiere la clave de servidor; queda anotado por si alguna vez pasa.

**Pendiente de Agustín (S5):** en Supabase → Authentication, confirmar que el registro público está cerrado o que la confirmación de mail está activa, y borrar de `admins` la dirección que no se usa.

## 9. Tandas B (parcial) y D — 14 de noviembre

**S2, primera capa: filtro de HTML.** `src/lib/html-seguro.ts` deja pasar solo
`h2`, `h3`, `h4`, `p`, `ul`, `ol`, `li`, `code`, `pre`, `strong`, `em`, `b`,
`i`, `a`, `blockquote`, `br` y `hr`, sin atributos. Los enlaces quedan solo si
apuntan a `http(s)://`, a una ruta del sitio, a un ancla o a `mailto:`. De
`script`, `style`, `iframe`, `svg` y parecidas se saca también el contenido.
Las únicas clases que sobreviven son `fuente` y `porque`, en párrafos, que son
las que usa el contenido actual. Se aplica en las páginas públicas de Radar y
Escritos y en la vista previa del panel. Probado con 24 casos de ataque y con
dos notas reales, que salen iguales.

Queda pendiente la segunda capa, la CSP con nonces.

**O1.** Cada ficha, edición, nota y lista define su propio `openGraph` y
`twitter` (título, descripción, dirección, idioma y, en notas y ediciones,
tipo `article` con fecha). Todo sale de `metaPagina()` en `src/lib/seo.tsx`.

**O2.** `BlogPosting` y `BreadcrumbList` en notas y ediciones, `BreadcrumbList`
en fichas y `WebSite` en el inicio.

**O4.** `x-default` en todas las páginas y en el sitemap.

**O5.** El sitemap lleva la fecha de último cambio de cada ficha.

**O6.** La descripción de `/radar` habla del stack. El "4 sistemas en
producción" del inicio sigue pendiente de definir.

**O8.** El botón de idioma incluye su texto visible en el nombre accesible.

**Encontrado de paso:** una nota en inglés enlaza a `/en/escritos/…`, que no
existe (la ruta es `/en/writing/…`). Hay que corregir el enlace en esa nota.
