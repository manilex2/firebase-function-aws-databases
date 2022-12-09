require("dotenv").config();
// eslint-disable-next-line max-len
// const formatter = new Intl.DateTimeFormat("en-US", {timeZone: "America/Guayaquil"});
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
  let codPromo = "";
  let hora="";
  let linkImagenDescuento="";
  let descuento;
  const fechaInicio = new Date("November 25, 00:00");
  const fecha= new Date();
  const ecDate = fecha.toLocaleString("en-US", {timeZone: "America/Guayaquil"});
  const arrayecDate = ecDate.split(",");
  const arrayFecha = arrayecDate[0].split("/");
  const arrayHora = arrayecDate[1].split(" ");
  let horaActual = 0;
  if (arrayHora[2]=="PM") {
    horaActual= parseInt(arrayHora[1].split(":")[0])+12;
  } else {
    horaActual= parseInt(arrayHora[1].split(":")[0]);
  }
  /*
  console.log(fechaInicio);
  console.log(fechaInicio.getMonth());
  console.log(parseInt(arrayFecha[0]));
  console.log(fechaInicio.getMonth === parseInt(arrayFecha[0]));
  console.log(parseInt(arrayFecha[1]) >= fechaInicio.getDate());
  console.log(horaActual >= fechaInicio.getHours());
  */
  // eslint-disable-next-line max-len
  if (fechaInicio.getMonth()+1 === parseInt(arrayFecha[0]) && parseInt(arrayFecha[1]) >= fechaInicio.getDate() && horaActual >= fechaInicio.getHours()) {
    inicio = true;
  }
  if (parseInt(arrayFecha[1]) === 25 && parseInt(arrayFecha[0]) === 11) {
    if (horaActual>= 0 && horaActual <= 11) {
      descuento = 0.7;
      hora="2022-11-25 11:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-70%25.png";
      codPromo = "BLACK70";
    } else if (horaActual>= 12 && horaActual <=23) {
      descuento = 0.6;
      hora="2022-11-25 23:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-60%25.png";
      codPromo = "BLACK60";
    }
  } else if (parseInt(arrayFecha[1]) === 26 && parseInt(arrayFecha[0]) === 11) {
    if (horaActual>= 0 && horaActual <= 11) {
      descuento = 0.5;
      hora="2022-11-26 11:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-50%25.png";
      codPromo = "BLACK50";
    } else if (horaActual>= 12 && horaActual <=23) {
      descuento = 0.4;
      hora="2022-11-26 23:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-40%25.png";
      codPromo = "BLACK40";
    }
  } else if (parseInt(arrayFecha[1]) === 27 && parseInt(arrayFecha[0]) === 11) {
    if (horaActual>= 0 && horaActual <= 11) {
      descuento = 0.3;
      hora="2022-11-27 11:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-30%25.png";
      codPromo = "BLACK30";
    } else if (horaActual>= 12 && horaActual <=23) {
      descuento = 0.2;
      hora="2022-11-27 23:59";
      linkImagenDescuento="https://d8ff17fs33kjt.cloudfront.net/Contenido+WebPage/BlackWeekend2022/Invrtir-descuento-20%25.png";
      codPromo = "BLACK20";
    }
  }
  dictBasic = {
    "anual": {
      "precio_actual": (49.99-Math.round(49.99*descuento)).toFixed(2),
      "precio_antes": (49.99).toString(),
      "ahorro": (Math.round(49.99*descuento)).toString(),
      "link": `https://invrtir.com/purchase?product_id=4199967&coupon_code=${codPromo}`,
    },
    "lifetime": {
      "precio_actual": (Math.round(79.99*descuento)).toString(),
      "precio_antes": (79.99).toString(),
      "ahorro": (79.99-Math.round(79.99*descuento)).toFixed(2),
      "link": `https://invrtir.com/purchase?product_id=4201764&coupon_code=${codPromo}`,
    },
  };
  dictPro = {
    "anual": {
      "precio_actual": (199.99-Math.round(199.99*descuento)).toFixed(2),
      "precio_antes": (199.99).toString(),
      "ahorro": (Math.round(199.99*descuento)).toString(),
      "link": `https://invrtir.com/purchase?product_id=4199986&coupon_code=${codPromo}`,
    },
    "lifetime": {
      "precio_actual": (249.99-Math.round(249.99*descuento)).toFixed(2),
      "precio_antes": (249.99).toString(),
      "ahorro": (Math.round(249.99*descuento)).toString(),
      "link": `https://invrtir.com/purchase?product_id=3395487&coupon_code=${codPromo}`,
    },
  };
  dictCrypto = {
    "anual": {
      "precio_actual": (399.99-Math.round(399.99*descuento)).toFixed(2),
      "precio_antes": (399.99).toString(),
      "ahorro": (Math.round(399.99*descuento)).toString(),
      "link": `https://invrtir.com/purchase?product_id=4202202&coupon_code=${codPromo}`,
    },
    "lifetime": {
      "precio_actual": (500-Math.round(500*descuento)).toFixed(2),
      "precio_antes": (500).toString(),
      "ahorro": (Math.round(500*descuento)).toString(),
      "link": `https://invrtir.com/purchase?product_id=3514489&coupon_code=${codPromo}`,
    },
  };
  dictCryptoPro = {
    "anual": {
      "precio_actual": (499.99-Math.round(499.99*descuento)).toFixed(2),
      "precio_antes": (499.99).toString(),
      "ahorro": (Math.round(499.99*descuento)).toString(),
      "link": `https://invrtir.com/purchase?product_id=4202206&coupon_code=${codPromo}`,
    },
    "lifetime": {
      "precio_actual": (Math.round(650*descuento)).toString(),
      "precio_antes": (650).toString(),
      "ahorro": (650-Math.round(650*descuento)).toFixed(2),
      "link": `https://invrtir.com/purchase?product_id=4202206&coupon_code=${codPromo}`,
    },
  };
  dictForexPremium = {
    "anual": {
      "precio_actual": (Math.round(1500*descuento)).toString(),
      "precio_antes": (1500).toString(),
      "ahorro": (1500-Math.round(1500*descuento)).toFixed(2),
      "link": `https://buy.stripe.com/8wMbLteVWbSJ3GEaEU?prefilled_promo_code=${codPromo}`,
    },
  };
  dictForexAlertas = {
    "anual": {
      "precio_actual": (Math.round(1000*descuento)).toString(),
      "precio_antes": (1000).toString(),
      "ahorro": (1000-Math.round(1000*descuento)).toFixed(2),
      "link": `https://buy.stripe.com/6oE5n59BCbSJb96cN0?prefilled_promo_code=${codPromo}`,
    },
  };
  dictForexEnvivo = {
    "anual": {
      "precio_actual": (Math.round(1250*descuento)).toString(),
      "precio_antes": (1250).toString(),
      "ahorro": (1250-Math.round(1250*descuento)).toFixed(2),
      "link": `https://buy.stripe.com/14k02L4hicWN5OM28C?prefilled_promo_code=${codPromo}`,
    },
  };
  // eslint-disable-next-line max-len
  res.render("blackWeekend", {title: "Black Weekend", inicio: inicio, hora: hora, linkImagenDescuento: linkImagenDescuento, dictBasic: dictBasic, dictCrypto: dictCrypto, dictPro: dictPro, dictCryptoPro: dictCryptoPro, dictForexPremium: dictForexPremium, dictForexEnvivo: dictForexEnvivo, dictForexAlertas: dictForexAlertas});
});

module.exports = router;
