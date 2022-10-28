const fetch = require("node-fetch");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();

const admin = require("firebase-admin");

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
app.get(`/${process.env.API_KEY}`, async (req, res) => {
  const query =
  await admin.firestore().collection("current_prices").listDocuments();
  if (query.length == 1) {
    await fetch(`https://us-central1-invrtir-app-b3266.cloudfunctions.net/precioActual/${process.env.API_KEY}`)
        .then((response) => response.json())
        .then((data)=>{
          const prices = data["data"];
          const currentDate = new Date(Date.now());
          for (const price of prices) {
            const date = new Date(price["fecha"]);
            if (date.getDate() == currentDate.getDate() &&
              date.getMonth() == currentDate.getMonth() &&
              date.getFullYear() == currentDate.getFullYear()) {
              admin.firestore().collection("current_prices")
                  .doc(price["name"]).create(
                      {
                        "date": date,
                        "id": price["name"],
                        "price": Number(price["precio"]),
                      },
                  );
            }
          }
        })
        .catch((ex)=>{
          functions.logger.log(ex);
        });
    res.send({"msg": "table has been created"});
  } else {
    res.send({"msg": "table already created"});
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

app.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = app;
