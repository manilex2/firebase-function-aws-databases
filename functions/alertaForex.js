const express = require("express");
const cors = require("cors");
const alertForex = express();
const admin = require("firebase-admin");
alertForex.use(cors({origin: true}));

// eslint-disable-next-line max-len
alertForex.post(`/${process.env.API_KEY}/`, async (req, res)=>{
  res.set("Content-Type", "application/json");
  console.log(req.body);
  const entrancePrice = Number(req.body.priceEntrance);
  const icon = req.body.logo;
  const initialPips = req.body.initialPips;
  const par = req.body.par;
  const stopLoss = req.body.stopLoss;
  const takeProfit= req.body.takeProfit;
  const type = req.body.position;
  const tps = req.body.tps;
  const alert = {
    created_time: new Date(),
    entrance_price: entrancePrice,
    icon: icon,
    initial_pips: initialPips,
    par: par,
    stop_loss: stopLoss,
    take_profit: takeProfit,
    type: type,
    tps: tps,
    status: "open",
  };
  admin.firestore().collection("alerts_forex").doc().create(alert);
  res.status(200).json({
    status: 200,
    title: "Alerta Creado con exito creado con éxito",
    response: alert,
  });
});
alertForex.post("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});
alertForex.post("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});
module.exports = alertForex;
