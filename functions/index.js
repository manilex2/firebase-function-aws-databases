const functions = require("firebase-functions");
const usuarios = require("./usuarios");
const planes = require("./planes");
const idosIcos = require("./idosIcos");
const oportCripto = require("./oportCripto");
const chartProy = require("./chartProy");

exports.ping = functions.https.onRequest((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  // eslint-disable-next-line max-len
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET");
  res.json({"SUCCESS": "200"});
});
exports.usuarios = functions.https.onRequest(usuarios);
exports.planes = functions.https.onRequest(planes);
exports.idosIcos = functions.https.onRequest(idosIcos);
exports.oportCripto = functions.https.onRequest(oportCripto);
exports.chartProy = functions.https.onRequest(chartProy);
