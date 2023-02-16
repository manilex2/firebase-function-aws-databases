const functions = require("firebase-functions");
const admin = require("firebase-admin");
const generator = require("generate-password");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
});
AWS.config.region = "us-east-2";
const lambda = new AWS.Lambda();
module.exports = functions.firestore
    .document("/affiliates/{docId}/sales/{subDocId}")
    .onCreate(async (snap, context) => {
      const data = snap.data();
      const dataReferral = (await data.ref_client.get()).data();
      console.log(dataReferral);
      if (dataReferral.platform == "app") {
        const refPlan = await data.ref_product.get();
        const refPlanVariation = await data.ref_product_variation.get();
        // eslint-disable-next-line max-len
        const displayName =
        dataReferral.name_client + " " + dataReferral.lastname_client;
        const emailClient = dataReferral.email;
        console.log(displayName, emailClient);
        const password = generator.generate({
          length: 15,
          strict: true,
        });
        const queryUser = await admin
            .firestore()
            .collection("users")
            .where("email", "==", emailClient)
            .get();
        if (queryUser.empty) {
          await admin
              .auth()
              .createUser({
                displayName: displayName,
                email: emailClient,
                password: password,
              })
              .then(async (user) => {
                const rol = admin.firestore().collection("rol").doc("customer");
                // eslint-disable-next-line max-len
                const inscription = admin
                    .firestore()
                    .collection("inscriptions")
                    .doc();
                // eslint-disable-next-line max-len
                const newuser = admin.firestore().collection("users").doc(user.uid);
                // eslint-disable-next-line max-len
                const userJourneyProgress = admin
                    .firestore()
                    .collection("journey_progress")
                    .doc();
                // eslint-disable-next-line max-len
                const userSetting = admin
                    .firestore()
                    .collection("user_settings")
                    .doc();
                const currentDate = new Date();
                currentDate.setHours(currentDate.getHours() - 5);
                let endDate;
                const dataPlanVariation = refPlanVariation.data();
                if (dataPlanVariation.code_name == "month") {
                  endDate = new Date(currentDate);
                  endDate.setDate(endDate.getDate() + 30);
                } else if (dataPlanVariation.code_name == "quarterly") {
                  endDate = new Date(currentDate);
                  endDate.setDate(endDate.getDate() + 90);
                } else if (dataPlanVariation.code_name == "half_yearly") {
                  endDate = new Date(currentDate);
                  endDate.setDate(endDate.getDate() + 180);
                } else if (dataPlanVariation.code_name == "anually") {
                  endDate = new Date(currentDate);
                  endDate.setDate(endDate.getDate() + 360);
                }
                await inscription.create({
                  active: true,
                  plan_variation: data.ref_product_variation,
                  plan: data.ref_product,
                  init_date: currentDate,
                  user: newuser,
                  end_date: endDate,
                });
                await userSetting.create({
                  accept_program_affiliate: false,
                  profile_complete: false,
                  activate_guides_acciones: false,
                  activate_guides_crypto: false,
                  activate_investor_journey: false,
                  activate_notifications: false,
                  activate_notifications_oportunity: false,
                  active_notifications_meetings: false,
                  active_notifications_news: false,
                  activate_notifications_promotions: false,
                  user: newuser,
                  rol: rol,
                });
                await userJourneyProgress.create({
                  crypto_progress: 1,
                  steps_completed: ["investor_journey"],
                  stock_progress: 1,
                  user_email: user.email,
                });
                await newuser.create({
                  display_name: user.displayName,
                  first_name: dataReferral.name_client,
                  last_name: dataReferral.lastname_client,
                  email: user.email,
                  uid: user.uid,
                  created_time: new Date(),
                  inscription: inscription,
                  plan: data.ref_product,
                  plan_variation: data.ref_product_variation,
                  journey_progress: userJourneyProgress,
                  user_discord: "",
                  aceptaTerminosAfiliados: false,
                });
                const response = {
                  statusCode: 200,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    status: 200,
                    typePay: "no-upgrade",
                    dataUser: {
                      displayName: user.displayName,
                      email: user.email,
                      password: password,
                    },
                  }),
                };
                const params = {
                  FunctionName: "send-email-user",
                  InvocationType: "RequestResponse",
                  LogType: "Tail",
                  Payload: JSON.stringify(response),
                };
                await lambda
                    .invoke(params)
                    .promise()
                    .then(
                        function(data) {
                          console.log("Success!");
                          console.log(JSON.stringify(data));
                          return data;
                        },
                        function(error) {
                          console.log("Error");
                          console.error(error);
                          console.log(JSON.stringify(error));
                          return error;
                        },
                    );
              })
              .catch((error) => {
                console.error(error);
              });
        } else {
          let currentDate;
          let endDate;
          const dataPlan = refPlan.data();
          const dataPlanVariation = refPlanVariation.data();
          if (dataPlanVariation.code_name == "month") {
            endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 30);
          } else if (dataPlanVariation.code_name == "quarterly") {
            endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 90);
          } else if (dataPlanVariation.code_name == "half_yearly") {
            endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 180);
          } else if (dataPlanVariation.code_name == "anually") {
            endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 360);
          }
          queryUser.docs[0].ref.update({
            plan: data.ref_product,
            plan_variation: data.ref_product,
          });
          queryUser.docs[0].data().inscription.update({
            active: true,
            plan_variation: data.ref_product_variation,
            plan: data.ref_product,
            init_date: currentDate,
            end_date: endDate,
          });
          const response = {
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: 200,
              typePay: "upgrade",
              dataUser: {
                displayName: queryUser.docs[0].data().displayName,
                email: queryUser.docs[0].data().email,
              },
              infoPlan: {
                plan: dataPlan.code_name,
                plan_name: dataPlan.name,
                plan_variation: dataPlanVariation.code_name,
              },
            }),
          };
          const params = {
            FunctionName: "send-email-user",
            InvocationType: "RequestResponse",
            LogType: "Tail",
            Payload: JSON.stringify(response),
          };
          await lambda
              .invoke(params)
              .promise()
              .then(
                  function(data) {
                    console.log("Success!");
                    console.log(JSON.stringify(data));
                    return data;
                  },
                  function(error) {
                    console.log("Error");
                    console.error(error);
                    console.log(JSON.stringify(error));
                    return error;
                  },
              );
        }
      }
    });
