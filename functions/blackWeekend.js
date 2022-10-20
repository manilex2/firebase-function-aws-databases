require("dotenv").config();
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
router.get("/", function(req, res, next) {
  let inicio= false;
  let dictBasic = {};
  let dictPro = {};
  let dictCrypto = {};
  let dictCryptoPro = {};
  let dictForexPremium = {};
  let dictForexAlertas = {};
  let dictForexEnvivo = {};
  let hora="";
  let linkImagenDescuento="";
  let descuento;
  const fechaInicio = new Date("November 25, 00:00");
  const fecha= new Date();

  // eslint-disable-next-line max-len
  if (fechaInicio.getMonth === fecha.getMonth && fecha.getDate() === fechaInicio.getDate() && fecha.getHours() >= fechaInicio.getHours()) {
    inicio = true;
  }
  const horaActual = fecha.getHours();
  console.log(fecha.getDate());
  console.log(fecha.getMonth());
  if (fecha.getDate() === 25 && fecha.getMonth()+1 === 11) {
    console.log(horaActual);
    if (horaActual>= 0 && horaActual <= 11) {
      descuento = 0.7;
      hora="2022-11-25 11:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-70%25.png";
    } else if (horaActual>= 12 && horaActual <=23) {
      console.log("Entré");
      descuento = 0.6;
      hora="2022-11-25 23:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-60%25.png";
    }
  } else if (fecha.getDate() === 26 && fecha.getMonth()+1 === 11) {
    if (horaActual>= 0 && horaActual <= 11) {
      descuento = 0.5;
      hora="2022-11-26 11:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-50%25.png";
    } else if (horaActual>= 12 && horaActual <=23) {
      descuento = 0.4;
      hora="2022-11-26 23:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-40%25.png";
    }
  } else if (fecha.getDate() === 27 && fecha.getMonth()+1 === 11) {
    if (horaActual>= 0 && horaActual <= 11) {
      descuento = 0.3;
      hora="2022-11-27 11:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-30%25.png";
    } else if (horaActual>= 12 && horaActual <=23) {
      descuento = 0.2;
      hora="2022-11-27 23:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-20%25.png";
    }
  }
  dictBasic = {
    "anual": {
      "precio_actual": (Math.round(49.99*descuento)).toString(),
      "precio_antes": (49.99).toString(),
      "ahorro": (49.99-Math.round(49.99*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=4199967",
    },
    "lifetime": {
      "precio_actual": (Math.round(79.99*descuento)).toString(),
      "precio_antes": (79.99).toString(),
      "ahorro": (79.99-Math.round(79.99*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=4201764",
    },
  };
  dictPro = {
    "anual": {
      "precio_actual": (Math.round(199.99*descuento)).toString(),
      "precio_antes": (199.99).toString(),
      "ahorro": (199.99-Math.round(199.99*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=3514543",
    },
    "lifetime": {
      "precio_actual": (Math.round(249.99*descuento)).toString(),
      "precio_antes": (249.99).toString(),
      "ahorro": (249.99-Math.round(249.99*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=3395487",
    },
  };
  dictCrypto = {
    "anual": {
      "precio_actual": (Math.round(399.99*descuento)).toString(),
      "precio_antes": (399.99).toString(),
      "ahorro": (399.99-Math.round(399.99*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=3395437",
    },
    "lifetime": {
      "precio_actual": (Math.round(500*descuento)).toString(),
      "precio_antes": (500).toString(),
      "ahorro": (500-Math.round(500*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=3514489",
    },
  };
  dictCryptoPro = {
    "anual": {
      "precio_actual": (Math.round(499.99*descuento)).toString(),
      "precio_antes": (499.99).toString(),
      "ahorro": (499.99-Math.round(499.99*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=3395477",
    },
    "lifetime": {
      "precio_actual": (Math.round(650*descuento)).toString(),
      "precio_antes": (650).toString(),
      "ahorro": (650-Math.round(650*descuento)).toFixed(2),
      "link": "https://invrtir.com/purchase?product_id=3541528",
    },
  };
  dictForexPremium = {
    "anual": {
      "precio_actual": (Math.round(1500*descuento)).toString(),
      "precio_antes": (1500).toString(),
      "ahorro": (1500-Math.round(1500*descuento)).toFixed(2),
      "link": "https://buy.stripe.com/8wMbLteVWbSJ3GEaEU",
    },
  };
  dictForexAlertas = {
    "anual": {
      "precio_actual": (Math.round(1000*descuento)).toString(),
      "precio_antes": (1000).toString(),
      "ahorro": (1000-Math.round(1000*descuento)).toFixed(2),
      "link": "https://buy.stripe.com/6oE5n59BCbSJb96cN0",
    },
  };
  dictForexEnvivo = {
    "anual": {
      "precio_actual": (Math.round(1250*descuento)).toString(),
      "precio_antes": (1250).toString(),
      "ahorro": (1250-Math.round(1250*descuento)).toFixed(2),
      "link": "https://buy.stripe.com/14k02L4hicWN5OM28C",
    },
  };
  // eslint-disable-next-line max-len
  res.render("blackWeekend", {title: "Black Weekend", inicio: inicio, hora: hora, linkImagenDescuento: linkImagenDescuento, dictBasic: dictBasic, dictCrypto: dictCrypto, dictPro: dictPro, dictCryptoPro: dictCryptoPro, dictForexPremium: dictForexPremium, dictForexEnvivo: dictForexEnvivo, dictForexAlertas: dictForexAlertas});
});

module.exports = router;
