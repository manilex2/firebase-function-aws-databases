const express = require("express");
const cors = require("cors");
const pool = require("./mysql");
const oportCriptoLinks = express();
// Automatically allow cross-origin requests
oportCriptoLinks.use(cors({origin: true}));
oportCriptoLinks.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Oportunidades Datos",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: "No se encontro Oportunidades Datos",
        });
      }
    });
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/historico`, (req, res) => {
  const date = new Date();
  // eslint-disable-next-line max-len
  const fechaActual = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE tipo="Op.Hist." AND mostrar_hasta >= ${fechaActual};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Historico",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: "No se encontro Historico",
        });
      }
    });
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/historico/bettersRentability`, (req, res) => {
  const date = new Date();
  // eslint-disable-next-line max-len
  const fechaActual = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE tipo="Op.Hist." AND mostrar_hasta >= ${fechaActual} GROUP BY symbol ORDER BY MAX(rentabilidad_numerica) DESC LIMIT 5;`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Historico",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: "No se encontro Historico",
        });
      }
    });
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/historico/groupByDate`, (req, res) => {
  const date = new Date();
  // eslint-disable-next-line max-len
  const fechaActual = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE tipo="Op.Hist." AND mostrar_hasta >= ${fechaActual} ORDER BY fecha_publicacion DESC;`;
  // eslint-disable-next-line max-len
  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      const fechasUnicas = [];
      const dict = [];
      result.forEach((field) => {
        if (!(fechasUnicas.includes(JSON.stringify(field.fecha_publicacion)))) {
          fechasUnicas.push(JSON.stringify(field.fecha_publicacion));
        }
      });
      // eslint-disable-next-line guard-for-in
      for (const indice in fechasUnicas) {
        const datosUnicos =[];
        result.forEach((field)=>{
          if (fechasUnicas[indice] == JSON.stringify(field.fecha_publicacion)) {
            datosUnicos.push(field);
          }
        });
        // eslint-disable-next-line max-len
        dict.push({"fecha": JSON.parse(fechasUnicas[indice]), "datos": datosUnicos});
      }

      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Historico Agrupado por Fechas en Orden Descendente",
          data: dict,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: "No se encontro Historico",
        });
      }
    });
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/tradehold/:transaccion`, (req, res) => {
  const transaccion = req.params["transaccion"].toString();
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE trade_hold LIKE "%${transaccion}"`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: `Trade Hold de ${transaccion}`,
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: `No se encontro Trade Hold para ${transaccion}`,
        });
      }
    });
  });
});

// eslint-disable-next-line max-len
oportCriptoLinks.get(`/${process.env.API_KEY}/trade`, (req, res) => {
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE} WHERE trade_hold="trades" AND tipo="Op.Act."`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Trades",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: "No se encontraron trades",
        });
      }
    });
  });
});

module.exports = oportCriptoLinks;
