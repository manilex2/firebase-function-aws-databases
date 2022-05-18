const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const chartProy = express();
// Automatically allow cross-origin requests
chartProy.use(cors({origin: true}));
chartProy.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.CHART_PROY_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    const finalResult = [];
    for (const item of result) {
      finalResult.push({
        "id": item.id,
        "coin": item.coin,
        "fecha": item.fecha,
        "precio": item.precio,
        "proyeccionesLP": item.proy_lp,
        "smartBandsLP": item.smartbands_lp,
        "rentabilidadLP": item.rent_lp,
        "proyeccionesCP": item.proy_cp,
        "smartBandsCP": item.smartbands_cp,
        "rentabilidadCP": item.rent_cp,
      });
    }
    res.json(finalResult);
  });
});

module.exports = chartProy;
