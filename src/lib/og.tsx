import { ImageResponse } from "next/og";

export const tamanoOG = { width: 1200, height: 630 };
export const tipoOG = "image/png";

/**
 * Imagen de vista previa para cuando se comparte un link por WhatsApp,
 * LinkedIn o Slack. Usa la paleta del sitio; la tipografía es la que trae
 * el generador, porque cargar una fuente variable acá pesaría más de lo que
 * aporta a 1200x630.
 */
export function imagenOG({
  eyebrow,
  titulo,
  pie,
}: {
  eyebrow: string;
  titulo: string;
  pie?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14150F",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 20, letterSpacing: 6, color: "#A8A26A" }}>
            AGUSTÍN VIGNAU
          </span>
          <span style={{ fontSize: 20, letterSpacing: 6, color: "#9BA096" }}>
            {eyebrow.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titulo.length > 44 ? 68 : 88,
            fontWeight: 800,
            color: "#E9E0D6",
            lineHeight: 1.02,
            letterSpacing: -2,
            textTransform: "uppercase",
          }}
        >
          {titulo}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #343829",
            paddingTop: 24,
            fontSize: 20,
            letterSpacing: 4,
            color: "#9BA096",
          }}
        >
          <span>{pie ?? "AGUSTINVIGNAU.COM"}</span>
          <span style={{ color: "#A8A26A" }}>BUENOS AIRES</span>
        </div>
      </div>
    ),
    tamanoOG,
  );
}
