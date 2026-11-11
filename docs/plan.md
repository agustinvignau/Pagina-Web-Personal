# Registro de fases y decisiones

Del 26 de agosto al 5 de septiembre de 2026. Este archivo es la fuente de
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
| 8 | Analítica y CV público | completa |
| 9 | Diseño: cuatro fases sobre capturas anotadas | completa |
| 10 | Proyectos en carrusel visual y MerchBot | en curso: A a D hechas, falta E |
| 11 | Laboratorio interactivo | idea, sin planificar |

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

## Fase 8 — Analítica y CV público · 2-3 de septiembre

Dos capas. Vercel Web Analytics para el tráfico, y una tabla propia detrás de
`/api/evento` para lo que el plan gratis no da: clics al CV, al mail, a
LinkedIn y a GitHub, y de dónde viene cada visita.

**Sin cookies.** La huella de una visita es un hash de IP + user agent +
fecha, y la fecha hace que rote todos los días. No se guarda ninguna IP en
claro. La detección del navegador interno de las apps —Instagram, Facebook,
LinkedIn, TikTok, X, WhatsApp— sale del user agent, con prioridad utm → app →
dominio de origen, y hay filtro de bots.

**El teléfono salió del CV público.** Se editó el PDF quitando el texto, no
rehaciéndolo, para no perder el diseño. Queda una copia con teléfono fuera
del repositorio para mandar a mano.

---

## Fase 9 — Diseño · 4-5 de septiembre

Cuatro fases, todas a partir de capturas anotadas.

1. **Legibilidad y fondo.** El cuerpo pasó a tinta: había una franja clara
   debajo del pie. El contorno de los titulares pasó de píxeles fijos a `em`,
   así engorda con el cuerpo de letra en vez de quedar fino en grande.
2. **Escala de rótulos.** Un solo tamaño de rótulo hacía todo igual de
   importante. Ahora son tres: `rotulo`, `etiqueta` y `etiqueta-dato`.
3. **Estructura.** El titular del hero va primero también en escritorio; las
   bajadas, el índice del radar con una tercera columna de datos, la ficha de
   caso y la banda de Perfil en dos columnas.
4. **Verificación medida, no a ojo.** Contraste calculado sobre el DOM
   renderizado, tamaño de las zonas tocables y desbordes, en 360, 390 y 430 de
   ancho y con el user agent y el viewport del navegador interno de Instagram.
   Salieron tres cosas: sobre el oliva de la banda de Perfil no pasaba AA
   **ningún** color de texto, ni claro ni oscuro, porque ese oliva cae justo
   en el medio (se bajó a `--color-oliva-banda`); los enlaces del menú en
   celular medían 12px de alto, la mitad del mínimo de la norma; y las listas
   de definiciones tenían el valor antes que el rótulo en el marcado, así que
   un lector de pantalla las leía al revés.

Aparte de las fases: los mockups del hero pasaron a ocupar la columna derecha
entera. Agrandarlos no era ensancharlos —tenían las medidas internas en
píxeles fijos y se aplastaban—, así que pasaron a `em` con el cuerpo de letra
en `cqw`, y ahora crecen enteros y en proporción.

También se verificó el punto de las canónicas que figuraba abierto: la raíz
redirige a `www`, y las canónicas, el sitemap y `og:url` dicen `www`. Estaba
bien; no había nada que arreglar.

---

## Fase 10 — Proyectos en carrusel visual y MerchBot · planificada el 10 de noviembre

**Estado: aprobada el 10 de noviembre, después de una demo navegable del
carrusel. A a D hechas; sigue E.**

### Por qué

Casi nadie lee las fichas: se mira y se decide. Hoy Producción y Laboratorio
son listas de texto, y quien entra no ve cómo quedó ningún proyecto. La meta
de esta fase es que cada proyecto **se vea**: una portada que muestre el
producto real, o una reproducción fiel, en un carrusel por sección.

En paralelo, MerchBot está terminado con el repositorio público, y hoy figura
dos veces: como "Widget para el ERP" (publicado, subtítulo "evolución de
MerchBot") y como "Bot de inventario en Telegram" (oculto, su versión
original).

