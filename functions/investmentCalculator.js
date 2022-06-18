const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({origin: true}));
app.set("view engine", "ejs");


app.get(`/${process.env.API_KEY}`, (req, res) => {
  const errors = {};
  let initialDeposit = req.query.initialDeposit;
  let contribution = req.query.contribution;
  let contributionFrequency = req.query.contributionFrequency;
  let yearsGrow = req.query.yearsGrow;
  let average = req.query.average;

  if (!initialDeposit || !initialDeposit.match(/^[0-9]+(\.[0-9]{1,2})?$/)) {
    errors["initialDeposit"] =
        "Not provided or incorrect format, use this format : '00.00' .";
  }

  if (
    !contribution ||
      !contribution.match(/^[0-9]+(\.[0-9]{1,2})?$/) ||
      Number(contribution) <= 0
  ) {
    errors["contribution"] =
        "Not provided or incorrect format, use this format : '00.00' .";
  }

  if (
    !contributionFrequency ||
      !(
        contributionFrequency.toUpperCase() == "ANUAL" ||
        contributionFrequency.toUpperCase() == "MENSUAL"
      )
  ) {
    errors["contributionFrequency"] =
        "Not provided or incorrect options, use 'anual' or 'mensual' .";
  }

  if (!yearsGrow || !yearsGrow.match(/^[0-9]+$/) || Number(yearsGrow) <=0) {
    errors["yearsGrow"] = "Not provided or incorrect format, use integers.";
  }

  if (
    !average ||
      !average.match(/^[0-9]+(\.[0-9]{1,2})?$/) ||
      Number(average) <= 0
  ) {
    errors["average"] =
        "Not provided or incorrect format, use this format : '00,00' .";
  }

  if (Object.keys(errors).length == 0) {
    initialDeposit = Number(req.query.initialDeposit);
    contribution = Number(req.query.contribution);
    contributionFrequency = req.query.contributionFrequency.toUpperCase();
    yearsGrow = Number(req.query.yearsGrow);
    average = Number(req.query.average) / 100;

    const contributionList = [initialDeposit];
    const returnList = [0];
    const totalBalanceList = [initialDeposit];
    const labels = [new Date().getUTCFullYear()];
    let multiplier = 1;

    if (contributionFrequency == "MENSUAL") {
      multiplier = 12;
    }

    average = average / multiplier;

    for (let i = 1; i <= yearsGrow; i++) {
      const base = 1 + average;

      const compundInterest =
          (contribution + initialDeposit) *
          (Math.pow(base, i * multiplier) - 1);

      const newContribution =
          (contribution * (Math.pow(base, i * multiplier) - 1)) / average;

      const parcialBalance =
          compundInterest + newContribution + initialDeposit;

      const parcialContribution =
          contribution * i * multiplier + initialDeposit;

      const parcialReturn = parcialBalance - parcialContribution;

      contributionList.push(parcialContribution.toFixed(2));
      returnList.push(parcialReturn.toFixed(2));
      totalBalanceList.push(parcialBalance.toFixed(2));

      labels.push(labels[0] + i);
    }

    let finalContri = Number(contributionList[contributionList.length -1]);
    let finalReturn = Number(returnList[returnList.length -1]);
    let totalBalance = (finalContri + finalReturn).toFixed(2);

    finalContri = new Intl.NumberFormat("en-US").format(finalContri);
    finalReturn = new Intl.NumberFormat("en-US").format(finalReturn);
    totalBalance = new Intl.NumberFormat("en-US").format(totalBalance);

    return res.render("chartInvestmentCalculator", {
      labels: labels,
      contributionList: contributionList,
      returnList: returnList,
      totalValue: totalBalance,
      contributionValue: finalContri,
      returnValue: finalReturn,
    });
  }
  return res.status(400).send(errors);
});

module.exports = app;
