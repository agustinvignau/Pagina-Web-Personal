/**
 * Datos estructurados de tipo Person: es lo que le permite a Google entender
 * que el sitio es sobre una persona concreta, con su ocupación y sus perfiles,
 * en vez de tratarlo como una página suelta.
 */
const PERSONA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Agustín Vignau",
  url: "https://www.agustinvignau.com",
  email: "mailto:agustinvignau729@gmail.com",
  jobTitle: "Analista de datos y automatización de procesos",
  description:
    "Diseño sistemas de datos y automatización para PyMEs: inventario, carga automática de comprobantes y reportes de gestión.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ciudad Autónoma de Buenos Aires",
    addressCountry: "AR",
  },
  sameAs: [
    "https://www.linkedin.com/in/agustinvignau/",
    "https://github.com/agustinvignau",
  ],
  worksFor: { "@type": "Organization", name: "TuGenesis3D" },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "IFTS N°18 — Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial",
  },
  knowsAbout: [
    "Análisis de datos",
    "Automatización de procesos",
    "Business Intelligence",
    "Python",
    "SQL",
    "PostgreSQL",
    "Power BI",
    "Gestión de inventario",
    "Agentes de inteligencia artificial",
  ],
};

export default function DatosEstructurados() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSONA) }}
    />
  );
}
