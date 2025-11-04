const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /utilisateur/show:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_utilisateur:
 *                     type: integer
 *                   nom_utilisateur:
 *                     type: string
 *                   prenom_utilisateur:
 *                     type: string
 */
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

/**
 * @swagger
 * /utilisateur/inscription:
 *   post:
 *     summary: Ajoute un utilisateur dans la base de données
 *     tags: [Utilisateurs]
 *     description: >
 *       Ajoute un utilisateur dans la base de données en vérifiant qu'il ne manque pas de valeurs.
 *       Renvoie un message d'erreur ou de succès.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - login
 *               - mdp
 *               - mail
 *               - date_naissance
 *               - sexe
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Dupont
 *               prenom:
 *                 type: string
 *                 example: Jean
 *               login:
 *                 type: string
 *                 example: jdupont
 *               mdp:
 *                 type: string
 *                 example: password123
 *               mail:
 *                 type: string
 *                 example: jean.dupont@example.com
 *               date_naissance:
 *                 type: string
 *                 format: date
 *                 example: 2001-05-10
 *               sexe:
 *                 type: string
 *                 enum: [Homme, Femme, Autre]
 *                 example: Homme
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Champs manquants
 *       500:
 *         description: Erreur d’insertion en base de données
 */

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
