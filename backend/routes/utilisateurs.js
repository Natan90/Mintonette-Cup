// routes/utilisateurs.js
const express = require('express');
const router = express.Router();

// Liste des utilisateurs
router.get('/show', (req, res) => {
  const db = req.db;
  db.all('SELECT * FROM Utilisateur', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Inscription d’un utilisateur
router.post('/inscription', (req, res) => {
  const db = req.db;
  const { nom, prenom, login, mdp, mail, date_naissance, sexe } = req.body;

  if (!nom || !prenom || !login || !mdp || !mail)
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


  db.run(sql, [nom, prenom, login, mdp, mail, date_naissance, sexe], function (err) {
    if (err) {
      console.error("Erreur d’insertion :", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Utilisateur créé", id: this.lastID });
  });
});

module.exports = router;
