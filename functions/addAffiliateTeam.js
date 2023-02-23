const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {FieldValue} = require("firebase-admin/firestore");
module.exports = functions.firestore
    .document("/affiliates/{docID}")
    .onCreate(async (snap, context) =>{
      const data = snap.data();
      const queryRel = await admin.firestore()
          .collection("relationships")
          .where("idClient", "==", data.email).get();
      if (!(queryRel.empty)) {
        const dataRelation = queryRel.docs[0].data();
        const dataAff = await dataRelation.belongsTo.get();
        const affiliate = dataRelation.belongsTo;
        await affiliate.update({
          levels_1: FieldValue.arrayUnion(snap.ref),
        });
        // eslint-disable-next-line max-len
        console.log(`Vinculacion entre ${data.email} con ${dataAff.data().email}`);
      }
    });
