"""Resume los datos de los cinco estudios del Laboratorio para las portadas.

Lee los CSV procesados de cada repo y escribe src/lib/laboratorio-datos.ts.
Las portadas son SVG dibujados con estos datos; en la fase 11 los controles
interactivos van a trabajar sobre lo mismo.

Uso, con los cinco repos clonados uno al lado del otro:

    python scripts/datos_laboratorio.py RUTA_A_LOS_REPOS

No hay nada aleatorio sin semilla: correrlo dos veces da el mismo archivo.
"""

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "src" / "lib" / "laboratorio-datos.ts"


def forecast(base: Path) -> dict:
    # Un solo SKU, el último año de historia y las 12 semanas de test.
    d = base / "portfolio-forecasting-inventario" / "data" / "processed"
    train = pd.read_csv(d / "train.csv", parse_dates=["semana"])
    test = pd.read_csv(d / "test.csv", parse_dates=["semana"])
    pred = pd.read_csv(d / "predicciones_test.csv", parse_dates=["semana"])
    res = pd.read_csv(d / "resultados_modelos.csv")
    sku = "SKU004"
    h = train[train.sku_id == sku].sort_values("semana").tail(52)
    t = test[test.sku_id == sku].sort_values("semana")
    p = pred[pred.sku_id == sku].sort_values("semana")
    mape = res[(res.sku_id == sku) & (res.modelo == "LightGBM (global)")].MAPE.iloc[0]
    return {
        "producto": h.sku_nombre.iloc[0],
        "modelo": "LightGBM",
        "historia": [round(float(v)) for v in h.unidades],
        "real": [round(float(v)) for v in t.unidades],
        "pred": [round(float(v)) for v in p.prediccion],
        "inicio": h.semana.iloc[0].strftime("%Y-%m-%d"),
        "corte": t.semana.iloc[0].strftime("%Y-%m-%d"),
        "mape": round(float(mape), 1),
    }


def anomalias(base: Path) -> dict:
    # Los pedidos duplicados no se ven en el plano cantidad-precio: se sacan.
    # De los normales alcanza una muestra; las alertas van todas.
    a = pd.read_csv(base / "portfolio-deteccion-anomalias" / "data" / "processed" / "alertas_pedidos.csv")
    total = len(a)
    a = a[a.tipo_anomalia != "pedido_duplicado"]
    normales = a[~a.alerta_final].sample(500, random_state=7)
    alertas = a[a.alerta_final]
    return {
        "normales": [[round(float(x), 2), round(float(y), 2)] for x, y in zip(normales.z_cantidad, normales.z_precio)],
        "alertas": [
            [round(float(x), 2), round(float(y), 2), int(e)]
            for x, y, e in zip(alertas.z_cantidad, alertas.z_precio, alertas.es_anomalia)
        ],
        "totalPedidos": total,
    }


def churn(base: Path) -> dict:
    c = pd.read_csv(base / "portfolio-prediccion-churn" / "data" / "processed" / "predicciones_churn.csv")
    return {
        "probs": [round(float(v), 3) for v in c.probabilidad_churn],
        "reales": [int(v) for v in c.churn],
        "sobreUmbral": int((c.probabilidad_churn >= 0.5).sum()),
        "clientes": int(len(c)),
    }


def segmentos(base: Path) -> dict:
    s = pd.read_csv(base / "portfolio-segmentacion-clientes" / "data" / "processed" / "clientes_segmentados.csv")
    nombres = s.segmento.value_counts().index.tolist()
    return {
        "nombres": nombres,
        "puntos": [[int(r), int(f), nombres.index(g)] for r, f, g in zip(s.recencia_dias, s.frecuencia, s.segmento)],
    }


def ab(base: Path) -> dict:
    # La unidad de análisis es sucursal-día, como en el estudio: analizar por
    # visitante sería pseudoreplicación.
    m = pd.read_csv(base / "portfolio-experimento-ab" / "data" / "processed" / "metricas_diarias.csv")
    a = m[m.variante == "A"].conversion_dia
    b = m[m.variante == "B"].conversion_dia

    def ic(x):
        return 1.96 * x.std() / np.sqrt(len(x))

    return {
        "a": [round(float(v), 4) for v in a],
        "b": [round(float(v), 4) for v in b],
        "mediaA": round(float(a.mean()), 4),
        "icA": round(float(ic(a)), 4),
        "mediaB": round(float(b.mean()), 4),
        "icB": round(float(ic(b)), 4),
        "dias": int(len(a)),
    }


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    base = Path(sys.argv[1])
    datos = {
        "forecast": forecast(base),
        "anomalias": anomalias(base),
        "churn": churn(base),
        "segmentos": segmentos(base),
        "ab": ab(base),
    }
    cabecera = (
        "// Datos de las portadas del Laboratorio. Salen de los CSV procesados de cada\n"
        "// repo (data/processed/), resumidos por scripts/datos_laboratorio.py. No se\n"
        "// editan a mano: si cambia un estudio, se vuelve a correr el script.\n"
        "//\n"
        "// Son los mismos datos sintéticos de los estudios. En la fase 11 los\n"
        "// controles interactivos van a trabajar sobre esto.\n"
    )
    cuerpo = json.dumps(datos, ensure_ascii=False, separators=(",", ":"))
    SALIDA.write_text(f"{cabecera}export const LAB = {cuerpo} as const;\n", encoding="utf-8")
    print(f"Escrito {SALIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
