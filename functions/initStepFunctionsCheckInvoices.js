const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
// const crypto = require("crypto");
AWS.config.update({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
});
const stepfunctions = new AWS.StepFunctions();
const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE_PROD);
const endpointSecret = process.env.SIGNIN_SECRET_STRIPE_WEEBHOOK_INVOICE_UPDATE;
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(cors({origin: true}));

router.post("/checkInvoices", async function(req, res) {
  const sig = req.headers["stripe-signature"];
  let dataEvent;
  try {
    dataEvent = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret,
    );
  } catch (error) {
    console.log("Weebhook error");
    console.log(error.message);
    res.status(400).json({
      status: 400,
      error: "Request Error",
      message: "Auth Incorrect",
      err: error.message,
    });
  }
  switch (dataEvent.type) {
    case "invoice.updated": {
      const invoiceUpdated = dataEvent.data.object;
      // Then define and call a function to handle the event invoice.updated
      const params = {
        stateMachineArn:
          // eslint-disable-next-line max-len
          "arn:aws:states:us-east-2:174858107218:stateMachine:StateFunctionsCheckInvoices",
        input: JSON.stringify(invoiceUpdated),
      };
      const result = await invokeStepFunction(params);
      if (result.statusCode == 200) {
        const rs = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          title: "Invocación exitosa",
          data: result,
        };
        res.send(rs);
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${dataEvent.type}`);
  }
});
/**
 * Función asincrona que inicia la Step Function en AWS para verifica el chequeo
 * de pagos y su correspondiente actualización en firebase.
 * @param {*} params Datos de la Step Function
 */
async function invokeStepFunction(params) {
  try {
    const response = await stepfunctions.startExecution(params).promise();
    console.log("Invocación exitosa:", response);
    return {
      statusCode: 200,
      data: response,
    };
  } catch (error) {
    console.error("Error al invocar la Step Function:", error);
    return {
      statusCode: 400,
    };
  }
}

module.exports = router;
