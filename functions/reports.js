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
  const nombre = req.body.nombre;
  const cedula = req.body.cedula;
  const nombreEmitente = req.body.Nombre_Emitente;
  const cargoEmitente = req.body.Cargo_Emitente;
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
  const totalHorasExtras = req.body.totalHorasExtras;
  const totalHorasFaltantes = req.body.totalHorasFaltantes;
  const validacionTotalHoras = totalHorasExtras + totalHorasFaltantes;
  const textTotHorasExtras = decimalAHora(totalHorasExtras);
  const textTotHorasFaltantes = decimalAHora(totalHorasFaltantes);
  const totalHoraReporte = decimalAHora(totalHorasExtras + totalHorasFaltantes);
  const person = {nombre: nombre, cedula: cedula, cargo: cargo, unidad: unidad, mes: mes, totalHoras: totalHoras, fechas: fechas, horasEntrada: horasEntrada, horasSalida: horasSalida, totalHorasTrabajadas: totalHorasTrabajadas, horasExtras: horasExtras, horasFaltantes: horasFaltantes, textTotHorasExtras: textTotHorasExtras, textTotHorasFaltantes: textTotHorasFaltantes, validacionTotalHoras: validacionTotalHoras, totalHoraReporte: totalHoraReporte};
  console.log(person);
  const transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for other ports
    auth: {
      user: `${process.env.EMAIL_GMAIL}`, // generated ethereal user
      pass: `${process.env.PASSWORD_GMAIL}`, // generated ethereal password
    },
  });
  // eslint-disable-next-line max-len
  ejs.renderFile(path.join(__dirname, "./views/", "reporte.ejs"), person, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const options = {
        format: "A4",
        preferCSSPageSize: true,
        margin: {top: "30px", bottom: "30px"},
      };
      const file = {
        content: result,
      };
      pdf.generatePdf(file, options).then((pdfBuffer) => {
        const mailOptions = {
          from: `${process.env.EMAIL_GMAIL}`,
          to: `${process.env.EMAIL_DESTINY_GMAIL}`,
          cc: `${process.env.EMAIL_DESTINY_EMAIL_CC}`,
          subject: `Reporte de horas trabajada de: ${nombre} | ${mes}`,
          text: `Nombre : ${nombreEmitente}
                 Cargo: ${cargoEmitente}
                 Ha emitido el siguiente reporte de marcaciones.`,
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
});
// eslint-disable-next-line require-jsdoc
function decimalAHora(decimal) {
  const horas = Math.trunc(decimal);// Obtenemos la parte entera

  const restoHoras = Math.trunc(decimal % 1 * 100); // Obtenemos la parde decimal

  const decimalMinutos = restoHoras * 60 / 100; // Obtenemos los minutos expresado en decimal

  const minutos = Math.trunc(decimalMinutos); // Obtenemos la parte entera
  return `${("00"+horas).slice(-2)}:${("00"+minutos).slice(-2)}`;
}
module.exports = app;
