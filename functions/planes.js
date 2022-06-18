const express = require("express");
const cors = require("cors");
const pool = require("./mysql");
const planes = express();
// Automatically allow cross-origin requests
planes.use(cors({origin: true}));
planes.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.PLANS_TABLE};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Planes",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se encontraron Planes",
        });
      }
    });
  });
});

module.exports = planes;
