/*
  Filtro del HTML de Radar y Escritos (auditoría del 13/11, hallazgo S2).

  El cuerpo de cada edición y de cada nota se guarda como HTML en la base y
  se muestra tal cual. Parte de ese HTML lo redacta un agente que lee páginas
  de terceros, así que antes de mostrarlo pasa por acá: quedan solo las
  etiquetas de una lista corta, sin atributos, y los enlaces solo si apuntan
  a una dirección web o a una ruta del sitio.

  No usa el DOM, así sirve igual en el servidor (el sitio) y en el navegador
  (el panel). Es una lista de lo permitido, no de lo prohibido: lo que no
  está en la lista se saca, y de las etiquetas que traen contenido ejecutable
  o ajeno al texto se saca también lo de adentro.
*/

const PERMITIDAS = new Set([
  "h2", "h3", "h4", "p", "ul", "ol", "li", "code", "pre",
  "strong", "em", "b", "i", "a", "blockquote", "br", "hr",
]);

const SIN_CIERRE = new Set(["br", "hr"]);

/* De estas no queda ni la etiqueta ni lo que tienen adentro. */
const CON_CONTENIDO_AFUERA = new Set([
  "script", "style", "iframe", "object", "embed", "noscript", "template",
  "svg", "math", "textarea", "title", "xmp", "noembed", "noframes", "select",
  "form", "button", "audio", "video", "canvas", "head",
]);

/* Las únicas clases que usa el contenido: van solo en párrafos. */
const CLASES = new Set(["fuente", "porque"]);

const NOMBRADAS: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">",
  colon: ":", tab: "\t", newline: "\n", sol: "/", num: "#",
};

function decodificar(valor: string) {
  return valor.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);?/gi, (todo, cuerpo: string) => {
    if (cuerpo[0] === "#") {
      const n = cuerpo[1].toLowerCase() === "x" ? parseInt(cuerpo.slice(2), 16) : parseInt(cuerpo.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
    }
    return NOMBRADAS[cuerpo.toLowerCase()] ?? todo;
  });
}

function escaparAtributo(valor: string) {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function atributo(resto: string, nombre: string) {
  const m = new RegExp(`(?:^|\\s)${nombre}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i").exec(resto);
  return m ? (m[1] ?? m[2] ?? m[3] ?? "") : null;
}

/** Solo direcciones web, rutas del sitio, anclas y mailto. */
function enlaceSeguro(crudo: string) {
  // Los navegadores ignoran espacios y caracteres de control dentro del
  // esquema ("java\nscript:"): se sacan antes de mirar a dónde apunta.
  const limpio = decodificar(crudo).replace(/[\u0000-\u0020\u007f-\u009f\u200b-\u200f\u2028\u2029\ufeff]/g, "");
  if (/^(https?:\/\/|mailto:|#)/i.test(limpio) || /^\/(?![\/\\])/.test(limpio)) return limpio;
  return null;
}

export function htmlSeguro(html: string | null | undefined): string {
  if (!html) return "";

  const piezas = html.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|<|[^<]+/g) ?? [];
  const abiertas: string[] = [];
  let salteando: string | null = null;
  let salida = "";

  for (const pieza of piezas) {
    const etiqueta = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>$/.exec(pieza);

    if (salteando) {
      if (etiqueta && etiqueta[1] === "/" && etiqueta[2].toLowerCase() === salteando) salteando = null;
      continue;
    }

    if (!etiqueta) {
      // Texto, un comentario (se saca) o un "<" suelto (se escapa).
      if (pieza.startsWith("<!--")) continue;
      salida += pieza === "<" ? "&lt;" : pieza;
      continue;
    }

    const cierre = etiqueta[1] === "/";
    const nombre = etiqueta[2].toLowerCase();
    const resto = etiqueta[3];

    if (CON_CONTENIDO_AFUERA.has(nombre)) {
      if (!cierre && !/\/\s*$/.test(resto)) salteando = nombre;
      continue;
    }
    if (!PERMITIDAS.has(nombre)) continue;

    if (cierre) {
      const i = abiertas.lastIndexOf(nombre);
      if (i === -1 || SIN_CIERRE.has(nombre)) continue;
      // Cierra también lo que quedó abierto adentro, para no dejar el
      // resto de la página metido en una etiqueta mal cerrada.
      while (abiertas.length > i) salida += `</${abiertas.pop()}>`;
      continue;
    }

    if (SIN_CIERRE.has(nombre)) {
      salida += `<${nombre}>`;
      continue;
    }

    if (nombre === "a") {
      const href = atributo(resto, "href");
      const seguro = href === null ? null : enlaceSeguro(href);
      salida += seguro ? `<a href="${escaparAtributo(seguro)}" rel="noopener noreferrer">` : "<a>";
    } else if (nombre === "p") {
      const clases = (atributo(resto, "class") ?? "").split(/\s+/).filter((c) => CLASES.has(c));
      salida += clases.length ? `<p class="${clases.join(" ")}">` : "<p>";
    } else {
      salida += `<${nombre}>`;
    }
    abiertas.push(nombre);
  }

  while (abiertas.length) salida += `</${abiertas.pop()}>`;
  return salida;
}
