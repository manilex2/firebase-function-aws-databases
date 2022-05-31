const express = require("express");
const cors = require("cors");
const connection = require("./mysql-crypto");
const oportSegCrypto = express();
// Automatically allow cross-origin requests
oportSegCrypto.use(cors({origin: true}));

oportSegCrypto.get(`/${process.env.API_KEY}/:indice`, (req, res) => {
  const indice = req.params["indice"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.SEG_CRYPTO_TABLE} WHERE indice = "${indice}";`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: `Seguimiento de Oportunidades para ${indice}`,
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: `No se encontraron datos para ${indice}`,
      });
    }
  });
});

oportSegCrypto.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.SEG_CRYPTO_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: "Seguimiento de Oportunidades General",
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

oportSegCrypto.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

oportSegCrypto.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = oportSegCrypto;
