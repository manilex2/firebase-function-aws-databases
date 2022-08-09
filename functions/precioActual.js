const express = require("express");
const cors = require("cors");
const pool = require("./mysql-crypto");
const precioActual = express();
// Automatically allow cross-origin requests
precioActual.use(cors({origin: true}));

precioActual.get(`/${process.env.API_KEY}/:cripto/:fecha`, (req, res) => {
  const cripto = req.params["cripto"];
  const fecha = req.params["fecha"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.PRECIO_ACTUAL_TABLE} WHERE name = "${cripto}" AND fecha="${fecha}";`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.destroy();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: `Market Data de ${cripto} para ${fecha}`,
          data: result,
        });
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: `No se encontro Market Data para ${cripto} con ${fecha}`,
        });
      }
    });
  });
});

precioActual.get(`/${process.env.API_KEY}/:cripto`, (req, res) => {
  const cripto = req.params["cripto"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.PRECIO_ACTUAL_TABLE} WHERE name = "${cripto}";`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.destroy();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: `Historico de precios para ${cripto}`,
          data: result,
        });
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: `No se encontro historico de precios para ${cripto}`,
        });
      }
    });
  });
});

precioActual.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.PRECIO_ACTUAL_TABLE};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.destroy();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Historico de precios de todas las criptos",
          data: result,
        });
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se encontraron datos",
        });
      }
    });
  });
});

precioActual.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

precioActual.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = precioActual;
