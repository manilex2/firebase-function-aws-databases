const express = require("express");
const cors = require("cors");
const connection = require("./mysql-crypto");
const marketData = express();
// Automatically allow cross-origin requests
marketData.use(cors({origin: true}));

marketData.get(`/${process.env.API_KEY}/:cripto/:marketName`, (req, res) => {
  const cripto = req.params["cripto"];
  const marketName = req.params["marketName"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.MARKET_DATA_TABLE} WHERE name = "${cripto}" AND market_name="${marketName}";`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: `Market Data de ${cripto} para ${marketName}`,
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: `No se encontro Market Data para ${cripto} con ${marketName}`,
      });
    }
  });
});

marketData.get(`/${process.env.API_KEY}/:cripto`, (req, res) => {
  const cripto = req.params["cripto"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.MARKET_DATA_TABLE} WHERE name = "${cripto}";`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: `Market data de ${cripto}`,
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Request Error",
        message: `No se encontro Market Data para ${cripto}`,
      });
    }
  });
});

marketData.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.MARKET_DATA_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: "Market Data de todas las criptos",
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "No se encontraron datos",
      });
    }
  });
});

marketData.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

marketData.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = marketData;
