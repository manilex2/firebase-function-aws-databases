const functions = require("firebase-functions");
// const admin = require("firebase-admin");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const express = require("express");
// const cors = require("cors");
const sendEmail = express();
sendEmail.set("view engine", "ejs");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_GMAIL_INVRTIR, // generated ethereal user
    pass: process.env.PASSWORD_GMAIL_INVRTIR, // generated ethereal password
  },
});
const contextMail = {
  banner: "https://d8ff17fs33kjt.cloudfront.net/banners/Invrtir-banner+email.png",
  subtitulo: "¡Te damos la bienvenida a Invrtir!",
  // eslint-disable-next-line max-len
  caracteristicas: ["Hasta 10 alertas semanales en los horarios de Nueva York, Londres y Asia", "Cursos de las diferentes estrategias en forex, que se actualizarán cada cierto tiempo", "Sesiones en vivo de trading para que aprendas y generes ganancias al mismo tiempo"],
  // eslint-disable-next-line max-len
  descripcion_subtitulo: "Actualmente estás en la suscripción gratis de nuestra App. En ella, tendrás acceso a un grupo de Telegram en el que recibirás hasta 4 alertas de inversión semanales para que puedas aprovechar y también acceso a un curso sobre estrategias de Forex que te pueden ayudar a maximizar tus resultados.",
  // eslint-disable-next-line max-len
  mensaje_inicial: "Sin embargo, debes saber que si accedes a nuestros planes de suscripción tendrás acceso a:",
  // eslint-disable-next-line max-len
  mensaje_advertencia: "Para saber más información, haz click ",
  // eslint-disable-next-line max-len
  mensaje_contacto: "No dudes en contactarnos al siguiente email si tienes alguna duda o problema con nuestros servicios: ",
  url: "https://native.invrtir.com/planesForex",
  contacto: "contacto@invrtir.com",
};
/*
sendEmail.use(cors({origin: true}));
sendEmail.get("/", async (req, res)=>{
  contextMail["cliente"]= "<strong>Paul<strong>";
  return res.render("email_new_user_mobile", contextMail);
});
module.exports = sendEmail;
*/

module.exports = functions.firestore.document("/users/{currentId}")
    .onCreate(async (doc, context)=>{
      console.log(doc.data());
      contextMail["cliente"]= `<strong>${doc.data().display_name}<strong>`;
      const html = await ejs.renderFile(
          "./views/email_new_user_mobile.ejs", contextMail);
      await transporter.sendMail({
        // eslint-disable-next-line max-len, quotes
        from: `"Invrtir" <contacto@invrtir.com>`,
        // eslint-disable-next-line max-len
        to: `"${doc.data().display_name}" <${doc.data().email}>`,
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
    });
