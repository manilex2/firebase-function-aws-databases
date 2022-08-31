/* eslint-disable require-jsdoc */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
// const fetch = require("node-fetch");
// const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./mysql-crypto");
const admin = require("firebase-admin");

app.use(cors({ origin: true }));
app.get(`/${process.env.API_KEY}`, async (req, res) => {
  async function delay(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }
  const sqlStr = `SELECT * FROM ${process.env.LIST_CRYPTO_TABLE};`;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(sqlStr, async (err, result, fields) => {
      if (result) {
        if (err) throw err;
        const grupo = Math.floor(result.length / 8);
        let contador = grupo;
        const cantGrupos = [contador];
        while (contador < result.length) {
          contador = contador + grupo;
          cantGrupos.push(contador);
        }
        if (contador > result.length) {
          cantGrupos.pop();
          cantGrupos.push(result.length);
        }
        let inicio = 0;
        console.log(cantGrupos);
        for (let i = 0; i < cantGrupos.length; i++) {
          const fin = cantGrupos[i];
          console.log(`Entre ${i + 1} veces`);
          await guardarDatosFirebase(result, inicio, fin);
          await delay(process.env.DELAY);
          inicio = fin;
        }
        if (inicio == result.length) {
          await delay(30000);
          await finalizarEjecucion();
        }
      }
    });
    async function guardarDatosFirebase(resultado, inicio, fin) {
      for (let i = inicio; i < fin; i++) {
        const crypto = resultado[i].name;
        const sqlStr2 = `
          SELECT
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
          FROM ${process.env.MARKET_DATA_TABLE} WHERE coin_id = "${crypto}" LIMIT 1;
        `;
        connection.query(sqlStr2, async (err, result, fields) => {
          console.log(result[0]["coin_id"]);
          if (result) {
            if (err) throw err;
            const query = admin
              .firestore()
              .collection("cryptos_info")
              .doc(crypto);
            if (!(await query.get()).exists) {
              query.create({
                coin_id: result[0]["coin_id"],
                symbol: result[0]["symbol"],
                name: result[0]["name"],
                description: "",
                homepage: result[0]["homepage"],
                blockchain_site: result[0]["blockchain_site"],
                twitter_screenname: result[0]["twitter_screenname"],
                image_thumb: result[0]["image_thumb"],
                image_small: result[0]["image_small"],
                image_large: result[0]["image_large"],
                sentiment_votes_up_percentage: Number(
                  result[0]["sentiment_votes_up_percentage"]
                ),
                sentiment_votes_down_percentage: Number(
                  result[0]["sentiment_votes_down_percentage"]
                ),
                coingecko_rank: result[0]["coingecko_rank"],
                coingecko_score: Number(result[0]["coingecko_score"]),
                developer_score: Number(result[0]["developer_score"]),
                community_score: Number(result[0]["community_score"]),
                liquidity_score: Number(result[0]["liquidity_score"]),
                public_interest_score: Number(
                  result[0]["public_interest_score"]
                ),
                ath_change_percentage: Number(
                  result[0]["ath_change_percentage"]
                ),
                market_cap: result[0]["market_cap"],
                market_cap_rank: Number(result[0]["market_cap_rank"]),
                total_volume: result[0]["total_volume"],
                price_change_percentage_24h: Number(
                  result[0]["price_change_percentage_24h"]
                ),
                price_change_percentage_7d: Number(
                  result[0]["price_change_percentage_7d"]
                ),
                price_change_percentage_30d: Number(
                  result[0]["price_change_percentage_7d"]
                ),
                price_change_percentage_200d: Number(
                  result[0]["price_change_percentage_200d"]
                ),
                price_change_percentage_1y: Number(
                  result[0]["price_change_percentage_1y"]
                ),
                total_supply: result[0]["total_supply"],
                max_supply: result[0]["max_supply"],
                circulating_supply: result[0]["circulating_supply"],
                last_updated: Date(result[0]["last_updated"]),
              });
            } else {
              query.update({
                coin_id: result[0]["coin_id"],
                symbol: result[0]["symbol"],
                name: result[0]["name"],
                description: "",
                homepage: result[0]["homepage"],
                blockchain_site: result[0]["blockchain_site"],
                twitter_screenname: result[0]["twitter_screenname"],
                image_thumb: result[0]["image_thumb"],
                image_small: result[0]["image_small"],
                image_large: result[0]["image_large"],
                sentiment_votes_up_percentage: Number(
                  result[0]["sentiment_votes_up_percentage"]
                ),
                sentiment_votes_down_percentage: Number(
                  result[0]["sentiment_votes_down_percentage"]
                ),
                coingecko_rank: result[0]["coingecko_rank"],
                coingecko_score: Number(result[0]["coingecko_score"]),
                developer_score: Number(result[0]["developer_score"]),
                community_score: Number(result[0]["community_score"]),
                liquidity_score: Number(result[0]["liquidity_score"]),
                public_interest_score: Number(
                  result[0]["public_interest_score"]
                ),
                ath_change_percentage: Number(
                  result[0]["ath_change_percentage"]
                ),
                market_cap: result[0]["market_cap"],
                market_cap_rank: Number(result[0]["market_cap_rank"]),
                total_volume: result[0]["total_volume"],
                price_change_percentage_24h: Number(
                  result[0]["price_change_percentage_24h"]
                ),
                price_change_percentage_7d: Number(
                  result[0]["price_change_percentage_7d"]
                ),
                price_change_percentage_30d: Number(
                  result[0]["price_change_percentage_7d"]
                ),
                price_change_percentage_200d: Number(
                  result[0]["price_change_percentage_200d"]
                ),
                price_change_percentage_1y: Number(
                  result[0]["price_change_percentage_1y"]
                ),
                total_supply: result[0]["total_supply"],
                max_supply: result[0]["max_supply"],
                circulating_supply: result[0]["circulating_supply"],
                last_updated: Date(result[0]["last_updated"]),
              });
            }
          }
        });
      }
    }
  });
  async function finalizarEjecucion() {
    res.status(200).send({
      status: 200,
      message: "All OK",
    });
  }
});

module.exports = app;
