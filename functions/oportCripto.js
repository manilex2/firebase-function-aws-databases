const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const oportCripto = express();
// Automatically allow cross-origin requests
oportCripto.use(cors({origin: true}));
oportCripto.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    const finalResult = [];
    for (const item of result) {
      finalResult.push({
        "id": item.id,
        "cuentaActual": item.cuenta_actual,
        "cuentaHistorico": item.cuenta_historico,
        "cuentaUnificada": item.cuenta_unificada,
        "tipo": item.tipo,
        "fechaPublicacion": item.fecha_publicacion,
        "simbolo": item.symbol,
        "nombre": item.nombre,
        "precioEntrada1": item.precio_entrada_1,
        "precioEntrada2": item.precio_entrada_2,
        "precioEntrada3": item.precio_entrada_3,
        "precioEntrada4": item.precio_entrada_4,
        "precioMeta1": item.precio_meta_1,
        "precioMeta2": item.precio_meta_2,
        "stopLoss": item.stop_loss,
        "tradeHold": item.trade_hold,
        "nivelRiesgo": item.nivel_riesgo,
        "exchange": item.exchange,
        "logo": item.logo,
        "idPrecio": item.id_precio,
        "dataPrice": item.data_price,
        "precioActual": item.precio_actual,
        "validoHasta": item.valido_hasta,
        "rentabilidadEstimada": item.rentabilidad_estimada,
        "recomendar": item.recomendar,
        "chart": item.chart,
        "rentabilidadGenerada": item.rentabilidad_generada,
        "rentabilidadNumerica": item.rentabilidad_numerica,
        "recomendacionCaduca": item.recomendacion_caduca,
        "mostrarHasta": item.mostrar_hasta,
        "riesgoEstrella": item.riesgo_estrella,
        "chartSeguimiento": item.chart_seguimiento,
        "widgetSimbolo": item.widget_symbol,
        "analisisGrafico": item.analisis_grafico,
      });
    }
    res.json(finalResult);
  });
});

module.exports = oportCripto;
