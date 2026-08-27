export default function Footer() {
  return (
    <footer className="flex flex-col gap-6 bg-tinta px-6 py-10 text-apagado-oscuro md:flex-row md:items-center md:justify-between md:px-12">
      <div className="etiqueta leading-relaxed">
        <span className="block text-hueso">Agustín Vignau</span>
        <span className="block text-oliva-luz">Buenos Aires, Argentina</span>
      </div>
      <ul className="flex list-none flex-wrap gap-x-6 gap-y-2">
        <li>
          <a
            href="mailto:agustinvignau729@gmail.com"
            className="etiqueta text-apagado-oscuro no-underline transition-colors hover:text-hueso"
          >
            Mail
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/agustinvignau/"
            target="_blank"
            rel="noreferrer"
            className="etiqueta text-apagado-oscuro no-underline transition-colors hover:text-hueso"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href="https://github.com/agustinvignau"
            target="_blank"
            rel="noreferrer"
            className="etiqueta text-apagado-oscuro no-underline transition-colors hover:text-hueso"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href="/CV-Agustin-Vignau.pdf"
            className="etiqueta text-apagado-oscuro no-underline transition-colors hover:text-hueso"
          >
            CV
          </a>
        </li>
      </ul>
      <span className="etiqueta">© 2026</span>
    </footer>
  );
}
