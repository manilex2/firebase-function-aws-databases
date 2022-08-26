/* eslint-disable space-before-blocks */
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
app.use(cors({origin: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const eventStr = req.query.event.replace("&", " ");
  return res.render("viewformEmailOctupus", {
    affcode: req.query.affcode,
    event: eventStr,
    idZoom: req.query.idZoom,
  });
});

app.post("", async (req, res) => {
  const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${process.env.ID_LIST_WEBINAR}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.API_KEY_OCTOPUS,
          email_address: req.body.inputEmail,
          fields: {
            FirstName: req.body.inputName,
            LastName: req.body.inputLastName,
            Pais: req.body.inputCountry,
            Whatsapp: req.body.inputPhone,
            affcode: req.body.inputAffcode,
            Evento: req.body.inputEvent,
            IDZoom: req.body.inputZoom,
          },
        }),
      },
  );
  if (response.status === 200){
    res.redirect("https://invrtir.com/p/webinar-confirmation");
  }
});
module.exports = app;
