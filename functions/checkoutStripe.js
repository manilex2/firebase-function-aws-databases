const express = require("express");

// eslint-disable-next-line new-cap
const router = express.Router();
router.get("/", async function(req, res, next) {
  const formatoDeMoneda = (num) => `${num.slice(0, -2)}.${num.slice(-2)}`;
  const arraryProductPrices = [];
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_PROD);
  let products = await stripe.products.search({
    // eslint-disable-next-line no-useless-escape
    query: "active:'true' AND metadata[\'Plan\']:\'Bluepips\'",
  });
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
      if (products[i].id === prices[j].product &&
        prices[j].recurring != null && prices[j].active === true) {
        const infoPrices = {};
        // console.log(price);
        productsPrices["id"] = products[i].id;
        productsPrices["name"] = products[i].name;
        productsPrices["description"] = products[i].description;
        infoPrices["id"] = prices[j].id;
        if (prices[j].recurring.interval === "week") {
          infoPrices["type"] = "Semanal";
          infoPrices["order"] = 1;
        } else if (prices[j].recurring.interval === "year") {
          infoPrices["type"] = "Anual";
          infoPrices["order"] = 2;
        }
        infoPrices["img"] = prices[j].nickname;
        infoPrices["valor"] = formatoDeMoneda(prices[j].unit_amount_decimal);

        arrayPrices.push(infoPrices);

        productsPrices["prices"] = arrayPrices;
      }
    }
    if (Object.keys(productsPrices).length > 0) {
      const oJSON = await sortJSON(productsPrices["prices"], "order", "asc");
      productsPrices["prices"] = oJSON;
      arraryProductPrices.push(productsPrices);
    }
  }

  res.render("landingForex",
      {arraryProductPricesData: arraryProductPrices});
});
router.get("/success", async function(req, res, next) {
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_PROD);
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
  );
  const product = await stripe.products.retrieve(
      subscription.plan.product,
  );
  res.render("success_StripeCheckout",
      {customer: customer, product: product});
});
router.post("/payPlan", async function(req, res, next) {
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_PROD);
  const referralCode = req.body.referral;
  const idPrice = req.body.idPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: idPrice,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `http://${process.env.HOST_DOMAIN_INVRTIR}/planesForex/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://${process.env.HOST_DOMAIN_INVRTIR}/planesForex?referral=${req.body.referral}#pricing`,
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
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }

    if (orden === "desc") {
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }
  });
}
module.exports = router;
