const functions = require("firebase-functions");
// const usuarios = require("./usuarios");
// const planes = require("./planes");
const idosIcos = require("./idosIcos");
const oportCriptoLinks = require("./oportCriptoLinks");
const chartProy = require("./chartProy");
const cryptoList = require("./cryptoList");
const oportSegCrypto = require("./oportSegCrypto");
const marketData = require("./marketData");
const precioActual = require("./precioActual");
const investmentCalculator = require("./investmentCalculator");
const updatePrice = require("./updateTransactionPortfolio");
// const sendMailNewUser = require("./sendEmailNewUsers");
const ranking = require("./ranking");
const addUserToDiscord = require("./addUserToDiscord");
const addCoursestoPlan = require("./addCoursestoPlan");
const routes = require("./routes");
const adminForex = require("./createAccountAdmin");
const rewardFull = require("./rewardfull");
const reports = require("./reports");
const alertForex = require("./alertaForex");
const admin = require("firebase-admin");
const salesWeekAffiliate = require("./salesWeekAffiliate");
const createUserManuallySell = require("./createUser_ManuallySell");
const addAffiliateTeam = require("./addAffiliateTeam");
const initStepFunctionsWeebhook = require("./initStepFunctionsWeebhook");
// eslint-disable-next-line max-len
const initStepFunctionsCheckInvoices = require("./initStepFunctionsCheckInvoices");
admin.initializeApp();
exports.ping = functions.https.onRequest((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  // eslint-disable-next-line max-len
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET");
  res.json({"SUCCESS": "200"});
});
// exports.usuarios = functions.https.onRequest(usuarios);
// exports.planes = functions.https.onRequest(planes);
exports.idosIcos = functions.https.onRequest(idosIcos);
exports.oportCriptoLinks = functions.https.onRequest(oportCriptoLinks);
exports.chartProy = functions.https.onRequest(chartProy);
exports.cryptoList = functions.https.onRequest(cryptoList);
exports.oportSegCrypto = functions.https.onRequest(oportSegCrypto);
exports.marketData = functions.https.onRequest(marketData);
exports.precioActual = functions.https.onRequest(precioActual);
exports.ranking = functions.https.onRequest(ranking);
// eslint-disable-next-line max-len
exports.investmentCalculator = functions.https.onRequest(investmentCalculator);
exports.updateTransactionPortfolio= updatePrice;
// exports.sendMailNewUser= functions.https.onRequest(sendMailNewUser);
// exports.sendMailNewUser= sendMailNewUser;
exports.createUserManuallySell = createUserManuallySell;
exports.addUserToDiscord = functions.https.onRequest(addUserToDiscord);
exports.addCoursestoPlan = functions.https.onRequest(addCoursestoPlan);
exports.routes = functions.https.onRequest(routes);
exports.reports = functions.https.onRequest(reports);
exports.adminForex = functions.https.onRequest(adminForex);
exports.alertForex = functions.https.onRequest(alertForex);
exports.rewardFull = functions.https.onRequest(rewardFull);
exports.salesWeekAffiliate = functions.https.onRequest(salesWeekAffiliate);
// eslint-disable-next-line max-len
exports.initStepFunctionsWeebhook = functions.https.onRequest(initStepFunctionsWeebhook);
// eslint-disable-next-line max-len
exports.initStepFunctionsCheckInvoices = functions.https.onRequest(initStepFunctionsCheckInvoices);
exports.addAffiliateTeam = addAffiliateTeam;
