export type Lang = "es" | "en";

export const IDIOMAS: Lang[] = ["es", "en"];

/**
 * El castellano vive en la raíz y el inglés bajo /en. Se hizo así a propósito:
 * mover el español a /es habría roto todas las URLs ya publicadas.
 */
export function ruta(lang: Lang, camino: string) {
  const limpio = camino.startsWith("/") ? camino : `/${camino}`;
  if (lang === "es") return limpio === "/" ? "/" : limpio;
  return limpio === "/" ? "/en" : `/en${limpio}`;
}

export function rutaProyecto(lang: Lang, slug: string) {
  return lang === "es" ? `/proyectos/${slug}` : `/en/projects/${slug}`;
}

export function rutaRadar(lang: Lang, slug?: string) {
  const base = lang === "es" ? "/radar" : "/en/radar";
  return slug ? `${base}/${slug}` : base;
}

export function rutaEscrito(lang: Lang, slug?: string) {
  const base = lang === "es" ? "/escritos" : "/en/writing";
  return slug ? `${base}/${slug}` : base;
}

/** La misma página en el otro idioma, para el conmutador del menú. */
export function otroIdioma(lang: Lang): Lang {
  return lang === "es" ? "en" : "es";
}

type Textos = {
  nav: { produccion: string; laboratorio: string; perfil: string; radar: string; escritos: string; contacto: string };
  ciudad: string;
  hero: {
    rol: string;
    linea1: string;
    linea2: string;
    linea3: string;
    bajada: string;
    verProduccion: string;
    descargarCV: string;
    scroll: string;
    pie: string[];
  };
  produccion: {
    eyebrow: string;
    titulo1: string;
    titulo2: string;
    bajada: string;
    insignia: string;
    sinDatos: string;
  };
  laboratorio: { eyebrow: string; titulo1: string; titulo2: string; bajada: string };
  perfil: {
    eyebrow: string;
    experienciaActual: string;
    rolActual: string;
    descripcionActual: string;
    hitos: string[];
    antes: string;
    formacion: string;
    carrera: string;
    carreraDonde: string;
    materias: string;
    promedio: string;
    licenciatura: string;
    trayectoria: { periodo: string; titulo: string; detalle: string; href?: string }[];
    cursos: { titulo: string; donde: string }[];
  };
  contacto: {
    eyebrow: string;
    titulo1: string;
    titulo2: string;
    bajada: string;
    nombre: string;
    mail: string;
    empresa: string;
    mensaje: string;
    enviar: string;
    enviando: string;
    exito: string;
    errorGenerico: string;
    renovatio: string;
    renovatioLink: string;
  };
  caso: { caso: string; estudio: string; produccion: string; laboratorio: string; vista: string; problema: string; solucion: string; resultado: string; herramientas: string; volver: string; repo: string };
  radar: {
    eyebrow: string;
    titulo1: string;
    titulo2: string;
    bajada: string;
    vacio: string;
    edicion: string;
    comoSeArma: string;
    origen: string;
    todas: string;
  };
  escritos: {
    eyebrow: string;
    titulo1: string;
    titulo2: string;
    bajada: string;
    vacio: string;
    articulo: string;
    lectura: string;
    todos: string;
  };
  footer: { mail: string; linkedin: string; github: string; cv: string; ubicacion: string };
};

