const functions = require("firebase-functions");
const usuarios = require("./usuarios");
const planes = require("./planes");
const idosIcos = require("./idosIcos");
const oportCriptoLinks = require("./oportCriptoLinks");
const chartProy = require("./chartProy");
const cryptoList = require("./cryptoList");
const oportSegCrypto = require("./oportSegCrypto");
const marketData = require("./marketData");
const precioActual = require("./precioActual");
const investmentCalculator = require("./investmentCalculator");
const createCurrentPrice = require("./createCurrentPriceTable");
const updatePrice = require("./updateTransactionPortfolio");
const ranking = require("./ranking");
const addUserToDiscord = require("./addUserToDiscord");
const addCoursestoPlan = require("./addCoursestoPlan");
<<<<<<< HEAD
const formEmailOctupus = require("./formEmailOctupus");
=======
const createCryptosInfo = require("./createCryptosInfo");
>>>>>>> 0b5227e1cb719661b97b3c4b3d6cf77503c40c07

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
exports.oportCriptoLinks = functions.https.onRequest(oportCriptoLinks);
exports.chartProy = functions.https.onRequest(chartProy);
exports.cryptoList = functions.https.onRequest(cryptoList);
exports.oportSegCrypto = functions.https.onRequest(oportSegCrypto);
exports.marketData = functions.https.onRequest(marketData);
exports.precioActual = functions.https.onRequest(precioActual);
exports.ranking = functions.https.onRequest(ranking);
exports.investmentCalculator = functions.https.onRequest(investmentCalculator);
exports.createCurrentPriceTable= functions.https.onRequest(createCurrentPrice);
exports.updateTransactionPortfolio= updatePrice;
exports.addUserToDiscord = functions.https.onRequest(addUserToDiscord);
exports.addCoursestoPlan = functions.https.onRequest(addCoursestoPlan);
<<<<<<< HEAD
exports.formEmailOctupus = functions.https.onRequest(formEmailOctupus);
=======
exports.createCryptosInfo = functions.https.onRequest(createCryptosInfo);
>>>>>>> 0b5227e1cb719661b97b3c4b3d6cf77503c40c07
