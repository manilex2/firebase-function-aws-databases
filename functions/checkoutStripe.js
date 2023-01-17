/* eslint-disable max-len */
const express = require("express");
// const admin = require("firebase-admin");
// const nodemailer = require("nodemailer");
const cors = require("cors");
// const ejs = require("ejs");
// const qs = require("qs");
// const axios = require("axios").default;
// const generator = require("generate-password");
// eslint-disable-next-line new-cap
const router = express.Router();
const sdk = require("api")("@teachable/v1.0#63kp5w1zl9iqeony");

/*
const contextMail = {
  banner: "https://d8ff17fs33kjt.cloudfront.net/banners/Invrtir-banner+email.png",
  fecha: new Date().toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).toUpperCase(),
  subtitulo: "¡Tu cuenta para acceder a la App Invrtir ha sido creada!",
  // eslint-disable-next-line max-len
  descripcion_subtitulo: "Para descargar la aplicación haz clic ",
  // eslint-disable-next-line max-len
  mensaje_inicial: "A continuación, te mostramos las credenciales para que puedas ingresar a la app y empieces a generar dinero.",
  // eslint-disable-next-line max-len
  mensaje_advertencia: "Por motivos de seguridad, te sugerimos que la primera acción que realices al iniciar en tu cuenta sea <strong><mark>cambiar la contraseña</mark></strong>.",
  // eslint-disable-next-line max-len
  mensaje_contacto: "No dudes en contactarnos al siguiente email si tienes alguna duda o problema con nuestros servicios: ",
  url: "https://onelink.to/u8txrx",
  contacto: "contacto@invrtir.com",
};
*/
router.use(cors({origin: true}));
router.get("/", async function(req, res, next) {
  const formatoDeMoneda = (num) => `${num.slice(0, -2)}.${num.slice(-2)}`;
  const arraryProductPrices = [];
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_DEV);
  /*
  let products = await stripe.products.search({
    // eslint-disable-next-line no-useless-escape
    query: "active:'true' AND metadata['Plan']:'Prueba'",
  });
  */
  let products = await stripe.products.search({
    // eslint-disable-next-line no-useless-escape
    query: "active:'true'",
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
      if (
        products[i].id === prices[j].product &&
        prices[j].recurring != null &&
        prices[j].active === true
      ) {
        const infoPrices = {};
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
  // eslint-disable-next-line max-len
  res.render("landingForex_dev", {
    arraryProductPricesData: arraryProductPrices,
  });
});
router.get("/success", async function(req, res, next) {
  sdk.auth(process.env.KEY_TEACHEABLE);
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_DEV);
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
  );
  /*
  const token = generator.generate({
    length: 10,
    strict: true,
  });
  */
  // const dataPrice = subscription.items.data[0].price;
  const product = await stripe.products.retrieve(subscription.plan.product);
  // await generateReferralLink(token, customer.name, customer.email);
  /*
  // eslint-disable-next-line max-len
  const referenciaPlan = admin.firestore().collection("plans")
      .doc("plan_free");
  const product = await stripe.products.retrieve(subscription.plan.product);
  const docUser = await admin
      .firestore()
      .collection("users")
      .where("email", "==", customer.email)
      .get();
  if (docUser.empty) {
    sdk
        .createUser({
          name: customer.name,
          email: customer.email,
          src: "App Nativa",
        })
        .then((dataUser) => {
          if (dataPrice.recurring.interval === "week") {
            createAccounts(dataUser, customer, referenciaPlan, product, "month");
          } else if (dataPrice.recurring.interval === "year") {
            createAccounts(dataUser, customer, referenciaPlan, product, "anually");
          }
        })
        .catch((err) => console.error(err));
  } else {
    sdk.listUsers()
        .then(async ( usersTeachable ) => {
          const result = usersTeachable.data.users.filter((user) => user.email === docUser.docs[0].data().email);
          if (result.length ==0) {
            sdk
                .createUser({
                  name: docUser.docs[0].data().display_name,
                  email: docUser.docs[0].data().email,
                  src: "App Nativa",
                })
                .then(async (dataUser) =>{
                  await docUser.docs[0].ref.update({
                    teach_id: dataUser.data.id,
                  });
                  if (dataPrice.recurring.interval === "week") {
                    await updateEnroll("month", product, docUser, dataUser.data.id);
                  } else if (dataPrice.recurring.interval === "year") {
                    await updateEnroll("anually", product, docUser, dataUser.data.id);
                  }
                })
                .catch((err) => console.error(err));
          } else if (result.length > 0) {
            if (dataPrice.recurring.interval === "week") {
              await updateEnroll("month", product, docUser);
            } else if (dataPrice.recurring.interval === "year") {
              await updateEnroll("anually", product, docUser);
            }
          }
        })
        .catch((err) => console.error(err));
  }
  */
  res.render("success_StripeCheckout_dev", {
    customer: customer,
    product: product,
  });
});
router.post("/payPlan", async function(req, res, next) {
  const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_DEV);
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
    // eslint-disable-next-line max-len
    success_url: `${process.env.HOST_DOMAIN_INVRTIR_DEV}/planesForex/success?session_id={CHECKOUT_SESSION_ID}`,
    // eslint-disable-next-line max-len
    cancel_url: `${process.env.HOST_DOMAIN_INVRTIR_DEV}/planesForex?referral=${req.body.referral}#pricing`,
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
 * Función para crear las cuentas del usuario que está comprando el plan tanto el sistemas de Firebase,
 * Teachable y RewardFull.
 * @param {*} dataUser Data del Usuario correspondiente en Teachable, servirá para hacer enrroll
 * al plan que ha adquirida
 * @param {*} customer Data del Usuario correspondiente de Stripe, donde contiene la información de pago
 * @param {*} referenciaPlan Referencia del plan free para el sistema de acciones y crypto.
 * @param {*} product Dato del producto en Stripe que ha comprado el usuario
 * @param {*} type Dato que especifica que tipo de suscripción ha adquiridado el ussuario
 */
/*
async function createAccounts(dataUser, customer, referenciaPlan, product, type) {
  const rol = admin.firestore().collection("roles")
      .doc("customer");
  // eslint-disable-next-line max-len
  if (product.name === "BP-Plan Premium - Paquete Oportunidades + Sesiones en vivo") {
    sdk.enrollUser({
      user_id: dataUser.data.id,
      course_id: process.env.ID_TEACHEABLE_PLANPREMIUM,
    })
        .then(async ({data}) => {
          const password = generator.generate({
            length: 15,
            strict: true,
          });
          const token = generator.generate({
            length: 10,
            strict: true,
          });
          await admin.auth().createUser({
            displayName: customer.name,
            email: customer.email,
            password: password,
          }).then(async (response) => {
            // eslint-disable-next-line max-len
            const referenciaPlanForex = admin.firestore().collection("plans_forex")
                .doc(`plan_premium_${type}`);
            // eslint-disable-next-line max-len
            const user = admin.firestore().collection("users").doc(response.uid);
            // eslint-disable-next-line max-len
            const userJourneyProgress = admin.firestore().collection("journey_progress").doc();
            // eslint-disable-next-line max-len
            const userSetting = admin.firestore().collection("user_settings").doc();
            await userSetting.create({
              acceptProgramAfiliate: false,
              activate_guides_acciones: false,
              activate_guides_crypto: false,
              activate_investor_journey: false,
              activate_notifications: false,
              user: user,
              rol: rol,
            });
            await userJourneyProgress.create({
              crypto_progress: 1,
              steps_completed: ["investor_journey"],
              stock_progress: 1,
              user_emmail: customer.email,
            });
            const rewardFull = await generateReferralLink(token, response.displayName, response.email);
            await user.create({
              display_name: response.displayName,
              email: response.email,
              uid: response.uid,
              created_time: new Date(),
              plan_forex: referenciaPlanForex,
              plan: referenciaPlan,
              teach_id: dataUser.data.id,
              journey_progress: userJourneyProgress,
              user_discord: "",
              rewardfull_link: rewardFull.links[0].url,
              idRewardfull: rewardFull.id,
            });
            // eslint-disable-next-line max-len
            await sendMailInvrtir({response, password}, contextMail, transporter, false);
          }).catch(function(err) {
            console.error(err);
          });
        })
        .catch((err) => console.error(err));
  // eslint-disable-next-line max-len
  } else if (product.name === "BP-Plan 2 - Sesiones de operación en vivo") {
    sdk.enrollUser({
      user_id: dataUser.id,
      course_id: process.env.ID_TEACHEABLE_PLAN2,
    })
        .then(async ({data}) =>{
          const password = generator.generate({
            length: 15,
            numbers: true,
          });
          const token = generator.generate({
            length: 10,
            strict: true,
          });
          await admin.auth().createUser({
            displayName: customer.name,
            email: customer.email,
            password: password,
          }).then(async (response) => {
            // eslint-disable-next-line max-len
            const referenciaPlanForex = admin.firestore().collection("plans_forex")
                .doc(`plan_2_${type}`);
            // eslint-disable-next-line max-len
            const user = admin.firestore().collection("users").doc(response.uid);
            // eslint-disable-next-line max-len
            const userJourneyProgress = admin.firestore().collection("journey_progress").doc();
            // eslint-disable-next-line max-len
            const userSetting = admin.firestore().collection("user_settings").doc();
            await userSetting.create({
              acceptProgramAfiliate: false,
              activate_guides_acciones: false,
              activate_guides_crypto: false,
              activate_investor_journey: false,
              activate_notifications: false,
              user: user,
              rol: rol,
            });
            await userJourneyProgress.create({
              crypto_progress: 1,
              steps_completed: ["investor_journey"],
              stock_progress: 1,
              user_emmail: customer.email,
            });
            const rewardFull = await generateReferralLink(token, response.displayName, response.email);
            await user.create({
              display_name: response.displayName,
              email: response.email,
              uid: response.uid,
              created_time: new Date(),
              plan_forex: referenciaPlanForex,
              plan: referenciaPlan,
              teach_id: dataUser.id,
              journey_progress: userJourneyProgress,
              user_discord: "",
              rewardfull_link: rewardFull.links[0].url,
              idRewardfull: rewardFull.id,
            });
            await sendMailInvrtir({response, password}, contextMail, transporter, false);
          }).catch(function(err) {
            console.error(err);
          });
        })
        .catch((err) => console.error(err));
  // eslint-disable-next-line max-len
  } else if (product.name === "BP-Plan 1 - Oportunidades") {
    sdk.enrollUser({
      user_id: dataUser.id,
      course_id: process.env.ID_TEACHEABLE_PLAN1,
    })
        .then(async ({data}) => {
          const password = generator.generate({
            length: 15,
            numbers: true,
          });
          const token = generator.generate({
            length: 10,
            strict: true,
          });
          await admin.auth().createUser({
            displayName: customer.name,
            email: customer.email,
            password: password,
          }).then(async (response) => {
            // eslint-disable-next-line max-len
            const referenciaPlanForex = admin.firestore().collection("plans_forex")
                .doc(`plan_1_${type}`);
            // eslint-disable-next-line max-len
            const user = admin.firestore().collection("users").doc(response.uid);
            // eslint-disable-next-line max-len
            const userJourneyProgress = admin.firestore().collection("journey_progress").doc();
            // eslint-disable-next-line max-len
            const userSetting = admin.firestore().collection("user_settings").doc();
            await userSetting.create({
              acceptProgramAfiliate: false,
              activate_guides_acciones: false,
              activate_guides_crypto: false,
              activate_investor_journey: false,
              activate_notifications: false,
              user: user,
              rol: rol,
            });
            await userJourneyProgress.create({
              crypto_progress: 1,
              steps_completed: ["investor_journey"],
              stock_progress: 1,
              user_emmail: customer.email,
            });
            const rewardFull = await generateReferralLink(token, response.displayName, response.email);
            await user.create({
              display_name: response.displayName,
              email: response.email,
              uid: response.uid,
              created_time: new Date(),
              plan_forex: referenciaPlanForex,
              plan: referenciaPlan,
              teach_id: dataUser.id,
              journey_progress: userJourneyProgress,
              user_discord: "",
              rewardfull_link: rewardFull.links[0].url,
              idRewardfull: rewardFull.id,
            });
            await sendMailInvrtir({response, password}, contextMail, transporter, false);
          }).catch(function(err) {
            console.error(err);
          });
        })
        .catch((err) => console.error(err));
  }
}
*/
/**
 * Función para enviar un correo con la información de para poder ingresar a la app
 * @param {*} data datos del usuario
 * @param {*} contextMail cuerpo del correo
 * @param {*} transporter servicio de transporte para enviar el correo con el servicio de nodemailer
 * @param {Boolean} upgrade Valor booleano para identificar si el correo será cuando se un usuario ha hecho upgrade del plan
 */
/*
async function sendMailInvrtir(data, contextMail, transporter, upgrade) {
  let html;
  if (!upgrade) {
    contextMail["cliente"]= `<strong>${data.response.displayName}<strong>`;
    contextMail["credenciales"] = {
      correo: data.response.email,
      contrasenia: data.password,
    };
    html = await ejs.renderFile(
        "./views/email_new_user.ejs", contextMail);
    await transporter.sendMail({
      // eslint-disable-next-line max-len, quotes
      from: `"Invrtir" <contacto@invrtir.com>`,
      // eslint-disable-next-line max-len
      to: `"${data.response.displayName}" <${data.response.email}>`,
      subject: "Te damos la Bienvenida a Invrtir",
      text: html,
      html: html,
    })
        .then((res)=>{
          console.log("Message sent: %s", res.messageId);
        })
        .catch((err)=>{
          console.error(err);
        });
  } else {
    contextMail["cliente"]= `<strong>${data.displayName}<strong>`;
    html = await ejs.renderFile(
        "./views/email_upgrade_user.ejs", contextMail);
    await transporter.sendMail({
      // eslint-disable-next-line max-len, quotes
      from: `"Invrtir" <contacto@invrtir.com>`,
      // eslint-disable-next-line max-len
      to: `"${data.displayName}" <${data.email}>`,
      subject: "Te damos la Bienvenida a Invrtir",
      text: html,
      html: html,
    })
        .then((res)=>{
          console.log("Message sent: %s", res.messageId);
        })
        .catch((err)=>{
          console.error(err);
        });
  }
}
*/
/**
 * Función para enrolar a un curso a un usuario que ha hecho la compra
 * @param {*} type Dato que especifica que tipo de suscripción ha adquiridado el usuario
 * @param {*} product  Dato del producto en Stripe que ha comprado el usuario
 * @param {admin.firestore.QuerySnapshot<admin.firestore.DocumentData>} docUser  Documento de Firebase del usuario
 * @param {*} teachId  ID del usuario creado en teachable
 */
/*
async function updateEnroll(type, product, docUser, teachId) {
  const contextMail = {
    banner: "https://d8ff17fs33kjt.cloudfront.net/banners/Invrtir-banner+email.png",
    // eslint-disable-next-line max-len
    descripcion_subtitulo: `Gracias por suscribirte al Plan ${product.name}, en el cual tendrás acceso a:`,
    // eslint-disable-next-line max-len
    mensaje_contacto: "No dudes en contactarnos al siguiente email si tienes alguna duda o problema con nuestros servicios: ",
    url: "https://onelink.to/u8txrx",
    contacto: "contacto@invrtir.com",
  };
  if (product.name === "BP-Plan Premium - Paquete Oportunidades + Sesiones en vivo") {
    sdk.enrollUser({
      user_id: teachId,
      course_id: process.env.ID_TEACHEABLE_PLANPREMIUM,
    })
        .then(async ({data}) => {
          contextMail["caracteristicas"] = ["Acceso completo a nuestros cursos en línea de estrategias avanzadas en forex.", "Hasta 10 alertas de compra y venta en los horarios Horarios Asia, London y New York.", "Aula virtual de trading en vivo de 2 a 5 veces por semana y en Horarios de Asia, Londres y Nuevea York.", "Análisis a mediano plazo con principales pares e índices."];
          // eslint-disable-next-line max-len
          const referenciaPlanForex = admin.firestore().collection("plans_forex")
              .doc(`plan_premium_${type}`);
          await docUser.docs[0].ref.update({
            plan_forex: referenciaPlanForex,
          });
          const token = generator.generate({
            length: 10,
            strict: true,
          });
          updateReferallLink(token, docUser);
          // eslint-disable-next-line max-len
          await sendMailInvrtir({displayName: docUser.docs[0].data().display_name, email: docUser.docs[0].data().email}, contextMail, transporter, true);
        })
        .catch((err) => console.error(err));
  // eslint-disable-next-line max-len
  } else if (product.name === "BP-Plan 2 - Sesiones de operación en vivo") {
    sdk.enrollUser({
      user_id: teachId,
      course_id: process.env.ID_TEACHEABLE_PLAN2,
    })
        .then(async ({data}) =>{
          contextMail["caracteristicas"] = ["Aula virtual de trading en vivo de 2 a 5 veces por semana y en Horarios de Asia, Londres y Nuevea York.", "Análisis del mercado junto a los alumnos."];
          // eslint-disable-next-line max-len
          const referenciaPlanForex = admin.firestore().collection("plans_forex")
              .doc(`plan_2_${type}`);
          await docUser.docs[0].ref.update({
            plan_forex: referenciaPlanForex,
          });
          const token = generator.generate({
            length: 10,
            strict: true,
          });
          updateReferallLink(token, docUser);
          // eslint-disable-next-line max-len
          await sendMailInvrtir({displayName: docUser.docs[0].data().display_name, email: docUser.docs[0].data().email}, contextMail, transporter, true);
        })
        .catch((err) => console.error(err));
  // eslint-disable-next-line max-len
  } else if (product.name === "BP-Plan 1 - Oportunidades") {
    sdk.enrollUser({
      user_id: teachId,
      course_id: process.env.ID_TEACHEABLE_PLAN1,
    })
        .then(async ({data}) => {
          contextMail["caracteristicas"] = ["Acceso completo a nuestros cursos en línea de estrategias en forex.", "Hasta 5 alertas de compra y venta en los horarios Horarios Asia, London y New York"];
          // eslint-disable-next-line max-len
          const referenciaPlanForex = admin.firestore().collection("plans_forex")
              .doc(`plan_1_${type}`);
          await docUser.docs[0].ref.update({
            plan_forex: referenciaPlanForex,
          });
          const token = generator.generate({
            length: 10,
            strict: true,
          });
          updateReferallLink(token, docUser);
          // eslint-disable-next-line max-len
          await sendMailInvrtir({displayName: docUser.docs[0].data().display_name, email: docUser.docs[0].data().email}, contextMail, transporter, true);
        })
        .catch((err) => console.error(err));
  }
}
*/
/**
 * Funcion para crear un link de referidos y actualizarlo en el documeto de Firebase
 * @param {String} token String que servirá como token para crear el link de referido
 * @param {admin.firestore.QuerySnapshot<admin.firestore.DocumentData>} docUser Documento de Firebase correspondiente al usuario
 */
/*
async function updateReferallLink(token, docUser) {
  const name = (docUser.docs[0].data().display_name).split(" ");
  token = token.replace("_", "-");
  const data = {"first_name": name[0], "last_name": name[1], "email": docUser.docs[0].data().email, "token": token};
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${process.env.API_KEY_REWARDFULL}`,
    },
    data: qs.stringify(data),
    url: process.env.URL_CREATE_AFFILIADE_REWARDFULL,
  };
  await axios(options)
      .then(function(response) {
        docUser.docs[0].ref.update({
          rewardfull_link: response.data.links[0].url,
          idRewardfull: response.data.id,
        });
      })
      .catch(function(error) {
        console.err(error);
      });
}
*/
/**
 *  Funcion para generar el link de afiliado en el Sistema de RewardFull
 * @param {*} token token para general el link de afiliado
 * @param {*} displayName nombre de la persona afiliada
 * @param { *} email email de la persona afiliada
 * @return {JSON} Link de referido
 */
/*
async function generateReferralLink(token, displayName, email) {
  const name = displayName.split(" ");
  token = token.replace("_", "-");
  const data = {
    first_name: name[0],
    last_name: name[1],
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
        response = responseRW.data;
      })
      .catch(function(error) {
        if (error.response !== undefined) {
          const mensaje = error.response.data.mensaje;
          console.log(mensaje);
        } else {
          console.error(error);
        }
      });
  return response;
}
*/
module.exports = router;
