const express = require("express");
const cors = require("cors");
const connection = require("./mysql");
const usuarios = express();
// Automatically allow cross-origin requests
usuarios.use(cors({origin: true}));
usuarios.get("/", (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.USERS_TABLE};`;

  connection.query(sqlStr, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = usuarios;
