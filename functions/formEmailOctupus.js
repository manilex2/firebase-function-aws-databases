/* eslint-disable space-before-blocks */
require("dotenv").config();
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", (req, res) => {
  const eventStr = req.query.event.replace("&", " ");
  return res.render("viewformEmailOctupus", {
    affcode: req.query.affcode,
    event: eventStr,
    idZoom: req.query.idZoom,
  });
});

router.post("/", async (req, res) => {
  const request = req.body;
  const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${process.env.ID_LIST_WEBINAR}/contacts`,
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
  if (response.status === 200) {
    res.redirect("https://invrtir.com/p/webinar-confirmation");
  }
});

module.exports = router;