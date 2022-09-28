const express = require("express");
const cors = require("cors");
const app = express();
const PUERTO = 3000;
const forms = require("./forms");
const checkout = require("./checkoutStripe");
app.use(cors({origin: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/forms", forms);
app.use("/planesForex", checkout);
app.listen(PUERTO || process.env.PORT, () => {
  console.log("Escuchando en Puerto", PUERTO || process.env.PORT);
});

module.exports = app;
