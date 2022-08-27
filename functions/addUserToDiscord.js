const fetch = require("node-fetch");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const admin = require("firebase-admin");
const UrlApi = "https://discord.com/api/v9";
const {google} = require("googleapis");
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets"});

const currentUrl = "http://localhost:5001/invrtir-app-b3266/us-central1/addUserToDiscord";

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
app.set("view engine", "ejs");


const requireParams = (params) => (req, res, next) => {
  const reqParamList = Object.keys(req.query);
  const hasAllRequiredParams = params.every((param) =>
    reqParamList.includes(param));
  if (!hasAllRequiredParams) {
    return res.status(404).send({error: "Param 'code' is required."});
  }
  next();
};

app.get("/app_flutter", requireParams(["code"]), async (req, res) => {
  const userToken = await getUserToken(req.query.code, "code");
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

app.get("/app_glade", requireParams(["code"]), async (req, res) => {
  const client = await auth.getClient();
  const googleSheet = google.sheets({version: "v4", auth: client});
  let rolesId = [];
  const userToken = await getUserToken(req.query.code, "code");

  if (userToken != null) {
    const userInfo = await getUserInfo(userToken);

    if (userInfo != null) {
      const userRef = await getUserRow(userInfo.email, googleSheet);

      if (userRef) {
        rolesId = await getRolesIdGS(userRef[0]);

        if (rolesId.length > 0) {
          if (
            await addUserOrModify(rolesId, userToken.access_token, userInfo.id)
          ) {
            res.render("successAddUserToDiscord", {url: "https://discord.com/login"});
          } else {
            res.render("errorAddUserToDiscord", {
              msg: "Algo salió mal con la autorización," +
              " por favor intente nuevamente.",
              msg_sec: "",
              addUser: false,
              url: ""});
          }
        }
      } else {
        functions.logger.log(
            "User with email: ", userInfo.email, " no exists in database");
        res.render("errorAddUserToDiscord", {
          msg: "Usuario con email: '"+ userInfo.email +
            "' no consta en nuestra base de datos.",
          msg_sec: "¿Quiere continuar igualmente o desea cambiar de usuario?",
          addUser: true,
          url: currentUrl + "/app_glade/create_user?email="+
          userInfo.email+"&id="+userInfo.id+
          "&refresh_token="+userToken.refresh_token});
      }
    } else {
      functions.logger.log("error", userInfo);
      res.render("errorAddUserToDiscord", {
        msg: "Algo salió mal con la autorización,"+
          " por favor intente nuevamente.",
        msg_sec: "",
        addUser: false,
        url: ""});
    }
  } else {
    functions.logger.log(userToken);
    res.render("errorAddUserToDiscord", {
      msg: "Algo salió mal con la autorización,"+
        " por favor intente nuevamente.",
      msg_sec: "",
      addUser: false,
      url: ""});
  }
  // res.send(JSON.stringify(users));
});

app.get("/app_glade/create_user",
    requireParams(["refresh_token", "email", "id"]), async (req, res) => {
      const params = req.query;
      const client = await auth.getClient();
      const googleSheet = google.sheets({version: "v4", auth: client});

      const userToken = await getUserToken(params.refresh_token, "refresh");

      const values = [];
      values.push([
        "11111111",
        "",
        params.email,
        "",
        "1381537",
        "", "", "", "", "", "", "", "", "", "", "",
        params.id]);

      if (userToken.access_token) {
        const addUserRes = await googleSheet.spreadsheets.values.append({
          spreadsheetId: process.env.SPREADSHEET_ID,
          range: process.env.ID_HOJA_NEW_USER,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            "range": process.env.ID_HOJA_NEW_USER,
            "values": values},
        });

        if (addUserRes.status == 200) {
          let flag = true;
          let userRow;
          while (flag) {
            userRow = await getUserRow(params.email, googleSheet);
            if (userRow != null) {
              flag = false;
            }
          }
          const updateValues = [];
          updateValues.push([params.id]);
          if (userRow != null) {
            const modifyUserRes = await googleSheet.spreadsheets.values.update({
              spreadsheetId: process.env.SPREADSHEET_ID,
              range: "Users!AM"+ userRow[1] + ":AM"+ userRow[1],
              valueInputOption: "USER_ENTERED",
              requestBody: {
                "range": "Users!AM"+ userRow[1] + ":AM"+ userRow[1],
                "values": updateValues},
            });

            const rolesId = ["1006246320769618091"];
            if (modifyUserRes.status == 200) {
              if (
                await addUserOrModify(
                    rolesId, userToken.access_token, params.id)
              ) {
                res.render("successAddUserToDiscord", {url: "https://discord.com/login"});
                return;
              }
            } else {
              functions.logger.log(modifyUserRes.json());
            }
          }
        } else {
          functions.logger.log(addUserRes.json());
        }
      }
      res.render("errorAddUserToDiscord", {
        msg: "Algo salió mal con la autorización," +
        " por favor intente nuevamente.",
        msg_sec: "",
        addUser: false,
        url: ""});
    });

/**
 * Obtiene el token del usuario autorizado.
 * @param {string} code - Código de autorización del usuario.
 * @param {string} type - Tipo de obtención de token.
 * @return {Json} Json que contiene el token.
 */
async function getUserToken(code, type) {
  const body = new URLSearchParams();
  const headers = {"Content-Type": "application/x-www-form-urlencoded;"};

  body.append("client_id", process.env.DISCORD_CLIENT_ID);
  body.append("client_secret", process.env.DISCORD_CLIENT_SECRET);

  if (type == "refresh") {
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", code);
  } else if ( type == "code") {
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", process.env.DISCORD_REDIRECT_URI);
  }

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
        if (data.email) {
          userInfo = data;
        } else {
          functions.logger.log(data);
        }
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
 * @param {sheets_v4.Sheets} spreadSheet - SpreadSheet Object
 * @return {DocumentSnapshot} La referencia de un usuario de firebase
 * o null si no existe en la base.
 */
async function getUserRow(email, spreadSheet) {
  const user = [];

  const userRow = (await spreadSheet.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: process.env.ID_HOJA_RANGO,
  })).data;

  if (userRow.values) {
    const values = userRow.values;
    let i = 0;
    for (const value of values) {
      i++;
      if (value[0] == email) {
        user.push(value);
        user.push(i);
        return user;
      }
    }
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
  let hasRemoved = true;
  let hasAdded = true;
  let status;

  const headers = {
    "Authorization": "Bot " + process.env.DISCORD_BOT_TOKEN,
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
      .then((res) => {
        status = res.status;
        return res;
      })
      .catch((err)=>{
        functions.logger.log(err);
        return false;
      });


  if (status == 204) {
    const userRoles = await getUserRoles(id);
    const returnValues = getAddRemoveRoles(roles, userRoles);

    if (returnValues[1].size > 0) {
      for (const rolId of returnValues[1]) {
        if (!await removeRol(rolId, id)) {
          hasRemoved = false;
          break;
        }
      }
    }

    if (returnValues[0].size > 0) {
      for (const rolId of returnValues[0]) {
        if (!await addRol(rolId, id)) {
          hasAdded = false;
          break;
        }
      }
    }

    if (hasRemoved && hasAdded) {
      hasAddOrModify = true;
    }
  } else {
    functions.logger.log("error_status: ", status);
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

/**
 * Obtiene el id del rol de discord de acuerdo al plan del usuario.
 * @param {JSON} userRow - Fila de datos del usuario en google sheet.
 * @return {Object} - La referencia del plan o null.
 */
async function getRolesIdGS(userRow) {
  const rolesId = [];
  // const rolesNames = [];
  let actualRoles = [];
  const rolesInfo = {};

  const headers = {
    "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
  };

  const crypto = userRow[6];
  const stock = userRow[5];

  await fetch(UrlApi + "/guilds/" + process.env.DISCORD_GUILD_ID+
  "/roles", {
    headers: headers,
    method: "GET",
  })
      .then((res)=>res.json())
      .then((data)=>{
        if (data[0].name) {
          actualRoles = data;
        } else {
          functions.logger.log(data);
          return [];
        }
      })
      .catch((err)=>{
        functions.logger.log(err);
      });

  for (const rol of actualRoles) {
    rolesInfo[rol.name] = rol.id;
  }

  if (crypto == 1 || stock == 1) {
    rolesId.push(rolesInfo["Invrtir-free"]);
  }

  if (crypto == 2) {
    rolesId.push(rolesInfo["Invrtir-crypto"]);
  }

  if (stock == 2) {
    rolesId.push(rolesInfo["Invrtir-basic"]);
  } else if (stock == 3) {
    rolesId.push(rolesInfo["Invrtir-pro"]);
  }
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
        } else {
          functions.logger.log(deleteRol);
        }
        return deleteRol;
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
        return addRol;
      })
      .catch((err) => functions.logger.log(err));

  return hasAdd;
}

module.exports = app;
