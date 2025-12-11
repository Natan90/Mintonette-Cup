const express = require("express");
const router = express.Router();
const pool = require("../../database/db"); 

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
  const { numero_colonne, numero_ligne, zone, est_reserve, dans_panier } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Siege SET est_reserve = $1, dans_panier = $2 WHERE numero_colonne = $3 AND numero_ligne = $4 AND zone = $5 RETURNING *",
      [est_reserve, dans_panier, numero_colonne, numero_ligne, zone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/panier", async (req, res) => {
  const { numero_colonne, numero_ligne, zone, dans_panier } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Siege SET dans_panier = $1 WHERE numero_colonne = $2 AND numero_ligne = $3 AND zone = $4 RETURNING *",
      [dans_panier, numero_colonne, numero_ligne, zone]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/panier/show", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Siege WHERE dans_panier = true"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
