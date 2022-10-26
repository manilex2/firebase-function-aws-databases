const express = require("express");
const cors = require("cors");
const adminForex = express();
const admin = require("firebase-admin");
adminForex.use(cors({origin: true}));
adminForex.post(`/${process.env.API_KEY}/createAnalystForex`,
    async (req, res) => {
      res.set("Content-Type", "application/json");
      const nombre = req.body.nombre;
      const contraseña = req.body.contraseña;
      const correo = req.body.correo;
      const referenciaPlanAdmin = admin.firestore().collection("plans_admin")
          .doc("plan_forex_analyst");
      const referenciaPlanForex = admin.firestore().collection("plans_forex")
          .doc("plan_premium_anually");
      await admin.auth().createUser({
        displayName: nombre,
        email: correo,
        password: contraseña,
        plan_admin: (await referenciaPlanAdmin.get()).ref,
        plan_forex: (await referenciaPlanForex.get()).ref,
      }).then(async (response) => {
        console.log(response);
        await admin.firestore().collection("users").doc(response.uid).create({
          display_name: response.displayName,
          email: response.email,
          uid: response.uid,
          created_time: response.metadata.creationTime,
        });
        res.status(200).json({
          status: 200,
          title: "Usuario creado con éxito",
          data: response,
        });
      }).catch(function(err) {
        if (err.errorInfo !== undefined) {
          res.status(400).json({status: 400, response: err.errorInfo.message});
        } else {
          console.error(err);
        }
      });
    });
adminForex.post("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});
adminForex.post("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});
module.exports = adminForex;
