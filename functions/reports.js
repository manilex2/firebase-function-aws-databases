const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");
const app = express();
app.use(cors({origin: true}));
app.set("view engine", "ejs");
app.get(`/${process.env.API_KEY}`, (req, res) => {
  const nombre = "req.body.name";
  const fecha = "req.body.date";
  const data = {nombre: nombre, fecha: fecha};
  console.log(data);
  res.render("reporte", data);
});
app.post(`/${process.env.API_KEY}`, (req, res) => {
  res.set("Content-Type", "application/json");
  const nombre = req.body.name;
  const fecha = req.body.date;
  const person = {nombre: nombre, fecha: fecha};
  // eslint-disable-next-line max-len
  ejs.renderFile(path.join(__dirname, "./views/", "reporte.ejs"), person, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const options = {
        "height": "11.25in",
        "width": "8.5in",
        "header": {
          "height": "20mm",
        },
        "footer": {
          "height": "20mm",
        },
      };
      pdf.create(result, options).toFile("report.pdf", function(err, data) {
        if (err) {
          res.send(err);
        } else {
          console.log(data);
          const file = fs.readFileSync(data.filename);
          res.contentType("application/pdf");
          res.send(file);
          // res.send("File created successfully");
        }
      });
    }
  });
});

module.exports = app;
