const express = require("express");
const router = express.Router();
const pool = require("../../database/db");
console.log("Router gradin chargé !");
router.get("/show", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Siege ORDER BY zone ASC, numero_colonne ASC, numero_ligne ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update", async (req, res) => {
  console.log("BODY RECU :", req.body); // 👈 AJOUTE ÇA

  const { numero_colonne, numero_ligne, zone, est_reserve } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Siege SET est_reserve = $1 WHERE numero_colonne = $2 AND numero_ligne = $3 AND zone = $4 RETURNING *",
      [est_reserve, numero_colonne, numero_ligne, zone]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
