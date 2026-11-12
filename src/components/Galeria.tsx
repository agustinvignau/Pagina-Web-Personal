import Image from "next/image";
import type { Captura } from "@/lib/types";

/**
 * Las capturas de la ficha. La primera va grande, porque es la que cuenta
 * qué es el proyecto; las demás, debajo, de a tres en escritorio. Cada una
 * lleva su epígrafe: una captura sin explicar obliga a adivinar qué mirar.
 */
export default function Galeria({ capturas }: { capturas: Captura[] }) {
  if (capturas.length === 0) return null;
  const [principal, ...resto] = capturas;
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Figura captura={principal} sizes="(min-width: 768px) 90vw, 100vw" prioridad tope />
      {resto.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {resto.map((c) => (
            <Figura key={c.src} captura={c} sizes="(min-width: 768px) 30vw, 100vw" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Figura({
  captura: c,
  sizes,
  prioridad = false,
  tope = false,
}: {
  captura: Captura;
  sizes: string;
  prioridad?: boolean;
  tope?: boolean;
}) {
  // La principal no crece más que su ancho real: una captura angosta estirada
  // a todo el ancho de la pantalla se vuelve un afiche borroso.
  return (
    <figure
      data-revelar
      className="mx-auto flex w-full flex-col gap-3"
      style={tope ? { maxWidth: c.ancho } : undefined}
    >
      <a
        href={c.src}
        target="_blank"
        rel="noopener"
        data-cursor="Ampliar"
        className="block overflow-hidden border-[1.5px] border-tinta bg-superficie"
      >
        <Image
          src={c.src}
          alt={c.alt}
          width={c.ancho}
          height={c.alto}
          sizes={sizes}
          priority={prioridad}
          className="h-auto w-full"
        />
      </a>
      {c.pie ? <figcaption className="text-sm leading-relaxed text-apagado">{c.pie}</figcaption> : null}
    </figure>
  );
}
