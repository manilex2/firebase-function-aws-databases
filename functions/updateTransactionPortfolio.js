/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable no-undef */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

module.exports = functions.firestore
    .document("/precio_criptos_actual/{currentId}")
    .onUpdate(async (doc, context)=>{
      const currentprices = doc.after.data();
      currentprices["currentId"] = context.params.currentId;
      const query = await admin.firestore().collection("transaction_portfolio")
      .where("id", "==", currentprices.id).get();
      if (!query.empty) {
        for (let i=0; i<query.size; i++) {
          const price = Number(currentprices.price);
          const transaction = await admin.firestore().
          collection("transaction_portfolio").doc(query.docs.pop().id).get();
          const totalValue = transaction.data().amount * price;
          const profitGenerated = totalValue - transaction.data().investment_realized;
          const profitabilityGenerated = profitGenerated / transaction.data().investment_realized;
          await transaction.ref.
            update(
              {"profit_generated": profitGenerated,
              "profitability_generated": profitabilityGenerated,
              "total_value": totalValue})
            .catch((err)=>{
              functions.logger.log("Error Updated: Transaction\\{"+transaction.data().transactionId+"\\}, Error: "+err);
          });
        }
      }
    });