### Decisiones ya tomadas

- **Producción y Laboratorio siguen separados**, cada uno con su carrusel:
  Producción en fondo claro y Laboratorio en tinta, como hoy.
- **La imagen es la protagonista de la tarjeta.** El texto se reduce a
  título, una línea de qué es y la cifra de impacto. El detalle sigue en la
  ficha.
- **MerchBot y el Widget se fusionan en una sola ficha, "MerchBot".** Cuenta
  la versión terminada y su uso con el equipo de compras, y lleva el link al
  repo público. El bot de Telegram sigue oculto, y la ficha lo nombra como su
  origen.
- **Estado de MerchBot: en producción.** La ficha aclara que el repositorio
  público está preparado para correr en local con Docker. Así el sitio y el
  README del repo no se contradicen.
- **Las portadas de Research y PressFlow salen de capturas de Agustín.** Hasta
  que estén, esas tarjetas usan una portada de reserva con el título, y nada
  queda roto.
- **El carrusel es diseño propio**, con la paleta, la tipografía y el
  movimiento que el sitio ya tiene. No hay una página de referencia.
- **Sin librerías nuevas:** *scroll-snap* nativo y un componente cliente
  chico.

### A — Datos

1. Migración `supabase/migrations/20261110_portadas_y_estado.sql`, que suma a
   `projects`:
   - `cover_url`, `cover_alt` y `cover_alt_en`: la portada y su texto
     alternativo, con el mismo patrón de traducción que el resto.
   - `status`: el estado visible (`en_produccion`, `terminado`, `en_desarrollo`).
     El rótulo en cada idioma se resuelve en `i18n.ts`.
2. Bucket público `proyectos` en Storage. Se lee sin sesión, y solo
   `es_admin()` puede escribir.
3. `types.ts` y `localizarProyecto`: los campos nuevos, con caída al
   castellano.
4. `/admin` → `SeccionProyectos`: subir o cambiar la portada y elegir el
   estado.

Solo suma columnas: lo publicado sigue funcionando igual mientras las
columnas estén vacías.

**Hecho el 10 de noviembre.** Migración aplicada en producción. El estado
quedó cargado en los cinco de Producción: Génesis, MerchBot y Comprobantes
en producción, Research como uso personal y PressFlow como producto propio.
Laboratorio queda sin estado. Al estado se le sumaron `uso_personal` y
`producto_propio`, que salieron de la demo. La portada se sube con un nombre
nuevo cada vez, para que la caché no muestre la vieja, y la anterior se
borra recién cuando la nueva quedó guardada.

> **Visto de paso, sin tocar:** el linter de Supabase marca que `anon` puede
> ejecutar `es_admin()` y `contacto_puede_enviar()`. La fase 7 dice que
> `es_admin()` quedó fuera del alcance de los anónimos, y hoy no es así. Es
> inofensivo, porque para un anónimo devuelve `false`, pero el registro y la
> base no coinciden. Se decide aparte.

### B — El carrusel

Un componente nuevo, `CarruselProyectos`, que reemplaza a `ProyectoFila` en
Producción y a la lista de `Laboratorio`.

- Tarjeta con portada grande, en proporción 16:10 en escritorio y 4:5 en
  celular, para que la pantalla del producto se lea. Debajo van el número, el
  título, la línea de qué es y la cifra.
- La insignia de destacado y el estado van sobre la imagen.
- Se desliza con el dedo, la rueda horizontal, arrastrando con el mouse o con
  las flechas. Lleva una barra de progreso con el formato de la sección
  (`01 / 05`).
- En escritorio se ve la tarjeta siguiente asomando, así se entiende que
  sigue.
- Hover: la portada se acerca apenas y el cursor propio dice "Ver".
- Accesible: lista semántica, foco visible, flechas de teclado, y con
  `prefers-reduced-motion` el desplazamiento no se anima.
- Hay que probarlo en el navegador interno de Instagram, igual que en la
  fase 9.

