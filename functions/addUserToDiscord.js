const fetch = require("node-fetch");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const admin = require("firebase-admin");
const UrlApi = "https://discord.com/api/v9";
// const discord = require("discord.js");


// admin.initializeApp();
// Automatically allow cross-origin requests
app.use(cors({origin: true}));

app.get("/", async (req, res) => {
  const userToken = await getUserToken(req.query.code);

  if (userToken != null) {
    const userInfo = await getUserInfo(userToken);

    if (userInfo != null) {
      console.log(userToken);
      console.log(userInfo);

      const userRef = await getUserReference(userInfo.email);

      if (userRef != null) {
        const savedUserToken =
        await setUserDiscordRefreshToken(userRef, userToken.refresh_token);

        if (savedUserToken) {
          await addUserOrModify(
              ["1006247087459008653"], userToken.access_token, userInfo.id);
        }
      } else {
        functions.logger.log(
            "User with email: ", userInfo.email, " no exists in database");
        // Mandar al usuario algun mensaje
      }
    } else {
      functions.logger.log("error", userInfo);
      // Usar otro token
    }
  } else {
    functions.logger.log(userToken);
  }
  res.send("OK");
});

/**
 * Obtiene el token del usuario autorizado.
 * @param {string} code - Código de autorización del usuario.
 * @return {Json} Json que contiene el token.
 */
async function getUserToken(code) {
  const body = new URLSearchParams();
  const headers = {"Content-Type": "application/x-www-form-urlencoded;"};

  body.append("client_id", process.env.DISCORD_CLIENT_ID);
  body.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
  body.append("grant_type", "authorization_code");
  body.append("code", code);
  body.append("redirect_uri", process.env.DISCORD_REDIRECT_URI);

  let token = null;
  await fetch(UrlApi+"/oauth2/token", {
    method: "POST",
    headers: headers,
    body: body,
  })
      .then((tokenInfo) => tokenInfo.json())
      .then((data) => {
        if (data.access_token) {
          token = data;
        } else {
          functions.logger.log(data);
        }
      })
      .catch((err) => {
        functions.logger.log(err);
      });
  return token;
}

/**
 * Obtiene la información de Discord de un usuario.
 * @param {string} token - Token de Discord del usuario.
 * @return {Json} - Json que contiene la información.
 */
async function getUserInfo(token) {
  let userInfo = null;

  const headers = {
    "Authorization": `${token.token_type} ${token.access_token}`,
  };

  await fetch(UrlApi+"/users/@me", {
    method: "GET",
    headers: headers,
  })
      .then((user) => user.json())
      .then((data) => {
        userInfo = data;
      })
      .catch((err) => {
        functions.logger.log(err);
      });
  return userInfo;
}


/**
 * Obtiene la referencia de un usuario de firebase
 * a través del correo electrónico.
 * @param {string} email -  Email del usuario que se desea obtener.
 * @return {any} La referencia de un usuario de firebase
 * o null si no existe en la base.
 */
async function getUserReference(email) {
  const query =
  await admin.firestore().collection("user").where("email", "==", email).get();

  if (!query.empty) {
    return query.docs.pop();
  }
  return null;
}

/**
 * Guarda el Refresh Token en la base de datos para futuras peticiones.
 * @param {string} userRef - Referencia del usuario obtenido de firebase.
 * @param {string} userToken - Token del usario autorizado.
 * @return {boolean} true si se guardó el código en la base,
 * caso contrario devuelve false.
 */
async function setUserDiscordRefreshToken(userRef, userToken) {
  let hasSet = true;
  const query =
  await admin.firestore().collection("user_settings")
      .where("user", "==", userRef.ref).get();

  if (!query.empty) {
    const userSettings = query.docs.pop();
    await userSettings.ref.update({
      "discord_refresh_token": userToken,
    }).catch((err) =>{
      functions.logger.log(err);
      hasSet = false;
    });
  } else {
    hasSet = false;
  }
  return hasSet;
}

/**
 * Agrega a el usuario al servidor de Discord con los roles indicados o
 * si existe solo modifica sus roles.
 * @param {string[]} roles - Arreglo de roles a asignar.
 * @param {string} token - Access token de Discord.
 * @param {string} id - Id del usuario.
 */
async function addUserOrModify(roles, token, id) {
  let hasAddOrModify = false;

  const headers = {
    "Authorization":
    `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    "Content-Type": "application/json",
  };

  const paramsUser = {
    "access_token": token,
    "roles": roles};

  // console.log(paramsUser);
  await fetch( UrlApi+"/guilds/"+
  process.env.DISCORD_GUILD_ID+"/members/"+id, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(paramsUser),
  })
      .then((addUser) => {
        return addUser.json();
      })
      .then((data) => {
        console.log(data);
        hasAddOrModify = true;
      })
      .catch((err) =>{
        functions.logger.log(err);
        // res.send();
      });

  /* if (statusAddUser == 201 || statusAddUser == 204) {
            await fetch( UrlApi+
                "/guilds/"+process.env.DISCORD_GUILD_ID+
                "/members/"+userInfo.id+
                "/roles/1006247087459008653", {
              method: "PUT",
              headers: appHeaders,
            })
                .then((userModify) => userModify.json() )
                .then((data) => {
                  console.log(data);
                })
                .catch((err)=> {
                  functions.logger.log(err);
                // res.send();
                });
          }*/
  return hasAddOrModify;
}

module.exports = app;

