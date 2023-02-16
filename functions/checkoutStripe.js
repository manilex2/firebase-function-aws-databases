/* eslint-disable max-len */
const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
});
const stepfunctions = new AWS.StepFunctions();
// eslint-disable-next-line new-cap
const router = express.Router();
const sdk = require("api")("@teachable/v1.0#63kp5w1zl9iqeony");
router.use(cors({origin: true}));
router.get("/", async function(req, res, next) {
  const formatoDeMoneda = (num) => `${num.slice(0, -2)}.${num.slice(-2)}`;
  const jsonProductPrices = {};
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_PROD);
  let products = await stripe.products.search({
    // eslint-disable-next-line no-useless-escape
    query: "active:'true' AND metadata['Version']:'InvrtirFX'",
  });
  /*
  let products = await stripe.products.search({
    // eslint-disable-next-line no-useless-escape
    query: "active:'true'",
  });
  */
  products = products.data;
  for (let i = 0; i < products.length; i++) {
    const productsPrices = {};
    const arrayPrices = [];
    let prices = await stripe.prices.search({
      // eslint-disable-next-line no-useless-escape
      query: `product: \'${products[i].id}\' AND active:\'true\'`,
    });
    prices = prices.data;
    for (let j = 0; j < prices.length; j++) {
      if (
        products[i].id === prices[j].product &&
        prices[j].recurring != null &&
        prices[j].active === true
      ) {
        const infoPrices = {};
        productsPrices["id"] = products[i].id;
        productsPrices["name"] = products[i].metadata.Nombre;
        productsPrices["description"] = products[i].metadata.DescripcionHtml;
        productsPrices["img"] = products[i].metadata.Imagen;
        infoPrices["id"] = prices[j].id;
        infoPrices["type"] = prices[j].metadata.Tipo;
        infoPrices["name"] = prices[j].metadata.Nombre;
        infoPrices["savings"] = prices[j].metadata.Ahorro;
        infoPrices["value"] = Number(
            formatoDeMoneda(prices[j].unit_amount_decimal),
        );
        arrayPrices.push(infoPrices);
        productsPrices["prices"] = arrayPrices;
      }
    }
    if (Object.keys(productsPrices).length > 0) {
      const oJSON = await sortJSON(productsPrices["prices"], "value", "desc");
      productsPrices["prices"] = oJSON;
      jsonProductPrices[productsPrices["id"]] = productsPrices;
    }
  }
  console.log(jsonProductPrices);
  for (const key in jsonProductPrices) {
    if (Object.prototype.hasOwnProperty.call(jsonProductPrices, key)) {
      console.log(jsonProductPrices[key]);
    }
  }
  // eslint-disable-next-line max-len
  res.render("landing_forex_v2", {
    jsonProductPrices: jsonProductPrices,
  });
});
router.get("/success", async function(req, res, next) {
  sdk.auth(process.env.KEY_TEACHEABLE);
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_PROD);
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
  );
  const dataPrice = subscription.items.data[0].price;
  const product = await stripe.products.retrieve(subscription.plan.product);
  let params;
  if (subscription.trial_end != null && subscription.trial_start != null) {
    params = {
      stateMachineArn:
        "arn:aws:states:us-east-2:174858107218:stateMachine:SystemAffiliate",
      input: JSON.stringify({
        dataUser: {
          displayName: customer.name,
          email: customer.email,
        },
        dataCourse: {
          idPlanFirebase: product.metadata.IDFirebase,
          idPlanRecurring: dataPrice.metadata.IDFirebase,
          is_trial: true,
          init_inscription: subscription.trial_start * 1000,
          end_inscription: subscription.trial_end * 1000,
        },
      }),
    };
  } else {
    params = {
      stateMachineArn:
        "arn:aws:states:us-east-2:174858107218:stateMachine:SystemAffiliate",
      input: JSON.stringify({
        dataUser: {
          displayName: customer.name,
          email: customer.email,
        },
        dataCourse: {
          idPlanFirebase: product.metadata.IDFirebase,
          idPlanRecurring: dataPrice.metadata.IDFirebase,
          is_trial: false,
        },
      }),
    };
  }

  stepfunctions
      .startExecution(params)
      .promise()
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  res.render("success_StripeCheckout", {
    customer: customer,
    product: product,
  });
});
router.post("/payPlan", async function(req, res, next) {
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_PROD);
  const referralCode = req.body.referral;
  const idPrice = req.body.idPrice;
  const discountCode = req.body.discountCode;
  console.log(discountCode);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: idPrice,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_settings: {end_behavior: {missing_payment_method: "cancel"}},
      trial_period_days: parseInt(
          getDaysBetweenDates(new Date(), new Date("2023-02-28T23:59:59")),
      ),
    },
    payment_method_collection: "if_required",
    mode: "subscription",
    discounts: [
      {
        coupon: discountCode,
      },
    ],
    // eslint-disable-next-line max-len
    success_url: `${process.env.HOST_DOMAIN_INVRTIR}/planesInvrtir/success?session_id={CHECKOUT_SESSION_ID}`,
    // eslint-disable-next-line max-len
    cancel_url: `${process.env.HOST_DOMAIN_INVRTIR}/planesInvrtir?referral=${req.body.referral}`,
    automatic_tax: {enabled: true},
    client_reference_id: referralCode || "checkout_" + new Date().getTime(),
  });
  res.redirect(303, session.url);
});
/**
 * Funcion que ordena un JSON por medio del valor de una de sus propiedades
 * @param {*} data Json Original sin ser ordenado
 * @param {*} key  Especifica la clave para ordenar
 * @param {*} orden asc o desc
 * @return {JSON} Retorna el json ordenado
 */
async function sortJSON(data, key, orden) {
  return data.sort(function(a, b) {
    const x = a[key];
    const y = b[key];

    if (orden === "asc") {
      return x < y ? -1 : x > y ? 1 : 0;
    }

    if (orden === "desc") {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  });
}
/**
 * Function que retorna la diferencia de dias entre dos fechas.
 * @param {Date} startDate Dia actual cuando se consulta.
 * @param {Date} endDate Fin de la fecha.
 * @return {int} Diferencia de Dias.
 */
function getDaysBetweenDates(startDate, endDate) {
  // Obtener el tiempo en milisegundos entre las dos fechas
  const differenceInTime = endDate.getTime() - startDate.getTime();

  // Dividir el tiempo en milisegundos entre un día (en milisegundos)
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  // Devolver la cantidad de días
  return differenceInDays;
}
module.exports = router;
