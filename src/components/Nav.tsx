const SECCIONES = [
  { href: "#produccion", label: "Producción" },
  { href: "#laboratorio", label: "Laboratorio" },
  { href: "#perfil", label: "Perfil" },
  { href: "#contacto", label: "Contacto" },
];

export default function Nav() {
  return (
    <>
    <nav className="flex items-center justify-between gap-6 px-6 pt-6 md:px-12 md:pt-7">
      <a href="#" className="etiqueta shrink-0 no-underline">
        <span className="block text-hueso">Agustín</span>
        <span className="block text-oliva-luz">Vignau</span>
      </a>

      <ul className="hidden list-none items-center gap-7 lg:flex">
        {SECCIONES.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              className="etiqueta text-apagado-oscuro no-underline transition-colors hover:text-hueso"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <span className="etiqueta hidden items-center gap-2 text-apagado-oscuro sm:flex">
          <span aria-hidden className="block size-[5px] bg-oliva-luz" />
          Buenos Aires
        </span>
        <span className="etiqueta border border-linea-oscura px-2 py-1 text-hueso">
          EN
        </span>
      </div>
    </nav>

    {/* Navegación en celular: las mismas secciones, en una fila compacta */}
    <ul className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-1 border-y border-linea-oscura px-6 py-3 lg:hidden">
      {SECCIONES.map((s) => (
        <li key={s.href}>
          <a href={s.href} className="etiqueta text-apagado-oscuro no-underline">
            {s.label}
          </a>
        </li>
      ))}
    </ul>
    </>
  );
}
