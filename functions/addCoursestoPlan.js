/* eslint-disable indent */
const express = require("express");
const cors = require("cors");
const app = express();
const {FieldValue} = require("firebase-admin/firestore");
const admin = require("firebase-admin");

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
app.post(`/${process.env.API_KEY}`, async (req, res) => {
  res.set("Content-Type", "application/json");
  const id = req.body.id;
  const typePlan = req.body.typePlan;
  // eslint-disable-next-line max-len
  const referenceCourses = admin
    .firestore()
    .collection("courses")
    .doc(req.body.referenceCourses);
  // eslint-disable-next-line comma-spacing
  const plansCryptos = ["plan_crypto", "plan_crypto_pro"];
  const planStocks = ["plan_advance", "plan_pro"];
  // eslint-disable-next-line max-len
  const plansPremiumForex = ["plan_premium_anually", "plan_premium_month"];
  const plans1Forex = ["plan_1_anually", "plan_1_month"];
  const plans2Forex = ["plan_2_month", "plan_2_anually"];
  if (typePlan === "crypto") {
    if (id == 1) {
      plansCryptos.forEach((plan) =>
        admin
          .firestore()
          .collection("plans")
          .doc(plan)
          .update({
            courses_crypto: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      admin
        .firestore()
        .collection("plans")
        .doc("plan_free")
        .update({
          courses_crypto: FieldValue.arrayUnion(referenceCourses),
        });
      planStocks.forEach((plan) =>
        admin
          .firestore()
          .collection("plans")
          .doc(plan)
          .update({
            courses_crypto: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      res.send({"msg": "table has been update"});
    } else if (id == 2) {
      plansCryptos.forEach((plan) =>
        admin
          .firestore()
          .collection("plans")
          .doc(plan)
          .update({
            courses_crypto: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      res.send({"msg": "table has been update"});
    }
  } else if (typePlan === "stock") {
    if (id == 1) {
      plansCryptos.forEach((plan) =>
        admin
          .firestore()
          .collection("plans")
          .doc(plan)
          .update({
            courses_stock: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      admin
        .firestore()
        .collection("plans")
        .doc("plan_free")
        .update({
          courses_stock: FieldValue.arrayUnion(referenceCourses),
        });
      planStocks.forEach((plan) =>
        admin
          .firestore()
          .collection("plans")
          .doc(plan)
          .update({
            courses_stock: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      res.send({"msg": "table has been update"});
    } else if (id == 2) {
      admin
        .firestore()
        .collection("plans")
        .doc("plan_advance")
        .update({
          courses_stock: FieldValue.arrayUnion(referenceCourses),
        });
        res.send({"msg": "table has been update"});
    } else if (id == 3) {
      admin
        .firestore()
        .collection("plans")
        .doc("plan_advance")
        .update({
          courses_stock: FieldValue.arrayUnion(referenceCourses),
        });
      admin
        .firestore()
        .collection("plans")
        .doc("plan_pro")
        .update({
          courses_stock: FieldValue.arrayUnion(referenceCourses),
        });
      admin
        .firestore()
        .collection("plans")
        .doc("plan_crypto_pro")
        .update({
          courses_stock: FieldValue.arrayUnion(referenceCourses),
        });
        res.send({"msg": "table has been update"});
    }
  } else if (typePlan === "forex") {
    if (id == 1) {
      admin
        .firestore()
        .collection("plans_forex")
        .doc("plan_free")
        .update({
          courses: FieldValue.arrayUnion(referenceCourses),
        });
        res.send({"msg": "table has been update"});
    } else if (id == 2) {
      plans1Forex.forEach((plan) =>
        admin
          .firestore()
          .collection("plans_forex")
          .doc(plan)
          .update({
            courses: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      res.send({"msg": "table has been update"});
    } else if (id == 3) {
      plans2Forex.forEach((plan) =>
        admin
          .firestore()
          .collection("plans_forex")
          .doc(plan)
          .update({
            courses: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      res.send({"msg": "table has been update"});
    } else if (id == 4) {
      plansPremiumForex.forEach((plan) =>
        admin
          .firestore()
          .collection("plans_forex")
          .doc(plan)
          .update({
            courses: FieldValue.arrayUnion(referenceCourses),
          }),
      );
      res.send({"msg": "table has been update"});
    }
  }
});
app.post("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});
app.post("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});
module.exports = app;
