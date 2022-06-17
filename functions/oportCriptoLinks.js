const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const oportCriptoLinks = express();
// Automatically allow cross-origin requests
oportCriptoLinks.use(cors({origin: true}));
oportCriptoLinks.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/historico/:idPrecio`, (req, res) => {
  const idPrecio = req.params["idPrecio"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT cuenta_historico FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE id_precio="${idPrecio}" ORDER BY fecha_publicacion DESC LIMIT 1;`;
  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: `Cuenta Historico de ${idPrecio}`,
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Request Error",
        message: `No se encontro Cuenta Historico para ${idPrecio}`,
      });
    }
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/tradehold/:idPrecio`, (req, res) => {
  const idPrecio = req.params["idPrecio"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT trade_hold FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE id_precio="${idPrecio}" ORDER BY fecha_publicacion DESC LIMIT 1;`;
  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: `Trade Hold de ${idPrecio}`,
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Request Error",
        message: `No se encontro Trade Hold para ${idPrecio}`,
      });
    }
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/exchange/:idPrecio`, (req, res) => {
  const idPrecio = req.params["idPrecio"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT exchange FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE id_precio="${idPrecio}" ORDER BY fecha_publicacion DESC LIMIT 1;`;
  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    if (result) {
      res.status(200).json({
        status: 200,
        title: `Exchange de ${idPrecio}`,
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        error: "Request Error",
        message: `No se encontro Exchange para ${idPrecio}`,
      });
    }
  });
});

module.exports = oportCriptoLinks;
