/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const fs = require("fs");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf-node");
const path = require("path");
const app = express();
const jsreport = require("jsreport-core")();
app.use(cors({origin: true}));
app.set("view engine", "ejs");
app.get(`/${process.env.API_KEY}`, (req, res) => {
  const nombre = "Paul Navarrete";
  const fecha = "14-02-2022";
  const cargo = "Cargo";
  const unidad = "Unidad";
  const mes = "Mes";
  const totalHoras = "TotalHoras";
  const fechas = ["14-07-2022", "14-08-2022", "14-09-2022"];
  const horasEntrada = ["18:20", "18:30", "18:40"];
  const horasSalida = ["20:20", "20:30", "21:20"];
  const totalHorasTrabajadas = ["18:20", "20:20", "21:20"];
  const horasExtras = ["18:20", "20:20", "21:20"];
  const horasFaltantes = ["18:20", "20:20", "21:20"];
  const data = {nombre: nombre, cedula: fecha, cargo: cargo, unidad: unidad, mes: mes, totalHoras: totalHoras, fechas: fechas, horasEntrada: horasEntrada, horasSalida: horasSalida, totalHorasTrabajadas: totalHorasTrabajadas, horasExtras: horasExtras, horasFaltantes: horasFaltantes};
  res.render("reporte", data);
});
app.post(`/${process.env.API_KEY}`, (req, res) => {
  res.set("Content-Type", "application/json");
  console.log("Bandera");
  console.log(req.body);
  const nombre = req.body.nombre;
  const cedula = req.body.cedula;
  const cargo = req.body.cargo;
  const unidad = req.body.unidad;
  const mes = req.body.mesreporte;
  const totalHoras = req.body.tiempototal;
  const fechas = req.body.fecha;
  const horasEntrada = req.body.entradas;
  const horasSalida = req.body.salidas;
  const totalHorasTrabajadas = req.body.horastrabajadas;
  const horasExtras = req.body.horasextras;
  const horasFaltantes = req.body.horasfaltantes;
  const person = {nombre: nombre, cedula: cedula, cargo: cargo, unidad: unidad, mes: mes, totalHoras: totalHoras, fechas: fechas, horasEntrada: horasEntrada, horasSalida: horasSalida, totalHorasTrabajadas: totalHorasTrabajadas, horasExtras: horasExtras, horasFaltantes: horasFaltantes};
  console.log(person);

  const transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for other ports
    auth: {
      user: `${process.env.EMAIL_GMAIL}`, // generated ethereal user
      pass: `${process.env.PASSWORD_GMAIL}`, // generated ethereal password
    },
  });
  const template = fs.readFileSync(path.join(__dirname, "./views/", "reporte.ejs"), "utf8");
  const content = ejs.render(template, person);
  jsreport.init().then(() => {
    return jsreport.render({
      template: {
        content: content,
        engine: "handlebars",
        recipe: "chrome-pdf",
      },
    }).then((resp) => {
      // prints pdf with headline Hello world
      console.log(resp);
    });
  }).catch((e) => {
    console.error(e);
  });
  /*
  const options = {
    format: "A4",
    preferCSSPageSize: true,
  };
  const file = {
    content: content,
  };
  pdf.generatePdf(file, options).then((pdfBuffer) => {
    const mailOptions = {
      from: `${process.env.EMAIL_GMAIL}`,
      to: `${process.env.EMAIL_DESTINY_TEST_EMAIL}`,
      subject: `Reporte de horas trabajada de: ${nombre} | ${mes}`,
      text: "Reporte Generado desde la aplicación de Nailbox",
      attachments: [
        {
          // eslint-disable-next-line new-cap
          filename: `reporte_${nombre}_${mes}`,
          content: Buffer.from(pdfBuffer),
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
  // eslint-disable-next-line max-len
  ejs.renderFile(path.join(__dirname, "./views/", "reporte.ejs"), person, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const options = {
        format: "A4",
        preferCSSPageSize: true,
      };
      const file = {
        content: result,
      };
      pdf.generatePdf(file, options).then((pdfBuffer) => {
        const mailOptions = {
          from: `${process.env.EMAIL_GMAIL}`,
          to: `${process.env.EMAIL_DESTINY_TEST_EMAIL}`,
          subject: `Reporte de horas trabajada de: ${nombre} | ${mes}`,
          text: "Reporte Generado desde la aplicación de Nailbox",
          attachments: [
            {
              // eslint-disable-next-line new-cap
              filename: `reporte_${nombre}_${mes}`,
              content: Buffer.from(pdfBuffer),
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
    }
  });
  */
});

module.exports = app;
