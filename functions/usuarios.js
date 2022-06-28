const express = require("express");
const cors = require("cors");
const pool = require("./mysql");
const usuarios = express();
// Automatically allow cross-origin requests
usuarios.use(cors({origin: true}));
usuarios.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.USERS_TABLE};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Usuarios",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se encontraron usuarios",
        });
      }
    });
  });
});

usuarios.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

usuarios.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = usuarios;
