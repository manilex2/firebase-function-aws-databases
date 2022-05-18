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
    const finalResult = [];
    for (const item of result) {
      finalResult.push({
        "id": item.userId,
        "planId": item.planId,
        "email": item.email,
        "usuario_Id": item.usuarioId,
        "nombre": item.nombre,
        "apellido": item.apellido,
        "codigoAfiliado": item.affiliate_code,
        "foto": item.foto,
        "perfilInversor": item.perfil_inv,
        "usuarioDiscord": item.usuario_discord,
        "whatsapp": item.whatsapp,
        "activo": item.usuario_activo,
      });
    }
    res.json(finalResult);
  });
});

module.exports = usuarios;
