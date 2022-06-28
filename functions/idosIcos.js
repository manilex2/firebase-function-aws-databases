const express = require("express");
const cors = require("cors");
const pool = require("./mysql");
const idosIcos = express();
// Automatically allow cross-origin requests
idosIcos.use(cors({origin: true}));
idosIcos.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.IDOS_ICOS_TABLE};`;
  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      res.json(result);
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "IDOs e ICOs",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se encontraron IDOs e ICOs",
        });
      }
    });
  });
});
idosIcos.get(`/${process.env.API_KEY}/bettersRentability`, (req, res) => {
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.IDOS_ICOS_TABLE} GROUP BY nombre ORDER BY MAX(rentabilidad_generada) DESC LIMIT 4;`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Mejor Rentabilidad de IDOs e ICOs",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se encontro Mejor Rentabilidad de IDOs e ICOs",
        });
      }
    });
  });
});
idosIcos.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

idosIcos.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});
module.exports = idosIcos;
