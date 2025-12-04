const express = require("express");
const router = express.Router();
const pool = require("../../database/db");


router.get("/show", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Prestataire ORDER BY nom_prestataire");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/showTypePrestataire", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Type_prestataire ORDER BY nom_type_prestataire");
    res.json(result.rows);
  }  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/showEveryType", async (req, res) => {
  try {
    const animations = await pool.query("SELECT * FROM Type_animation ORDER BY nom_type_animation");
    const restaurations = await pool.query("SELECT * FROM Type_restauration ORDER BY nom_type_restauration");
    const boutiques = await pool.query("SELECT * FROM Type_boutique ORDER BY nom_type_boutique");

    res.json({
      animations: animations.rows,
      restaurations: restaurations.rows,
      boutiques: boutiques.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})


module.exports = router;