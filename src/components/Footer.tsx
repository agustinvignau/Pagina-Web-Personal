import EnlaceMedido from "./EnlaceMedido";
import { type Lang, textos } from "@/lib/i18n";

export default function Footer({ lang = "es" }: { lang?: Lang }) {
  const t = textos(lang);

  const enlaces = [
    { href: "mailto:agustinvignau729@gmail.com", label: t.footer.mail, tipo: "externo" as const, detalle: "mail" },
    { href: "https://www.linkedin.com/in/agustinvignau/", label: t.footer.linkedin, externo: true, tipo: "externo" as const, detalle: "linkedin" },
    { href: "https://github.com/agustinvignau", label: t.footer.github, externo: true, tipo: "externo" as const, detalle: "github" },
    { href: "/CV-Agustin-Vignau.pdf", label: t.footer.cv, tipo: "cv" as const },
  ];

  return (
    <footer className="flex flex-col gap-6 bg-tinta px-6 py-10 text-apagado-oscuro md:flex-row md:items-center md:justify-between md:px-12">
      <div className="etiqueta leading-relaxed">
        <span className="block text-hueso">Agustín Vignau</span>
        <span className="block text-oliva-luz">{t.footer.ubicacion}</span>
      </div>
      <ul className="flex list-none flex-wrap gap-x-6 gap-y-2">
        {enlaces.map((e) => (
          <li key={e.label}>
            <EnlaceMedido
              href={e.href}
              tipo={e.tipo}
              detalle={e.detalle}
              externo={e.externo}
              className="etiqueta text-apagado-oscuro no-underline transition-colors hover:text-hueso"
            >
              {e.label}
            </EnlaceMedido>
          </li>
        ))}
      </ul>
      <span className="etiqueta">© 2026</span>
    </footer>
  );
}
