const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const idosIcos = express();
// Automatically allow cross-origin requests
idosIcos.use(cors({origin: true}));
idosIcos.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.IDOS_ICOS_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = idosIcos;
