const fetch = require("node-fetch");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const admin = require("firebase-admin");
const UrlApi = "https://discord.com/api/v9";
const {google} = require("googleapis");
const { request } = require("express");
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets"});


// Automatically allow cross-origin requests
app.use(cors({origin: true}));


const requireParams = (params) => (req, res, next) => {
  const reqParamList = Object.keys(req.params);
  const hasAllRequiredParams = params.every((param) =>
    reqParamList.includes(param));
  if (!hasAllRequiredParams) {
    return res.status(404).send({error: "Param \"code\" is required."});
  }
  next();
};

app.get("/app_flutter", requireParams(["code"]), async (req, res) => {
  const userToken = await getUserToken(req.params.code);

  if (userToken != null) {
    const userInfo = await getUserInfo(userToken);

    if (userInfo != null) {
      const userRef = await getUserReference(userInfo.email);

      if (userRef != null) {
        const savedUserToken =
        await setUserDiscordRefreshToken(userRef, userToken.refresh_token);

        if (savedUserToken) {
          const rolesId = await getRoleId(userRef.data().plan);
          if (rolesId) {
            await addUserOrModify(
                rolesId, userToken.access_token, userInfo.id);
          }
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


app.get("/app_glide", requireParams(["code"]), async (req, res) => {
  const client = await auth.getClient();
  const sheet = google.sheets({version: "v4", auth: client});

  const request = {
    spreadsheetId: process.env.SPREADSHEET_USERS_ID,
    resource: {
      dataFilters: [
        {
          "developerMetadataLookup":
            {
              "metadataLocation":
                {
                  "spreadsheet": true,
                  "sheetId": process.env.SPREADSHEET_USERS_ID,
                  "dimensionRange":
                    {
                      "sheetId": process.env.SPREADSHEET_USERS_ID,
                      "startIndex": 0,
                      "endIndex": 9,
                    },
                },
              "metadataId": integer,
              "metadataKey": string,
              "metadataValue": string,
            },
          "a1Range": "",
          "gridRange":
            {
              "sheetId": integer,
              "startRowIndex": integer,
              "endRowIndex": integer,
              "startColumnIndex": integer,
              "endColumnIndex": integer,
            }
        }
      ],
      includeGridData: false,
    },
  };

  const results = await sheet.spreadsheets.getByDataFilter().data;
  console.log(results);

  const userToken = await getUserToken(req.params.code);

  if (userToken != null) {
    const userInfo = await getUserInfo(userToken);

    if (userInfo != null) {
      const userRef = await getUserReference(userInfo.email);

      if (userRef != null) {
        const rolesId = await getRoleId(userRef.data().plan);
        if (rolesId) {
          await addUserOrModify(
              rolesId, userToken.access_token, userInfo.id);
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
 * @return {DocumentSnapshot} La referencia de un usuario de firebase
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
 * Obtiene la fila de la hoja de google sheet en la que se encuentra
 * registrado el usuario.
 * @param {string} email -  Email del usuario que se desea obtener.
 * @return {DocumentSnapshot} La referencia de un usuario de firebase
 * o null si no existe en la base.
 */
async function getUserRow(email) {
  const query =
  await admin.firestore().collection("user").where("email", "==", email).get();

  if (!query.empty) {
    return query.docs.pop();
  }
  return null;
}

/**
 * Guarda el Refresh Token en la base de datos para futuras peticiones.
 * @param {DocumentSnapshot} userRef -
 * Referencia del usuario obtenido de firebase.
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
  let status;
  const headers = {
    "Authorization":
    `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    "Content-Type": "application/json",
  };

  const paramsUser = {
    "access_token": token,
    "roles": roles};

  await fetch( UrlApi+"/guilds/"+
  process.env.DISCORD_GUILD_ID+"/members/"+id, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(paramsUser),
  })
      .then((addUser) => {
        status = addUser.status;
        return addUser.json();
      })
      .then((data) => {
        if (status == 201) {
          hasAddOrModify = true;
        }
      })
      .catch((err) =>{
        functions.logger.log(err);
        // res.send();
      });

  if (status == 204) {
    const userRoles = await getUserRoles(id);
    console.log(userRoles);
    const returnValues = getAddRemoveRoles(roles, userRoles);

    for (const rolId of returnValues[1]) {
      await removeRol(rolId, id);
    }

    for (const rolId of returnValues[0]) {
      await addRol(rolId, id);
    }
    /* await fetch( UrlApi+
          "/guilds/"+process.env.DISCORD_GUILD_ID+
          "/members/"+id+
          "/roles/1006247087459008653", {
      method: "PUT",
      headers: headers,
    })
        .then((userModify) => userModify.json() )
        .then((data) => {
          hasAddOrModify = true;
          console.log(data);
        })
        .catch((err)=> {
          functions.logger.log(err);
        });
        */
  }
  return hasAddOrModify;
}

/**
 * Obtiene el id del rol de discord de acuerdo al plan del usuario.
 * @param {DocumentSnapshot} planRef - Plan del usuario.
 * @return {Object} - La referencia del plan o null.
 */
async function getRoleId(planRef) {
  const rolesId = [];
  const query = await admin.firestore().collection("discord_roles")
      .where("plan", "==", planRef).get();

  if (query.empty) {
    return [];
  }

  query.forEach((doc) => {
    rolesId.push(doc.data().discord_id);
  });

  return rolesId;
}

module.exports = app;


/**
 * Obtiene los roles del usuario de discord.
 * @param {string} id - Id del usuario.
 * @return {String[]} - Arreglo de roles.
 */
async function getUserRoles(id) {
  let roles = null;
  const headers = {
    "Authorization": "Bot " + process.env.DISCORD_BOT_TOKEN,
  };

  await fetch(UrlApi + "/guilds/" + process.env.DISCORD_GUILD_ID +
    "/members/" + id, {
    method: "GET",
    headers: headers,
  })
      .then((userRol) => userRol.json())
      .then((data) => {
        console.log(data);
        roles = data.roles;
      })
      .catch((err)=>{
        functions.logger.log(err);
      });
  return roles;
}

/**
 * Obtiene los roles que se deben agregar
 * y los que se deben eliminar al usuario.
 * @param {String[]} planRoles - Roles pertenecientes al plan.
 * @param {String[]} userRoles - Roles del usuario.
 * @return {[Set<String>]} - Dos arreglos: uno con los que se deben
 * eliminar y otro con los que se deben agregar.
 */
function getAddRemoveRoles(planRoles, userRoles) {
  const addRoles = new Set(planRoles);
  const removeRoles = new Set(userRoles);
  const returnValues = [];
  for (const id of userRoles) {
    addRoles.delete(id);
  }

  for (const id of planRoles) {
    removeRoles.delete(id);
  }

  returnValues.push(addRoles);
  returnValues.push(removeRoles);

  return returnValues;
}
/**
 * Remueve el rol del usuario en discord.
 * @param {string} rol - Lista de roles.
 * @param {string} id - Id del usuario.
 * @return {boolean} - True si fue borrado.
 */
async function removeRol(rol, id) {
  let hasRemove = false;

  const headers = {
    "Authorization": "Bot " + process.env.DISCORD_BOT_TOKEN,
  };

  await fetch(UrlApi +
    "/guilds/" + process.env.DISCORD_GUILD_ID +
    "/members/" + id + "/roles/" + rol, {
    method: "DELETE",
    headers: headers,
  })
      .then((deleteRol) => {
        if (deleteRol.status == 204) {
          hasRemove = true;
        }
      })
      .catch((err) => functions.logger.log(err));

  return hasRemove;
}

/**
 * Agrega el rol del usuario en discord.
 * @param {string} rol - Lista de roles.
 * @param {string} id - Id del usuario.
 * @return {boolean} True si fue agregado.
 */
async function addRol(rol, id) {
  let hasAdd = false;

  const headers = {
    "Authorization": "Bot " + process.env.DISCORD_BOT_TOKEN,
  };

  await fetch(UrlApi +
    "/guilds/" + process.env.DISCORD_GUILD_ID +
    "/members/" + id + "/roles/" + rol, {
    method: "PUT",
    headers: headers,
  })
      .then((addRol) => {
        if (addRol.status == 204) {
          hasAdd = true;
        }
      })
      .catch((err) => functions.logger.log(err));

  return hasAdd;
}

module.exports = app;
