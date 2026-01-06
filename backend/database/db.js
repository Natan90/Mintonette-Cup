const { Pool } = require("pg");
const path = require('path');
// Load the backend .env explicitly to avoid depending on process.cwd()
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

 
// Coerce env values to expec ted types and log non-sensitive info for debugging
const dbPassword = process.env.DB_PASSWORD === undefined ? undefined : String(process.env.DB_PASSWORD);
console.log(`DB config: user=${process.env.DB_USER}, host=${process.env.DB_HOST}, database=${process.env.DB_NAME}, port=${process.env.DB_PORT}, passwordLength=${dbPassword? dbPassword.length : 0}`);

const pool = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
  password: dbPassword,
  port: Number(process.env.DB_PORT) || 5432,
});


pool.on("connect", () => {
  console.log("Connecté à PostgreSQL");
});


pool.on("error", (err) => {
  console.error("Erreur PostgreSQL:", err);
});


module.exports = pool;
