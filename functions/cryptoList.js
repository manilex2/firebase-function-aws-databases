const express = require("express");
const cors = require("cors");
const connection = require("./mysql-crypto");
const criptoList = express();
// Automatically allow cross-origin requests
criptoList.use(cors({origin: true}));

criptoList.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.LIST_CRYPTO_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: "Lista de Criptos",
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "No se pudo obtener la lista de criptos",
      });
    }
  });
});

criptoList.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

criptoList.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = criptoList;
