/* eslint-disable no-redeclare */
/* eslint-disable no-var */
/* eslint-disable max-len */
const express = require("express");
const cors = require("cors");
const pool = require("./mysql");
const ranking = express();
// Automatically allow cross-origin requests
ranking.use(cors({origin: true}));

ranking.get(`/${process.env.API_KEY}`, (req, res) => {
  const sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE};`;

  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(sqlStr, (err, result, fields) => {
      if (result) {
        connection.release();
        if (err) throw err;
        res.status(200).json({
          status: 200,
          title: "Lista de Criptos con su ranking",
          data: result,
        });
      } else {
        connection.release();
        if (err) throw err;
        res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "No se pudo obtener los rankings",
        });
      }
    });
  });
});

ranking.get(`/${process.env.API_KEY}/calificacion/:tipoCalificacion`, (req, res) => {
  const calificacion = req.params["tipoCalificacion"];
  switch (calificacion) {
    case "calificacionTendenciaLP":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_tendencia_lp DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion de Tendencia a Largo Plazo",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionIndicadoresTecnicosLP":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_indicadores_tecnicos_lp DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion de Indicadores Tecnicos a Largo Plazo",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionTotalLP":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_total_lp DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion Total a Largo Plazo",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionTendenciaMP":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_tendencia_mp DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion de Tendencia a Mediano Plazo",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionIndicadoresTecnicosMP":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_indicadores_tecnicos_mp DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion de Indicadores Tecnicos a Mediano Plazo",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionTotalMP":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_total_mp DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion Total a Mediano Plazo",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionGlobalTendencia":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_global_tendencia DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion Global de Tendencia",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionIndicadoresTecnicos":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} ORDER BY calificacion_global_indicadores_tecnicos DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion Global de Indicadores Tecnicos",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    case "calificacionGlobalGeneral":
      var sqlStr = `SELECT * FROM ${process.env.RANKING_TABLE} WHERE calificacion_global_general > 0 AND calificacion_global_general IS NOT NULL ORDER BY calificacion_global_general DESC;`;
      pool.getConnection(function(error, connection) {
        if (error) throw error;
        connection.query(sqlStr, (err, result, fields) => {
          if (result) {
            connection.release();
            if (err) throw err;
            res.status(200).json({
              status: 200,
              title: "Lista de Criptos con su ranking ordenado por Calificacion Global General",
              data: result,
            });
          } else {
            connection.release();
            if (err) throw err;
            res.status(400).json({
              status: 400,
              error: "Bad Request",
              message: "No se pudo obtener los rankings",
            });
          }
        });
      });
      break;
    default:
      break;
  }
});

ranking.get("/", (req, res) => {
  res.json({
    status: "API KEY ERROR",
    message: "Debe proporcionar la API-KEY para conectarse",
  });
});

ranking.get("*", (req, res) => {
  res.json({
    status: "API ERROR",
    message: "Hay un error en la ruta, revise API-KEY y/o los parámetros",
  });
});

module.exports = ranking;
