const express = require("express");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
});
AWS.config.region = "us-east-2";
const lambda = new AWS.Lambda();
const admin = require("firebase-admin");
const cors = require("cors");
const qs = require("qs");
const axios = require("axios").default;
const {FieldValue} = require("firebase-admin/firestore");
// eslint-disable-next-line new-cap
const router = express.Router();
const generator = require("generate-password");
// eslint-disable-next-line max-len
router.use(cors({origin: true}));

router.post("/generateSSO", async function(req, res) {
  // eslint-disable-next-line max-len
  const response = await axios.get(
      `${process.env.URL_CREATE_AFFILIADE_REWARDFULL}/${req.body.id}/sso`,
      {
        headers: {
          Authorization: `Basic ${process.env.API_KEY_REWARDFULL}`,
        },
      },
  );
  res.status(200).json({
    status: 200,
    title: "Link de RewardFull SSO",
    data: response.data.sso.url,
  });
});
router.post("/updateAffiliate", async function(req, res) {
  const data = {};
  if (req.body.emailWise !== undefined && req.body.emailWise !== "") {
    data["wise_email"] = req.body.emailWise;
  }
  if (req.body.emailPaypal !== undefined && req.body.emailPaypal !== "") {
    data["paypal_email"] = req.body.emailPaypal;
  }
  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${process.env.API_KEY_REWARDFULL}`,
    },
    data: qs.stringify(data),
    url: `${process.env.URL_CREATE_AFFILIADE_REWARDFULL}/${req.body.id}`,
  };
  await axios(options)
      .then(function(response) {
        console.log(response);
        res.status(200).json({
          status: 200,
          title: "Afiliado actualizado",
        });
      })
      .catch(function(error) {
        if (error.response !== undefined) {
        // eslint-disable-next-line max-len
          res.status(400).json({status: 400, title: "Afiliado no actualizado"});
        } else {
          console.error(error);
        }
      });
});
router.post("/getInformationTeam", async function(req, res) {
  const idDoc = req.body.idDoc;
  const docAffiliate = admin.firestore().collection("affiliates").doc(idDoc);
  const team = (await docAffiliate.get()).data().levels_1;
  let total = 0;
  let totalSaleTeam = 0;
  for (const reference of team) {
    const documentSnapshot = await reference.get();
    if (documentSnapshot.exists) {
      const subcollection = reference.collection("referrals");
      const subcollectionSnapshot = await subcollection.get();
      total += subcollectionSnapshot.docs.length;
      totalSaleTeam += documentSnapshot.data().total_sale_direct_month;
    }
  }
  res.status(200).json({
    status: 200,
    title: "Top Vendedores",
    data: {
      totalTeam: total == null ? 0: total,
      totalSaleTeam: totalSaleTeam == null ? 0: totalSaleTeam,
    },
  });
});
router.post("/topSellers", async (req, res) => {
  const top = req.body.top;
  const idDoc = req.body.idDoc;
  const docAffiliate = admin.firestore().collection("affiliates").doc(idDoc);
  const team = (await docAffiliate.get()).data().levels_1;
  if (team.length > 0) {
    const promises = team.map(async (reference) => {
      const doc = await reference.get();
      return {
        id: reference.id,
        reference: doc,
        value: doc.data()["total_sale_accumulate_month"],
      };
    });
    const documents = await Promise.all(promises);
    documents.sort((a, b) => b.value - a.value);
    res.status(200).json({
      status: 200,
      title: "Top Vendedores",
      data: documents.slice(0, top),
    });
  } else {
    res.status(200).json({
      status: 200,
      title: "Top Vendedores",
      data: [],
    });
  }
});
router.post("/actuallyGoal", async (req, res) => {
  const accumulateMonth = req.body.total_sale_accumulate_month;
  const goals = (
    await admin
        .firestore()
        .collection("goals_affiliaton")
        .orderBy("min_sale", "asc")
        .get()
  ).docs;
  for (let j = 0; j < goals.length; j++) {
    // eslint-disable-next-line max-len
    if (
      goals[j].data().min_sale < accumulateMonth &&
      goals[j].data().max_sale >= accumulateMonth
    ) {
      res.status(200).json({
        status: 200,
        title: "Meta actual",
        meta_id: goals[j].data().meta_id,
        idReference: goals[j].id,
      });
    }
  }
  res.status(400).json({
    status: 400,
    title: "No Hay Meta",
    idReference: null,
  });
});
router.post("/createUser", async (req, res) => {
  let status = 0;
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;
  const iduser = req.body.iduser;
  const token = generator.generate({
    length: 10,
    strict: true,
  });
  const data = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    token: token,
  };
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${process.env.API_KEY_REWARDFULL}`,
    },
    data: qs.stringify(data),
    url: "https://api.getrewardful.com/v1/affiliates",
  };
  let response;
  await axios(options)
      .then(async function(responseRW) {
        status = responseRW.status;
        response = responseRW.data;
        console.log(response);
        const affiliate = admin.firestore().collection("affiliates").doc();
        const user = admin.firestore().collection("users").doc(iduser);
        const referrals = affiliate.collection("referrals").doc();
        const sales = affiliate.collection("sales").doc();
        const comissions = affiliate.collection("comissions").doc();
        await affiliate.create({
          email: response.email,
          state: response.state,
          link: response.links[0].url,
          id_link: response.links[0].id,
          total_comission_month: 0,
          sale_direct_next_month: 0,
          sale_indirect_next_month: 0,
          total_comission_general: 0,
          total_sale_general: 0,
          total_sale_indirect_month: 0,
          total_sale_direct_month: 0,
          work_month: new Date().getMonth() + 1,
          id: response.id,
          total_sale_accumulate_month: 0,
          id_firebase: affiliate.id,
          levels_1: [],
          token: response.links[0].token,
        });
        await referrals.create({});
        await sales.create({});
        await comissions.create({});
        await user.update({
          first_name: firstName,
          last_name: lastName,
          affiliate_code: response.links[0].token,
          affiliate_link: response.links[0].url,
          aceptaTerminosAfiliados: false,
          affiliate_ref: affiliate,
        });
      })
      .catch(function(error) {
        status = 404;
        if (error.response !== undefined) {
          const mensaje = error.response.data.mensaje;
          console.log(mensaje);
        } else {
          console.error(error);
        }
      });
  if (status === 200) {
    res.status(status).json({
      status: status,
      title: "Creacion con exito el afiliado",
    });
  } else {
    res.status(404).json({
      status: 404,
      title: "Error en la creacion del afiliado",
    });
  }
  return response;
});
router.post("/sellManually", async (req, res) => {
  const batch = admin.firestore().batch();
  let docRefererallRef;
  console.log(req.body);
  const infoClient = req.body.client;
  const payDay = new Date(req.body.payDate);
  const infoProduct = req.body.infoProduct;
  const refAffiliate = req.body.refAffiliate;
  const urlVoucher = req.body.urlVoucher;
  const productFirebase = await admin
      .firestore()
      .collection("plans")
      .where("name", "==", infoProduct.name)
      .get();
  const variantProduct = await productFirebase.docs[0].ref
      .collection("variations")
      .where("name", "==", infoProduct.recurring)
      .get();
  const affiliate = admin
      .firestore()
      .collection("affiliates")
      .doc(refAffiliate);
  const collectionReferrals = affiliate.collection("referrals");
  const collectionSales = affiliate.collection("sales");
  const queryReferral = await collectionReferrals
      .where("email", "==", infoClient.email)
      .get();
  const bodySale = {
    date: payDay,
    amount: variantProduct.docs[0].data().price,
    name_product: productFirebase.docs[0].data().name,
    recurring_product: variantProduct.docs[0].data().name,
    ref_product: productFirebase.docs[0].ref,
    ref_product_variation: variantProduct.docs[0].ref,
    month: payDay.getMonth() + 1,
    url_voucher: urlVoucher,
  };
  const referenceSale = collectionSales.doc();
  if (queryReferral.empty) {
    docRefererallRef = collectionReferrals.doc();
    bodySale["ref_client"] = docRefererallRef;
    const bodyReferral = {
      platform: "app",
      email: infoClient.email,
      name_client: infoClient.name,
      lastname_client: infoClient.lastname,
      belongTo: affiliate,
      month_sale: payDay.getMonth() + 1,
      sales: FieldValue.arrayUnion(referenceSale),
      id_firebase: docRefererallRef,
      active: true,
    };
    batch.set(docRefererallRef, bodyReferral);
  } else {
    docRefererallRef = queryReferral.docs[0].ref;
    bodySale["ref_client"] = docRefererallRef;
    // eslint-disable-next-line max-len
    if (queryReferral.docs[0].data().month_sale != payDay.getMonth() + 1) {
      batch.update(docRefererallRef, {
        sales: FieldValue.arrayUnion(referenceSale),
        month_sale: payDay.getMonth() + 1,
      });
    } else {
      batch.update(docRefererallRef, {
        sales: FieldValue.arrayUnion(referenceSale),
      });
    }
  }
  batch.set(referenceSale, bodySale);
  try {
    await batch.commit();
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: 200,
        idAffiliate: affiliate.id,
        amount_sale: variantProduct.docs[0].data().price,
        date_sale: payDay,
      }),
    };
    const params = {
      FunctionName: "invrtir-update-sale",
      InvocationType: "RequestResponse",
      LogType: "Tail",
      Payload: JSON.stringify(response),
    };
    const resLambda = await lambda
        .invoke(params)
        .promise()
        .then(
            function(data) {
              console.log("Success!");
              console.log(JSON.stringify(data));
              return data;
            },
            function(error) {
              console.log("Error");
              console.error(error);
              console.log(JSON.stringify(error));
              return error;
            },
        );
    const {StatusCode, Payload} = resLambda;
    console.log({
      StatusCode,
      Payload,
    });
    const payloadReturn = JSON.parse(Payload);
    res.status(StatusCode).json({
      status: StatusCode,
      payloadAWS: JSON.parse(payloadReturn.body),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 400,
      title: "Error en la creacion de la venta",
    });
  }
});
router.get("/groupSalesByDayOfWeek", async (req, res) => {
  const idAffiliate = req.query.id;
  const dateSale = new Date(req.query.date);
  const salesRef = admin
      .firestore()
      .collection("affiliates")
      .doc(idAffiliate)
      .collection("sales");
  const startOfWeek = getStartOfWeek(dateSale);
  // const endOfWeek = getEndOfWeek(dateSale);
  const salesByDayOfWeek = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(currentDay.getDate() + i);

    const salesByDate = await salesRef
        .where("date", ">=", currentDay)
    // eslint-disable-next-line max-len
        .where("date", "<", new Date(currentDay.getTime() + 24 * 60 * 60 * 1000))
        .get()
        .then((snapshot) => {
          let total = 0;
          snapshot.forEach((sale) => {
            total += sale.data().amount;
          });
          // eslint-disable-next-line max-len
          return {
            dayOfWeek: currentDay.toLocaleDateString("es-Es", {
              weekday: "long",
            }),
            total,
          };
        });
    salesByDayOfWeek.push(salesByDate);
  }

  return res.render("chartWeekSales", {
    labels: salesByDayOfWeek.map((day) => day.dayOfWeek),
    values: salesByDayOfWeek.map((day) => day.total),
  });
});
/**
 * Funcion para retorna la fecha de inicio de semana según una fecha dada.
 * @param {Date} date fecha para encontrar cuando inicia la semana
 * @return {Date} Fecha del inicio de semana
 */
function getStartOfWeek(date) {
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek - 1));
  return startOfWeek;
}

/**
 * Funcion para retorna la fecha de fin de semana según una fecha dada.
 * @param {Date} date fecha para encontrar cuando finaliza la semana
 * @return {Date} Fecha del fin de semana
 */
/*
function getEndOfWeek(date) {
  const dayOfWeek = date.getDay();
  const endOfWeek = new Date(date);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - dayOfWeek));
  return endOfWeek;
}
*/
module.exports = router;