**Hecho el 11 de noviembre.** `src/components/carrusel/`: `Carril` es el
único componente de cliente (cuál se ve, flechas, teclado, arrastre) y
`TarjetaProyecto` se arma en el servidor. Las portadas pasan por `next/image`
desde el bucket, así que llegan achicadas al ancho de la tarjeta. Verificado
con datos fijos en 1440 y en iPhone 13: sin desborde horizontal, el contador
avanza con la flecha y la portada de reserva entra entera.

Tres cambios respecto de lo planeado:
- **Génesis y Comprobantes van como imagen, no como componente en vivo.**
  `PantallaGenesis` y `PantallaFacturas` están medidas en `rem` con un ancho
  mínimo de 62rem y tienen scroll horizontal propio. Achicarlas para que
  entren en una tarjeta pedía escalarlas con JavaScript, y su scroll
  peleaba con el arrastre del carril. La portada es una captura de esos
  mismos componentes. Si cambia el mockup, hay que volver a sacarla.
- **Se sumó `cover_focus`** (migración `20261111_portada_foco.sql`). En
  celular la portada se agranda 1,75 veces para que se lea, y el recorte
  parte arriba a la izquierda en las capturas de sistemas y al centro en
  una pieza centrada, como el press kit de PressFlow.
- **Sin segunda imagen al pasar el mouse.** La demo la tenía para MerchBot,
  Research y PressFlow, pero sumaba una columna más y no existe en el
  celular. Al pasar el mouse la portada se acerca apenas.

`ProyectoFila.tsx` quedó sin uso. Se borra en el commit de la fase.

### C — Las portadas

| Proyecto | Portada |
|---|---|
| MerchBot | captura real del repo (`docs/img/web-24-7.png`, panel y voz) |
| Génesis | `PantallaGenesis`, el mockup grande que ya existe |
| Comprobantes | `PantallaFacturas`, ídem |
| Research con agentes | captura de Agustín |
| PressFlow AI | captura de Agustín |
| Los 5 de Laboratorio | el gráfico principal de cada estudio, como componente propio con los datos sintéticos del repo |

En Génesis y Comprobantes la portada es el componente renderizado en vivo, no
una imagen: así no se desfasan si cambia el mockup.

El gráfico de Laboratorio se arma como componente (SVG), no como PNG, a
propósito: en la fase 11 se le agregan controles encima sin rehacerlo.
- Forecasting: la serie real contra el pronóstico, con su banda.
- Anomalías: la dispersión con las órdenes marcadas.
- Churn: el ranking de riesgo.
- Segmentación: los clusters.
- A/B: la diferencia con su intervalo.

Las capturas de Agustín van en `capturas-proyectos/`, dentro de esta carpeta.
Se suma a `.gitignore` y desde ahí se suben al bucket.

**Hecho el 11 de noviembre.**

- **Las cinco portadas de Producción viven en `public/portadas/`**, no en el
  bucket. Desde acá no se puede subir al bucket sin la clave de servicio, y
  así quedan versionadas con el código. `cover_url` acepta las dos cosas: una
  ruta local o una URL del bucket. Lo que se suba después desde el panel va
  al bucket y reemplaza a la local. El panel nunca borra un archivo local.
- **Los gráficos del Laboratorio** están en
  `src/components/carrusel/GraficoLab.tsx`. Salen de
  `src/lib/laboratorio-datos.ts`, que genera
  `scripts/datos_laboratorio.py` a partir de los CSV procesados de cada repo.
  Ninguna cifra está escrita a mano.
- **Churn cambió de forma.** La demo mostraba los diez clientes de más riesgo,
  pero con los datos reales los diez superan el umbral y la línea de corte
  quedaba escondida. Ahora es la distribución de los 146 clientes con el
  umbral marcado y, dentro de cada barra, los que de verdad se fueron. Ahí
  se ve que con 0,50 la mitad de los que se van quedan abajo del umbral.
  Eso es justo lo que la fase 11 va a dejar explorar.
