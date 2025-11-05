const { Pool } = require("pg");
require("dotenv").config();

async function ensureDatabase() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME, 
  });

  try {
    const res = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    if (res.rowCount === 0) {
      console.log(`Création de la base ${process.env.DB_NAME}...`);
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Base créée.`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

module.exports = ensureDatabase;