const ES: Textos = {
  nav: { produccion: "Producción", laboratorio: "Laboratorio", perfil: "Perfil", radar: "Radar", escritos: "Escritos", contacto: "Contacto" },
  ciudad: "Buenos Aires",
  hero: {
    rol: "Técnico Superior en Ciencia de Datos e IA",
    linea1: "Analizo,",
    linea2: "Diseño",
    linea3: "Y resuelvo.",
    bajada:
      "Diseño sistemas que sacan a las PyMEs de la planilla: inventario, carga automática de comprobantes y reportes sobre los que se decide. Entiendo el problema, armo el proyecto y lo dejo funcionando.",
    verProduccion: "Ver producción",
    descargarCV: "Descargar CV",
    scroll: "Scroll",
    pie: ["4 sistemas en producción", "5 estudios", "896 SKUs bajo gestión"],
  },
  produccion: {
    eyebrow: "01 — Producción",
    titulo1: "Sistemas que",
    titulo2: "quedan funcionando",
    bajada:
      "Lo que corre hoy en empresas reales, con usuarios que dependen de que no se caiga. Cada ficha abre el caso: el problema, la decisión de diseño y qué cambió después.",
    insignia: "Proyecto insignia",
    sinDatos: "Sin conexión a la base de datos",
  },
  laboratorio: {
    eyebrow: "02 — Laboratorio",
    titulo1: "Cómo pienso",
    titulo2: "un problema",
    bajada:
      "Cinco estudios de punta a punta con datos sintéticos, inspirados en el taller de producción y el depósito mayorista donde trabajé. Los datos son inventados a propósito, para poder mostrar el método sin exponer a ninguna empresa.",
  },
  perfil: {
    eyebrow: "03 — Perfil",
    experienciaActual: "Experiencia actual",
    rolActual: "Datos y automatización de procesos",
    descripcionActual:
      "Construí el módulo de reportes sobre el que la empresa decide sus compras y el sistema de inventario y pedidos que usa todos los días. Diseñé el modelo de datos, definí las alertas de stock y automaticé la consolidación entre sectores productivos.",
    hitos: ["Modelo de datos", "Reportes de compra", "Historial de precios", "Alertas de stock", "Ruteo de órdenes"],
    antes: "Antes",
    formacion: "Formación",
    carrera: "Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial",
    carreraDonde: "IFTS N°18 · 2025 — 2027",
    materias: "Materias",
    promedio: "Promedio",
    licenciatura: "Licenciatura",
    trayectoria: [
      { periodo: "2025 — hoy", titulo: "Cofundador — Renovatio", detalle: "Consultoría de datos y automatización. Diseño, desarrollo y la web de la consultora.", href: "https://renovatio.ar" },
      { periodo: "2022 — 2024", titulo: "Control de stock — Maxiconsumo S.A.", detalle: "Auditoría de inventario con terminales PDT sobre más de 10.000 SKUs. De acá sale el criterio operativo." },
      { periodo: "2021 — 2022", titulo: "Encargado de turno — Heladería 1952", detalle: "Caja, arqueos, proveedores y coordinación de un equipo de tres personas." },
    ],
    cursos: [
      { titulo: "Especialización en Data Analytics", donde: "Coderhouse · 2025" },
      { titulo: "Certificación en Tableau", donde: "Coderhouse · 2024" },
      { titulo: "Inglés — clases particulares", donde: "En curso" },
    ],
  },
  contacto: {
    eyebrow: "04 — Contacto",
    titulo1: "Contame",
    titulo2: "el problema",
    bajada:
      "Si algo en tu operación se resuelve con planillas y paciencia, probablemente se pueda resolver mejor. Escribime qué está pasando y te digo con qué lo atacaría.",
    nombre: "Nombre",
    mail: "Mail",
    empresa: "Empresa",
    mensaje: "Qué necesitás",
    enviar: "Enviar mensaje",
    enviando: "Enviando…",
    exito: "Recibido. Te respondo dentro de las próximas 48 horas.",
    errorGenerico: "No hubo respuesta del servidor. Probá de nuevo.",
    renovatio: "Si lo que buscás es una consultoría con equipo detrás, lo trabajo desde",
    renovatioLink: "Renovatio",
  },
  caso: {
    caso: "Caso", estudio: "Estudio", produccion: "Producción", laboratorio: "Laboratorio",
    vista: "Vista del sistema · datos de demostración",
    problema: "El problema", solucion: "Qué construí", resultado: "Qué cambió",
    herramientas: "Herramientas", volver: "← Volver al portfolio", repo: "Ver el repositorio",
  },
  radar: {
    eyebrow: "Radar tecnológico",
    titulo1: "Qué se movió",
    titulo2: "estas dos semanas",
    bajada:
      "Sigo los lanzamientos y cambios de IA, agentes, machine learning e infraestructura. Un rastreo automático los junta y cada quince días un agente los consolida y publica la edición. Está automatizado de punta a punta: es el mismo tipo de sistema que construyo para otros.",
    vacio: "La primera edición está en revisión.",
    edicion: "Radar tecnológico · edición",
    comoSeArma:
      "Un rastreo automático deja las novedades y sus enlaces oficiales en un documento. Los días 1 y 16 una tarea programada lo consolida, redacta la edición en los dos idiomas y la publica sin que yo intervenga. Recibo el aviso cuando salió, y desde ahí corrijo o bajo la edición si hace falta.",
    origen: "Origen",
    todas: "← Todas las ediciones",
  },
  escritos: {
    eyebrow: "Escritos",
    titulo1: "Lo que voy",
    titulo2: "entendiendo",
    bajada:
      "Notas sobre datos, automatización y sistemas que tienen que funcionar en empresas reales. Escribo cuando algo me costó entenderlo y sospecho que a otro le va a costar igual.",
    vacio: "Todavía no hay nada publicado.",
    articulo: "Escrito",
    lectura: "min de lectura",
    todos: "← Todos los escritos",
  },
  footer: { mail: "Mail", linkedin: "LinkedIn", github: "GitHub", cv: "CV", ubicacion: "Buenos Aires, Argentina" },
};

