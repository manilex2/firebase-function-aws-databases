const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const oportCriptoLinks = express();
// Automatically allow cross-origin requests
oportCriptoLinks.use(cors({origin: true}));
oportCriptoLinks.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.OPORT_CRIPTO_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = oportCriptoLinks;
