const express = require("express");
const cors = require("cors");
const qs = require("qs");
const axios = require("axios").default;
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(cors({origin: true}));

router.post("/generateSSO", async function(req, res) {
  res.set("Content-Type", "application/json");
  // eslint-disable-next-line max-len
  const response = await axios.get(`${process.env.URL_CREATE_AFFILIADE_REWARDFULL}/${req.body.id}/sso`, {
    headers: {
      "Authorization": `Basic ${process.env.API_KEY_REWARDFULL}`,
    },
  });
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
module.exports = router;
