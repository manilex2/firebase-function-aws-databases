const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const planes = express();
// Automatically allow cross-origin requests
planes.use(cors({origin: true}));
planes.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.PLANS_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = planes;
