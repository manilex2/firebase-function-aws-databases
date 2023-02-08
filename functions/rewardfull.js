const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const qs = require("qs");
const axios = require("axios").default;
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(cors({origin: true}));

router.post("/generateSSO", async function(req, res) {
  res.set("Content-Type", "application/json");
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
  res.set("Content-Type", "application/json");
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
      totalTeam: total,
      totalSaleTeam: totalSaleTeam,
    },
  });
});
router.post("/topSellers", async (req, res) => {
  res.set("Content-Type", "application/json");
  const top = req.body.top;
  const idDoc = req.body.idDoc;
  const docAffiliate = admin.firestore().collection("affiliates").doc(idDoc);
  const team = (await docAffiliate.get()).data().levels_1;
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
});
router.post("/actuallyGoal", async (req, res) => {
  res.set("Content-Type", "application/json");
  const accumulateMonth = req.body.total_sale_accumulate_month;
  const goals = (await admin.firestore().collection("goals_affiliaton")
      .orderBy("min_sale", "asc").get()).docs;
  for (let j = 0; j < goals.length; j++) {
    // eslint-disable-next-line max-len
    if (goals[j].data().min_sale < accumulateMonth && goals[j].data().max_sale >= accumulateMonth) {
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
module.exports = router;
