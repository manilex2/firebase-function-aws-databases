const express = require("express");
const cors = require("cors");
const pool = require("./mysql");
const chartProy = express();
// Automatically allow cross-origin requests
chartProy.use(cors({origin: true}));
chartProy.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.CHART_PROY_TABLE};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.destroy();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Lista de Graficos de Proyecciones",
          data: result,
        });
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: "No se encontro Lista de Graficos de Proyecciones",
        });
      }
    });
  });
});

chartProy.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

chartProy.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});
module.exports = chartProy;
