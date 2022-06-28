const express = require("express");
const cors = require("cors");
const pool = require("./mysql-crypto");
const ranking = express();
// Automatically allow cross-origin requests
ranking.use(cors({origin: true}));

ranking.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY ;`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Ranking",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se pudo obtener los rankings",
        });
      }
    });
  });
});

ranking.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

ranking.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = ranking;
