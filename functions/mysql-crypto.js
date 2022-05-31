const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_CRYPTO,
  port: process.env.DB_PORT,
});
connection.connect((err) => {
  if (err) throw err;
  console.log("¡Conectado!");
});

module.exports = connection;
