# CV

`public/CV-Agustin-Vignau.pdf` es el CV que se descarga desde el sitio. Sale de
`cv-ai-engineer.html` (orientado a AI Engineer, desde el 21/11/2026).
`cv-general.html` es la versión general, para búsquedas de BI y análisis.

Formato apto ATS: una columna, títulos estándar, fuente estándar, viñetas
simples, una página.

Para regenerar el PDF (Playwright con Chromium):

    node docs/cv/pdf.js "$PWD/docs/cv/cv-ai-engineer.html" public/CV-Agustin-Vignau.pdf

Después de regenerarlo, comprobar que siga en una página (`pdfinfo`).
