const express = require("express");
const cors = require("cors");
const pool = require("./mysql-crypto");
const marketData = express();
// Automatically allow cross-origin requests
marketData.use(cors({origin: true}));

marketData.get(`/${process.env.API_KEY}/:cripto/list`, (req, res) => {
  res.json({
    status: "API ERROR",
    // eslint-disable-next-line max-len
    message: "Hay un error en la ruta, debe colocar el parametro que desea consultar despues de list",
  });
});

marketData.get(`/${process.env.API_KEY}/:cripto/:marketName`, (req, res) => {
  const cripto = req.params["cripto"];
  const marketName = req.params["marketName"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT * FROM ${process.env.MARKET_DATA_TABLE} WHERE coin_id = "${cripto}" AND market_name="${marketName}";`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.destroy();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: `Market Data de ${cripto} para ${marketName}`,
          data: result,
        });
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          // eslint-disable-next-line max-len
          message: `No se encontro Market Data para ${cripto} con ${marketName}`,
        });
      }
    });
  });
});

marketData.get(`/${process.env.API_KEY}/:cripto`, (req, res) => {
  const cripto = req.params["cripto"];
  const sqlStr = `SELECT 
                        id,
                        coin_id,
                        symbol,
                        name,
                        description_en,
                        description_es,
                        homepage,
                        blockchain_site,
                        twitter_screenname,
                        image_thumb,
                        image_small,
                        image_large,
                        sentiment_votes_up_percentage,
                        sentiment_votes_down_percentage,
                        coingecko_rank,
                        coingecko_score,
                        developer_score,
                        community_score,
                        liquidity_score,
                        public_interest_score,
                        ath_change_percentage,
                        ath_date,
                        market_cap,
                        market_cap_rank,
                        total_volume,
                        price_change_percentage_24h,
                        price_change_percentage_7d,
                        price_change_percentage_30d,
                        price_change_percentage_200d,
                        price_change_percentage_1y,
                        total_supply,
                        max_supply,
                        circulating_supply,
                        last_updated,
                        twitter_followers,
                        error
    FROM ${process.env.MARKET_DATA_TABLE} WHERE coin_id = "${cripto}" LIMIT 1;`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        if (result[0].error === null) {
          connection.destroy();
          if (err) throw err;
          res.status(200).json({
            status: 200,
            title: `Market data de ${cripto}`,
            error: null,
            data: result,
          });
        } else {
          connection.destroy();
          if (err) throw err;
          res.status(200).json({
            status: 200,
            error: result[0].error,
            message: `No se encontro Market Data para ${cripto}`,
          });
        }
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: result[0].error,
          message: `No se encontro Market Data para ${cripto}`,
        });
      }
    });
  });
});

marketData.get(`/${process.env.API_KEY}/:cripto/list/exchanges`, (req, res) => {
  const cripto = req.params["cripto"];
  // eslint-disable-next-line max-len
  const sqlStr = `SELECT  market_name FROM ${process.env.MARKET_DATA_TABLE} WHERE coin_id = "${cripto}";`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.destroy();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: `Lista de Exchanges de ${cripto}`,
          data: result,
        });
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Request Error",
          message: `No se encontro Lista de Exchanges para ${cripto}`,
        });
      }
    });
  });
});

marketData.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.MARKET_DATA_TABLE};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.destroy();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Market Data de todas las criptos",
          data: result,
        });
      } else {
        connection.destroy();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se encontraron datos",
        });
      }
    });
  });
});

marketData.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

marketData.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = marketData;
