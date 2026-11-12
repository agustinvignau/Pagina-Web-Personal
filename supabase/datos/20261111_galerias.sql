-- Fase 10.1: las capturas de la ficha de MerchBot, Research y PressFlow, y la
-- portada nueva de Comprobantes (el mockup pasó a datos de ejemplo).
--
-- La galería se puede cargar antes del deploy: el código viejo no la lee. La
-- portada de Comprobantes, no: apunta a un archivo que llega con el deploy.
-- Por eso va al final y se aplica después de que Vercel publique.

update public.projects set gallery = '[
  {"src":"/proyectos/merchbot/01.webp","ancho":1600,"alto":485,
   "alt":"Chat de MerchBot a las 03:20 con el depósito cerrado: un reclamo por remeras manchadas queda registrado como reclamo número 1","alt_en":"MerchBot chat at 03:20 with the warehouse closed: a complaint about stained T-shirts is logged as complaint number 1",
   "pie":"A las 03:20, con el depósito cerrado, el reclamo queda registrado con un número y avisa que lo revisa una persona el próximo día hábil.","pie_en":"At 03:20, with the warehouse closed, the complaint is logged with a number and the bot says a person will review it on the next business day."},
  {"src":"/proyectos/merchbot/02.webp","ancho":1600,"alto":1105,
   "alt":"Respuesta sobre el plazo de un pedido de 150 remeras, con la sección de las políticas en que se basa","alt_en":"Answer about the lead time for an order of 150 T-shirts, citing the policy section it is based on",
   "pie":"Las preguntas de procedimiento van por RAG y la respuesta nombra la sección de las políticas de donde sale.","pie_en":"Procedure questions go through RAG, and the answer names the policy section it comes from."},
  {"src":"/proyectos/merchbot/03.webp","ancho":1600,"alto":617,
   "alt":"Panel de reclamos ordenados por prioridad, con uno marcado como alta prioridad que necesita una persona","alt_en":"Complaints panel sorted by priority, with one flagged as high priority and needing a person",
   "pie":"Cada reclamo recibe tono y una prioridad de 0 a 100 con sus motivos; los urgentes van primero.","pie_en":"Each complaint gets a tone and a 0–100 priority with its reasons; urgent ones go first."},
  {"src":"/proyectos/merchbot/04.webp","ancho":1600,"alto":1125,
   "alt":"Panel de métricas: consultas atendidas, porcentaje fuera de horario, tiempo de respuesta y consultas por hora","alt_en":"Metrics panel: queries answered, share outside business hours, response time and queries by hour",
   "pie":"El panel de métricas, con actividad de prueba. Todos los números salen de consultas a la base.","pie_en":"The metrics panel, with test activity. Every number comes from a database query."}
]'::jsonb where slug = 'merchbot';

update public.projects set gallery = '[
  {"src":"/proyectos/research/01.webp","ancho":1600,"alto":1250,
   "alt":"Reporte estratégico sobre Bitcoin: resumen ejecutivo y 100 % de confiabilidad de los datos","alt_en":"Strategic report on Bitcoin: executive summary and 100% data reliability",
   "pie":"El reporte abre con lo que importa y con cuántos de sus datos se confirmaron contra la fuente.","pie_en":"The report opens with what matters and how many of its data points were confirmed against the source."},
  {"src":"/proyectos/research/02.webp","ancho":1600,"alto":727,
   "alt":"Panel de sentimiento de la comunidad con un índice de 68 y el detalle por foro","alt_en":"Community sentiment panel with an index of 68 and a breakdown by forum",
   "pie":"El sentimiento de la comunidad, medido por foro.","pie_en":"Community sentiment, measured forum by forum."},
  {"src":"/proyectos/research/03.webp","ancho":1600,"alto":1209,
   "alt":"Gráfico de prioridades con puntaje ponderado por criterio","alt_en":"Priority chart with a weighted score per criterion",
   "pie":"Las prioridades salen de una fórmula determinista, no de la opinión del modelo.","pie_en":"Priorities come from a deterministic formula, not from the model''s opinion."},
  {"src":"/proyectos/research/04.webp","ancho":1200,"alto":1500,
   "alt":"Versión del reporte para leer sin conocimientos técnicos: qué pasó, qué cambió y qué se está mirando","alt_en":"Plain-language version of the report: what happened, what changed and what is being watched",
   "pie":"La misma corrida en una versión para leer sin saber de mercados.","pie_en":"The same run, in a version you can read without knowing markets."}
]'::jsonb where slug = 'sistema-de-research-auditable';

update public.projects set gallery = '[
  {"src":"/proyectos/pressflow/01.webp","ancho":820,"alto":715,
   "alt":"Portada del press kit generado para la artista de prueba NOCTURNA","alt_en":"Cover of the press kit generated for the test artist NOCTURNA",
   "pie":"El press kit que genera la app, para una artista de prueba.","pie_en":"The press kit the app generates, for a test artist."},
  {"src":"/proyectos/pressflow/02.webp","ancho":820,"alto":715,
   "alt":"Sección About me del press kit, con la biografía escrita por la IA","alt_en":"About me section of the press kit, with the biography written by the AI",
   "pie":"La biografía la escribe la IA a partir de las respuestas del cuestionario.","pie_en":"The AI writes the biography from the questionnaire answers."},
  {"src":"/proyectos/pressflow/03.webp","ancho":1139,"alto":572,
   "alt":"Paso de identidad del cuestionario: nombre artístico, nombre real, rol y género","alt_en":"Identity step of the questionnaire: stage name, real name, role and genre",
   "pie":"El cuestionario, en seis pasos, con consejos al costado.","pie_en":"The six-step questionnaire, with tips alongside."},
  {"src":"/proyectos/pressflow/04.webp","ancho":1139,"alto":572,
   "alt":"Paso de motivos personales: el artista elige hasta dos intereses fuera de la música","alt_en":"Personal touch step: the artist picks up to two interests outside music",
   "pie":"Los intereses que elige el artista se vuelven detalles visuales del PDF.","pie_en":"The interests the artist picks become visual details in the PDF."}
]'::jsonb where slug = 'pressflow-ai';

-- Después del deploy:
update public.projects set cover_url = '/portadas/comprobantes-2.webp'
where slug = 'carga-automatica-de-comprobantes';