- En A/B la unidad es sucursal-día, igual que en el estudio: 120 días por
  variante, 18,3 % contra 22,4 %.

### D — MerchBot

1. **La ficha.** Se reescribe la fila del Widget en ES y EN: título "MerchBot",
   link al repo, estado en producción, aclaración del deploy local y el texto
   actualizado al cierre del repo.
2. **El slug pasa de `widget-para-el-erp` a `merchbot`.** Lleva una
   redirección permanente en `next.config.ts` para las dos rutas, ES y EN, así
   no se rompe ningún enlace ya compartido. El sitemap se regenera solo.
3. **El escrito**, en ES y EN, queda en **borrador**:
   - qué resuelve: el stock en lenguaje natural, a cualquier hora, sin ir al
     depósito;
   - las decisiones: los números salen de SQL y el modelo solo redacta; RAG
     solo para texto libre; solo lectura sobre el negocio;
   - qué aprendió: medir en vez de suponer (28 casos, RAG y sentimiento),
     depender de un proveedor externo, y el VADER descartado (42 % contra
     88 %);
   - enlaces a los escritos anteriores: el de embeddings contra BM25 (25/10)
     y el de los saldos del ERP (06/10).

   Agustín lo publica desde el panel, como siempre.

**Hecho el 11 de noviembre.**

- **Escrito:** `2026-11-11-merchbot-terminado`, en borrador, en ES y EN.
  Enlaza a los escritos del 4/10 y del 25/10 y al repo. Todo lo que dice sale
  del README, de `docs/REFLEXION.md` y de los escritos anteriores. Lo publica
  Agustín desde el panel.
- **Ficha:** el texto nuevo está en `supabase/datos/20261111_merchbot.sql`.
  **No se aplicó todavía, a propósito.** Cambia el slug, así que si se aplica
  antes del deploy, la URL vieja da 404 hasta que llegue la redirección. Va
  justo antes del push, en E.
- **Redirección:** en `next.config.ts`, permanente, en las dos rutas.

### E — Verificación

- `npm run typecheck` y `npm run build`.
- Capturas a 360, 390 y 430 de ancho, en escritorio y con el user agent de
  Instagram. Contraste medido sobre el texto encima de las portadas.
- Comprobar que la redirección del slug viejo responde 308 en las dos rutas.
- Pasarle las capturas a Agustín. **El push a `main` (deploy) va solo con su
  OK.**

### Fuera de esta fase

- **Fase 11, Laboratorio interactivo:** controles sobre cada modelo. Mover el
  umbral del churn y ver precisión y recall, cambiar el nivel de servicio y
  ver el stock de seguridad, la cantidad de clusters, el tamaño de muestra del
  A/B. Se planifica cuando cierre la 10.
- Actualizar el README: hoy dice 9 proyectos, y "Lo que queda abierto" dice
  que no hay escritos publicados (hay 5). Se corrige al cerrar esta fase.

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

**Método**

- **Medir antes de arreglar.** De los defectos reportados sobre capturas, tres
  se midieron y no eran defectos: dos separaciones que parecían distintas eran
  idénticas, y un espacio "de más" era una línea de estado reservada. Se
  dijeron como tales en vez de inventarles un arreglo.
- El contenedor de verificación no llega a Supabase, así que el índice del
  radar y las fichas de proyecto solo se pueden comprobar en producción.

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
   La tarea de Escritos nunca se disparó: se creó un martes y su primer
   disparo es el lunes 7 de septiembre. Depende de que la entrevista del
   domingo esté contestada.
2. **Sin foto de perfil.**
3. **La entrada del radar del 17-24 de agosto** tiene datos genéricos en la
   tercera columna —Período, Novedades, Foco— en lugar de métricas. No es un
   error de código: la automatización empezó a generar datos mejores después.
   Se arregla editando esa entrada.
4. **Los mockups del hero podrían pasar de barras a series de líneas.** Si se
   hace, hay que tocar también `PantallaGenesis`, que es la versión grande de
   las fichas de proyecto, para que no queden distintas.
