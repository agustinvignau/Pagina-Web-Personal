-- Fase 10, D: la ficha "Widget para el ERP" pasa a ser "MerchBot".
--
-- No es una migración: cambia contenido. Se aplica JUSTO ANTES del push que
-- trae la redirección de next.config.ts. Si se aplica antes, la URL vieja
-- (/proyectos/widget-para-el-erp) da 404 hasta que llegue el deploy.
--
-- MerchBot es el proyecto entero: la versión que usa compras dentro del ERP
-- y el repositorio público, que es la misma idea con datos ficticios y está
-- preparado para correr en local con Docker. El bot de Telegram oculto
-- (bot-de-inventario-en-telegram) queda como su origen y no se toca.
update public.projects set
  slug = 'merchbot',
  title = 'MerchBot',
  title_en = 'MerchBot',
  subtitle = 'Asistente de stock y reclamos',
  subtitle_en = 'Stock and complaints assistant',
  summary = 'Asistente con IA que contesta en lenguaje natural sobre stock, pedidos, reposición y políticas, y registra reclamos a cualquier hora. Los números salen de consultas SQL; el modelo solo redacta.',
  summary_en = 'An AI assistant that answers plain-language questions about stock, orders, restocking and policies, and logs complaints at any hour. Every number comes from a SQL query; the model only writes the reply.',
  problem = 'Para saber si había stock había que ir al depósito o preguntarle a alguien, y las mismas preguntas se repetían todos los días. Los reclamos llegaban por canales sueltos y se perdían antes de convertirse en mejoras.',
  problem_en = 'Checking stock meant walking to the warehouse or asking someone, and the same questions came up every day. Complaints arrived through scattered channels and were lost before they could turn into improvements.',
  solution = 'Nació como bot de Telegram que le pasaba el stock al modelo en el prompt. Hoy Gemini decide entre nueve funciones, el código corre la consulta y la respuesta sale de la base. Las preguntas de procedimientos van por RAG sobre el documento de políticas, con BM25 de respaldo. Es de solo lectura sobre el negocio: lo único que escribe son reclamos, a los que les calcula tono y una prioridad de 0 a 100 con sus motivos. Tiene voz, panel de métricas, login y límites de uso.',
  solution_en = 'It started as a Telegram bot that put the stock in the model''s prompt. Today Gemini picks one of nine functions, the code runs the query and the answer comes from the database. Questions about procedures go through RAG over the policy document, with BM25 as a fallback. It is read-only on the business: the only thing it writes is complaints, each scored for tone and given a 0–100 priority with its reasons. It has voice, a metrics panel, login and rate limits.',
  outcome = 'En producción dentro del ERP con el equipo de compras, que consulta stock sin ir al depósito. El repositorio público tiene la misma idea con datos ficticios, preparado para correr en local con Docker; el deploy 24/7 quedó como trabajo futuro. Se mide con 28 casos del asistente, 25 preguntas del RAG y un set de sentimiento donde VADER acertó 42 % contra 88 % del léxico propio. Si Gemini se queda sin cuota, sigue con modelos de respaldo.',
  outcome_en = 'In production inside the ERP with the purchasing team, who check stock without walking to the warehouse. The public repository holds the same idea with fictional data, set up to run locally with Docker; round-the-clock deployment is left as future work. It is measured with 28 assistant cases, 25 RAG questions and a sentiment set where VADER scored 42% against 88% for the custom lexicon. If Gemini runs out of quota, it falls back to backup models.',
  links = jsonb_build_object('repo', 'https://github.com/agustinvignau/merchbot'),
  tags = array['en producción', 'LLM', 'function calling', 'RAG', 'evals'],
  tech = array['Python', 'Gemini', 'Function calling', 'RAG', 'FastAPI', 'Docker'],
  cover_alt = 'Panel de MerchBot: consultas atendidas, porcentaje fuera de horario, tiempo de respuesta y consultas por hora del día',
  cover_alt_en = 'MerchBot dashboard: queries answered, share outside business hours, response time and queries by hour of day'
where slug = 'widget-para-el-erp';
