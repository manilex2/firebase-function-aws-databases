const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const idosIcos = express();
// Automatically allow cross-origin requests
idosIcos.use(cors({origin: true}));
idosIcos.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.IDOS_ICOS_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});
idosIcos.get(`/${process.env.API_KEY}/bettersRentability`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.IDOS_ICOS_TABLE} GROUP BY nombre ORDER BY MAX(rentabilidad_generada) DESC LIMIT 4;`;
  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});
module.exports = idosIcos;
