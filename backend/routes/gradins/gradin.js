const express = require("express");
const router = express.Router();
const pool = require("../../database/db");

router.get("/show", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Siege ORDER BY zone ASC, numero_colonne ASC, numero_ligne ASC;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
