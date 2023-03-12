const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const crypto = require("crypto");
AWS.config.update({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
});
const stepfunctions = new AWS.StepFunctions();
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(cors({origin: true}));
router.post("/", async function(req, res) {
  router.use(rawBodyMiddleware);
  const invokeStepFunction = async (params) => {
    try {
      const response = await stepfunctions.startExecution(params).promise();
      console.log("Invocación exitosa:", response);
      const rs = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        title: "Invocación exitosa",
        data: response,
      };
      res.send(rs);
    } catch (error) {
      console.error("Error al invocar la Step Function:", error);
      throw error;
    }
  };
  console.log(req.headers);
  /*
  const headers = JSON.parse(req.headers);
  if (Object.prototype.hasOwnProperty.call(headers, "X-Rewardful-Signature")) {
    res.writeHead(401);
    res.end("rejected");
    return;
  }
  */
  // const body = req.body;
  // eslint-disable-next-line quotes
  const rawBody = req.rawBody;
  console.log(rawBody);
  const signature = _generateSignature(rawBody);
  if (signature !== req.headers["x-rewardful-signature"]) {
    console.error("Auth Incorrect");
    res.status(400).json({
      status: 400,
      error: "Request Error",
      message: "Auth Incorrect",
    });
  } else {
    console.log(req.body);
    // const objectComission = JSON.parse(req.body);
    const params = {
      stateMachineArn:
        // eslint-disable-next-line max-len
        "arn:aws:states:us-east-2:174858107218:stateMachine:SystemWeebhookRewardfull",
      input: JSON.stringify(req.body),
    };
    invokeStepFunction(params);
  }
});
/**
 * Funcion para generar unna firma segun la clave secreta
 * del weebhook de Rewardfull
 * @param {JSON} body Cuerpo del response generado por el weebhook de Rewardfull
 * @return {String}
 */
function _generateSignature(body) {
  // eslint-disable-next-line max-len
  const hmac = crypto.createHmac(
      "sha256",
      process.env.SIGNING_SECRET_WEEBHOOK_REWARDFULL_COMISSION_CREATED,
  );

  // hmac.update( `${ method.toUpperCase() }${ url }${ rewardfullSignature }` );

  if (body) {
    hmac.update(body);
  }

  return hmac.digest("hex");
}
/**
 * Funcion para obtener un body sin procesar.
 * @param {*} req data
 * @param {*} res data
 * @param {*} next data
 */
function rawBodyMiddleware(req, res, next) {
  let data = "";
  req.setEncoding("utf8");

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    req.rawBody = data;
    next();
  });
}

module.exports = router;
