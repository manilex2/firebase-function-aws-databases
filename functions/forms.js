/* eslint-disable max-len */
/* eslint-disable space-before-blocks */
require("dotenv").config();
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const fetch = require("node-fetch");


// ---------------------------------------------------------------- Formulario Webimar 1 ---------------------------------------------------------------- //
router.get("/webinar1", (req, res) => {
  const eventStr = req.query.event.replace("&", " ");
  return res.render("webinar1", {
    affcode: req.query.affcode,
    event: eventStr,
    idZoom: req.query.idZoom,
  });
});
router.post("/webinar1", async (req, res) => {
  await registerWebinar(req.body, process.env.ID_LIST_WEBINAR1);
  const paramsString = `event=${req.body.inputEvent}`;
  const searchParams = new URLSearchParams(paramsString);
  res.redirect("https://invrtir.com/p/webinar-confirmation?"+ searchParams);
});
// ---------------------------------------------------------------- Formulario Webimar 2 ---------------------------------------------------------------- //
router.get("/webinar2", (req, res) => {
  const eventStr = req.query.event.replace("&", " ");
  return res.render("webinar2", {
    affcode: req.query.affcode,
    event: eventStr,
    idZoom: req.query.idZoom,
  });
});

router.post("/webinar2", async (req, res) => {
  await registerWebinar(req.body, process.env.ID_LIST_WEBINAR2);
  const paramsString = `event=${req.body.inputEvent}`;
  const searchParams = new URLSearchParams(paramsString);
  res.redirect("https://invrtir.com/p/webinar-confirmation?"+ searchParams);
});
// ---------------------------------------------------------------- Formulario Webimar 3 ---------------------------------------------------------------- //
router.get("/webinar3", (req, res) => {
  const eventStr = req.query.event.replace("&", " ");
  return res.render("webinar3", {
    affcode: req.query.affcode,
    event: eventStr,
    idZoom: req.query.idZoom,
  });
});

router.post("/webinar3", async (req, res) => {
  await registerWebinar(req.body, process.env.ID_LIST_WEBINAR2);
  const paramsString = `event=${req.body.inputEvent}`;
  const searchParams = new URLSearchParams(paramsString);
  res.redirect("https://invrtir.com/p/webinar-confirmation?"+ searchParams);
});
/**
 * Función que registra a un nuevo usuario en un webinar
 * @param {*} request Datos del formulario
 * @param {*} idWebinar ID del Webinar
 */
async function registerWebinar(request, idWebinar){
  await fetch(
      `https://emailoctopus.com/api/1.6/lists/${idWebinar}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.API_KEY_OCTOPUS,
          email_address: request.inputEmail,
          fields: {
            FirstName: request.inputName,
            LastName: request.inputLastName,
            Pais: request.inputCountry,
            Whatsapp: request.inputPhone,
            affcode: request.inputAffcode,
            Evento: request.inputEvent,
            IDZoom: request.inputZoom,
          },
        }),
      },
  );
}
module.exports = router;
