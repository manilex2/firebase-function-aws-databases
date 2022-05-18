const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const idosIcos = express();
// Automatically allow cross-origin requests
idosIcos.use(cors({origin: true}));
idosIcos.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.IDOS_ICOS_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    const finalResult = [];
    for (const item of result) {
      finalResult.push({
        "id": item.id,
        "fecha": item.fecha,
        "nombre": item.nombre,
        "simbolo": item.symbol,
        "resumen": item.resumen,
        "banner": item.banner,
        "icono": item.icono,
        "linkWhitepaper": item.link_whitepaper,
        "proyectoRealizable": item.proyecto_realizable,
        "seguidadInformatica": item.seg_informatica,
        "whitepaperIntegro": item.whitepaper_integro,
        "calificacionInnovacion": item.calificacion_innovacion,
        "calificacionTecnologia": item.calificacion_tecnologia,
        "calificacionProgramacion": item.calificacion_programacion,
        "calificacionPlanFuturo": item.calificacion_plan_futuro,
        "calificacionEquipo": item.calificacion_equipo,
        "calificacionTotal": item.calificacion_total,
        "exchangeDisponible": item.exchange_disp,
        "precioVenta": item.precio_venta,
        "idPrecio": item.id_precio,
        "dataPrice": item.data_price,
        "precioActual": item.precio_actual,
        "rentabilidadGenerada": item.rentabilidad_generada,
        "bannerVenta": item.banner_venta,
        "fechaMaximaKYC": item.fecha_max_kyc,
        "inicioStaking": item.inicio_staking,
        "finStaking": item.fin_staking,
        "fechaVenta": item.fecha_venta,
        "linkKYC": item.link_kyc,
        "compraMonedaBase": item.compra_mon_base,
        "creacionCuentaExchange": item.creacion_cuenta_exchange,
        "registroIDO": item.registro_ido,
        "comentarioAdicional": item.comentario_adic,
      });
    }
    res.json(finalResult);
  });
});

module.exports = idosIcos;
