const express = require("express");
const router = express.Router();
const pool = require("../../database/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

// POST /utilisateur/inscription
router.post("/inscription", async (req, res) => {
  console.log("Body reçu :", req.body);
  const { nom, prenom, login, mdp, mail, date_naissance, sexe } = req.body;

  if (!nom || !prenom || !login || !mdp || !mail || !date_naissance || !sexe) {
    return res.status(400).json({
      error: "Champs obligatoires manquants",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Vérifier si le mail existe déjà
    const checkUser = await client.query(
      "SELECT id_utilisateur FROM Utilisateur WHERE mail_utilisateur = $1",
      [mail]
    );

    if (checkUser.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "Email déjà utilisé",
      });
    }

    const passwordHash = await bcrypt.hash(mdp, 10);

    const result = await client.query(
      `INSERT INTO Utilisateur 
        (nom_utilisateur, prenom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, date_naissance_utilisateur, sexe_utilisateur) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_utilisateur`,
      [nom, prenom, login, mdp, mail, date_naissance, sexe] // mettre passwordHash quand il faudra le crypter
    );

    const newUser = result.rows[0];

    // Assigner le rôle (user par défaut)

    await client.query("COMMIT");

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser.id_utilisateur,
      }
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Erreur création utilisateur : ", err);
    res.status(500).json({
      error: "Erreur serveur",
    });
  } finally {
    client.release(); 
}
});

// POST /utilisateur/connexion
router.post("/connexion", async (req, res) => {
  const { login, mdp } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Récupérer l'utilisateur
    const userResult = await client.query(
      `SELECT * FROM Utilisateur WHERE login_utilisateur = $1`,
      [login]
    );

    if (userResult.rows.length === 0) {
      // Tentative de connexion échouée
      // Faire le nombre de tentative de connexion
      // await client.query(
      //   `INSERT INTO logs_connexion
      //   (email_tentative, succes, message)
      //   VALUES ($1, false, 'Email inexistant')`,
      //   [mail]
      // );

      await client.query("COMMIT");

      return res.status(401).json({
        error: "Login ou mot de passe incorrect",
      });
    }

    const user = userResult.rows[0];

    // if (!user.actif) {
    //   // await client.query(
    //   //   `INSERT INTO logs_connexion
    //   //   (utilisateur_id, email_tentative, succes, message)
    //   //   VALUES ($1, $2, false, 'Compte désactivé')`,
    //   //   [user.id, mail]
    //   // );

    //   await client.query("COMMIT");

    //   return res.status(403).json({
    //     error: "Compte désactivé",
    //   });
    // }

    // const passwordMatch = await bcrypt.compare(mdp, user.mdp_utilisateur);
    // if (!passwordMatch) {
    //   // await client.query(
    //   //   `INSERT INTO logs_connexion
    //   //   (utilisateur_id, email_tentative, succes, message)
    //   //   VALUES ($1, $2, false, 'Mot de passe incorrect')`,
    //   //   [user.id, mail]
    //   // );

    //   await client.query("COMMIT");

    //   return res.status(401).json({
    //     error: "Email ou mot de passe incorrect",
    //   });
    // }

    // Générer un token de session
    const token = uuidv4();
    const expiresAt = new Date();

    expiresAt.setHours(expiresAt.getHours() + 24); // 24h

    // Créer la session
    // await client.query(
    //   `INSERT INTO sessions
    //   (utilisateur_id, token, date_expiration)
    //   VALUES ($1, $2, $3)`,
    //   [user.id, token, expiresAt]
    // );

    // Logger la connexion réussie
    // await client.query(
    //   `INSERT INTO logs_connexion
    //   (utilisateur_id, email_tentative, succes, message)
    //   VALUES ($1, $2, true, 'Connexion réussie')`,
    //   [user.id, mail]
    // );

    await client.query("COMMIT");
    res.json({
      message: "Connexion réussie",
      token: token,
      user: {
        id: user.id_utilisateur,
        login: user.login_utilisateur,
        nom: user.nom_utilisateur,
        prenom: user.prenom_utilisateur,
      },
      expiresAt: expiresAt,
    });

  } catch (err) {
    console.error(err);
  } finally {
    client.release(); 
}
});


module.exports = router;