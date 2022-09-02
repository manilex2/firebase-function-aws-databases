/* eslint-disable max-len */
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
// const fs = require("fs");
const nodemailer = require("nodemailer");
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
  const transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for other ports
    auth: {
      user: "pauldelpezo@gmail.com", // generated ethereal user
      pass: "vhbxnuouduqxexsl", // generated ethereal password
    },
  });
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
      pdf.create(result, options).toBuffer(function(err, buffer) {
        console.log("This is a buffer:", Buffer.isBuffer(buffer));
        console.log("Bandera");
        const mailOptions = {
          from: "pauldelpezo@gmail.com",
          to: "paul@invrtir.com",
          subject: "Prueba",
          text: "Prueba",
          attachments: [
            {
              // eslint-disable-next-line new-cap
              content: Buffer.from(buffer),
              contentType: "application/pdf",
            },
          ]
          ,
        };
        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error("there was an error: ", err);
            res.status(401).json(err);
          } else {
            // console.log('here is the res: ', response);
            res.status(200).json("recovery email sent");
          }
        });
      });
      /*
      try {
        fs.rm("/workspace/reports/report.pdf", ()=>{
          // eslint-disable-next-line max-len
          pdf.create(result, options).toFile("/workspace/reports/report.pdf", function(err, data) {
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
        });
      } catch (e) {
        // eslint-disable-next-line max-len, max-len, max-len
        pdf.create(result, options).toFile("/workspace/reports/report.pdf", function(err, data) {
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
        return "Archivo Enviado";
      }
      */
    }
  });
});

module.exports = app;
