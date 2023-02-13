const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();
app.use(cors({origin: true}));
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
  console.log(req.query);
  const idAffiliate = req.query.id;
  const dateSale = new Date(req.query.date);
  const salesRef = admin.firestore().collection("affiliates")
      .doc(idAffiliate).collection("sales");
  const startOfWeek = getStartOfWeek(dateSale);
  // const endOfWeek = getEndOfWeek(dateSale);
  const salesByDayOfWeek = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(currentDay.getDate() + i);
    console.log(currentDay);
    const salesByDate = await salesRef
        .where("date", ">=", currentDay)
        // eslint-disable-next-line max-len
        .where("date", "<", new Date(currentDay.getTime() + 24 * 60 * 60 * 1000))
        .get()
        .then((snapshot) => {
          let total = 0;
          snapshot.forEach((sale) => {
            console.log(sale.id);
            total += sale.data().amount;
          });
          // eslint-disable-next-line max-len
          return {dayOfWeek: currentDay.toLocaleDateString("es-Es", {weekday: "long"}), total};
        });
    salesByDayOfWeek.push(salesByDate);
  }
  // eslint-disable-next-line max-len
  const labels = salesByDayOfWeek.map((day) => day.dayOfWeek);
  const values = salesByDayOfWeek.map((day) => day.total);
  return res.render("chartWeekSales", {
    labels: labels,
    values: values,
  });
});
/**
 * Funcion para retorna la fecha de inicio de semana según una fecha dada.
 * @param {Date} date fecha para encontrar cuando inicia la semana
 * @return {Date} Fecha del inicio de semana
 */
function getStartOfWeek(date) {
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  // eslint-disable-next-line max-len
  startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return startOfWeek;
}

module.exports = app;
