const express = require("express");
const router = express.Router();

router.get("/show", (req, res) => {
  const db = req.db;
  db.all("SELECT * FROM Utilisateur", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.get("/show/:id", (req, res) => {
  const db = req.db;
  const id = req.params.id;

  db.get("SELECT * FROM Utilisateur WHERE id_utilisateur = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(row);
  });
})

router.post("/inscription", (req, res) => {
  const db = req.db;
  const { nom, prenom, login, mdp, mail, date_naissance, sexe } = req.body;

  if (!nom || !prenom || !login || !mdp || !mail || !date_naissance || !sexe)
    return res.status(400).json({ error: "Champs obligatoires manquants" });

  const sql = `
    INSERT INTO Utilisateur (
      nom_utilisateur,
      prenom_utilisateur,
      login_utilisateur,
      mdp_utilisateur,
      mail_utilisateur,
      date_naissance_utilisateur,
      sexe_utilisateur
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [nom, prenom, login, mdp, mail, date_naissance, sexe],
    function (err) {
      if (err) {
        console.error("Erreur d’insertion :", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Utilisateur créé avec l'id : ", id: this.lastID });
    }
  );
});

router.post("/connexion", (req, res) => {
  const db = req.db;
  const { login, mdp } = req.body;

  if (!login || !mdp)
    return res.status(400).json({ error: "Champs obligatoires manquants" });

  const sql = `
  SELECT * FROM Utilisateur
  WHERE login_utilisateur = ? AND mdp_utilisateur = ?;`;

  db.get(sql, [login, mdp], (err, row) => {
    if (err) {
      console.error("Erreur de connexion :", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    res.json({
      message: "Connexion réussie",
      utilisateur: row,
    });
  });
});

module.exports = router;