const EN: Textos = {
  nav: { produccion: "Production", laboratorio: "Lab", perfil: "Profile", radar: "Radar", escritos: "Writing", contacto: "Contact" },
  ciudad: "Buenos Aires",
  hero: {
    rol: "Data Science & AI Technician",
    linea1: "I analyse,",
    linea2: "Design",
    linea3: "And solve.",
    bajada:
      "I build systems that get small businesses out of the spreadsheet: inventory, automated invoice capture, and the reports decisions actually get made on. I understand the problem, build the project, and leave it running.",
    verProduccion: "See production",
    descargarCV: "Download CV",
    scroll: "Scroll",
    pie: ["4 systems in production", "5 studies", "896 SKUs under management"],
  },
  produccion: {
    eyebrow: "01 — Production",
    titulo1: "Systems that",
    titulo2: "keep running",
    bajada:
      "What runs today in real companies, with users who depend on it staying up. Each entry opens the case: the problem, the design decision, and what changed afterwards.",
    insignia: "Flagship project",
    sinDatos: "No connection to the database",
  },
  laboratorio: {
    eyebrow: "02 — Lab",
    titulo1: "How I think",
    titulo2: "through a problem",
    bajada:
      "Five end-to-end studies on synthetic data, drawn from the production workshop and the wholesale warehouse where I worked. The data is invented on purpose, so the method can be shown without exposing any company.",
  },
  perfil: {
    eyebrow: "03 — Profile",
    experienciaActual: "Current role",
    rolActual: "Data and process automation",
    descripcionActual:
      "I built the reporting module the company bases its purchasing on, and the inventory and orders system it uses every day. I designed the data model, defined the stock alerts, and automated the handoff between production areas.",
    hitos: ["Data model", "Purchasing reports", "Price history", "Stock alerts", "Order routing"],
    antes: "Before",
    formacion: "Education",
    carrera: "Higher Technical Degree in Data Science and Artificial Intelligence",
    carreraDonde: "IFTS N°18 · 2025 — 2027",
    materias: "Courses",
    promedio: "GPA",
    licenciatura: "Bachelor's",
    trayectoria: [
      { periodo: "2025 — now", titulo: "Co-founder — Renovatio", detalle: "Data and automation consultancy. Design, development, and the firm's own website.", href: "https://renovatio.ar" },
      { periodo: "2022 — 2024", titulo: "Stock control — Maxiconsumo S.A.", detalle: "Inventory auditing with handheld terminals across more than 10,000 SKUs. This is where the operational judgement comes from." },
      { periodo: "2021 — 2022", titulo: "Shift manager — Heladería 1952", detalle: "Cash handling, reconciliation, suppliers, and coordinating a team of three." },
    ],
    cursos: [
      { titulo: "Data Analytics specialisation", donde: "Coderhouse · 2025" },
      { titulo: "Tableau certification", donde: "Coderhouse · 2024" },
      { titulo: "English — private lessons", donde: "Ongoing" },
    ],
  },
  contacto: {
    eyebrow: "04 — Contact",
    titulo1: "Tell me",
    titulo2: "the problem",
    bajada:
      "If something in your operation is being held together with spreadsheets and patience, it can probably be solved better. Write me what is going on and I will tell you how I would approach it.",
    nombre: "Name",
    mail: "Email",
    empresa: "Company",
    mensaje: "What you need",
    enviar: "Send message",
    enviando: "Sending…",
    exito: "Got it. I will reply within 48 hours.",
    errorGenerico: "No response from the server. Please try again.",
    renovatio: "If what you need is a consultancy with a team behind it, I work through",
    renovatioLink: "Renovatio",
  },
  caso: {
    caso: "Case", estudio: "Study", produccion: "Production", laboratorio: "Lab",
    vista: "System view · demo data",
    problema: "The problem", solucion: "What I built", resultado: "What changed",
    herramientas: "Tools", volver: "← Back to the portfolio", repo: "View the repository",
  },
  radar: {
    eyebrow: "Tech radar",
    titulo1: "What moved",
    titulo2: "these two weeks",
    bajada:
      "I follow releases and changes across AI, agents, machine learning, and infrastructure. An automated sweep collects them, and every two weeks an agent consolidates and publishes the edition. It runs end to end on its own: the same kind of system I build for other people.",
    vacio: "The first edition is under review.",
    edicion: "Tech radar · edition",
    comoSeArma:
      "An automated sweep collects releases and their official links into a document. On the 1st and the 16th a scheduled task consolidates it, writes the edition in both languages, and publishes it with no input from me. I get a notice once it is out, and correct or pull the edition from there if needed.",
    origen: "Source",
    todas: "← All editions",
  },
  escritos: {
    eyebrow: "Writing",
    titulo1: "What I am",
    titulo2: "working out",
    bajada:
      "Notes on data, automation, and systems that have to hold up inside real companies. I write when something took me effort to understand and I suspect it will take someone else the same.",
    vacio: "Nothing published yet.",
    articulo: "Article",
    lectura: "min read",
    todos: "← All writing",
  },
  footer: { mail: "Email", linkedin: "LinkedIn", github: "GitHub", cv: "CV", ubicacion: "Buenos Aires, Argentina" },
};

export function textos(lang: Lang): Textos {
  return lang === "en" ? EN : ES;
}
