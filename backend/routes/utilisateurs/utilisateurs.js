const express = require("express");
const router = express.Router();
const pool = require("../../database/db");

router.get("/show", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Utilisateur");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/show/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM Utilisateur WHERE id_utilisateur=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/inscription", async (req, res) => {
  const { nom, prenom, login, mdp, mail, date_naissance, sexe } = req.body;
  if (!nom || !prenom || !login || !mdp || !mail || !date_naissance || !sexe)
    return res.status(400).json({ error: "Champs obligatoires manquants" });

  try {
    const result = await pool.query(
      `INSERT INTO Utilisateur 
      (nom_utilisateur, prenom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, date_naissance_utilisateur, sexe_utilisateur)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id_utilisateur`,
      [nom, prenom, login, mdp, mail, date_naissance, sexe]
    );
    res.json({ message: "Utilisateur créé", id: result.rows[0].id_utilisateur });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.post("/connexion", async (req, res) => {
  const { login, mdp } = req.body;
  if (!login || !mdp) return res.status(400).json({ error: "Champs obligatoires manquants" });

  try {
    const result = await pool.query(
      "SELECT * FROM Utilisateur WHERE login_utilisateur=$1 AND mdp_utilisateur=$2",
      [login, mdp]
    );
    if (result.rows.length === 0) return res.status(401).json({ message: "Identifiants invalides" });
    res.json({ message: "Connexion réussie", utilisateur: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("DELETE FROM Utilisateur WHERE id_utilisateur=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé", utilisateur: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
