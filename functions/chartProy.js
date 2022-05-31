const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const chartProy = express();
// Automatically allow cross-origin requests
chartProy.use(cors({origin: true}));
chartProy.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.CHART_PROY_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = chartProy;
