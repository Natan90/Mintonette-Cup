const express = require("express");
const router = express.Router();
const pool = require("../../database/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /utilisateur/inscription:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Utilisateurs]
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
 *               prenom:
 *                 type: string
 *               login:
 *                 type: string
 *               mdp:
 *                 type: string
 *               mail:
 *                 type: string
 *               date_naissance:
 *                 type: string
 *                 format: date
 *               sexe:
 *                 type: string
 *                 enum: [H, F]
 *           example:
 *             nom: "Dupont"
 *             prenom: "Jean"
 *             login: "jdupont"
 *             mdp: "Motdepasse123"
 *             mail: "jean.dupont@mail.com"
 *             date_naissance: "1990-05-12"
 *             sexe: "H"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *       400:
 *         description: Champs obligatoires manquants
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
// POST /utilisateur/auth/inscription
router.post("/inscription", async (req, res) => {
  console.log("Body reçu :", req.body);
  const { nom, prenom, login, mdp, mail, tel_utilisateur, sexe } = req.body;
  console.log(req.body);

  if (!nom || !prenom || !login || !mdp || !mail || !tel_utilisateur || !sexe) {
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
        (nom_utilisateur, prenom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, tel_utilisateur, sexe_utilisateur) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_utilisateur`,
      [nom, prenom, login, mdp, mail, tel_utilisateur, sexe] // mettre passwordHash quand il faudra le crypter
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

/**
 * @swagger
 * /utilisateur/connexion:
 *   post:
 *     summary: Connecte un utilisateur et retourne un token de session
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - mdp
 *             properties:
 *               login:
 *                 type: string
 *               mdp:
 *                 type: string
 *           example:
 *             login: "jdupont"
 *             mdp: "Motdepasse123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     login:
 *                       type: string
 *                     nom:
 *                       type: string
 *                     prenom:
 *                       type: string
 *                 expiresAt:
 *                   type: string
 *       401:
 *         description: Login ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
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

/**
 * @swagger
 * /api/utilisateur/{id}:
 *   put:
 *     summary: Modifie les informations de l'utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               mail:
 *                 type: string
 *               tel_utilisateur:
 *                 type: string
 *               login:
 *                 type: string
 *               sexe:
 *                 type: string
 *           example:
 *             nom: "Dupont"
 *             prenom: "Jean"
 *             mail: "jean.dupont@mail.com"
 *             tel_utilisateur: "01-23-45-67-89"
 *             login: "jdupont"
 *             sexe: "H"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
// PUT /utilisateur/auth/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, mail, tel_utilisateur, login, sexe } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const checkUser = await client.query(
      "SELECT id_utilisateur FROM Utilisateur WHERE id_utilisateur = $1",
      [id]
    );

    if (checkUser.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        error: "Utilisateur non trouvé",
      });
    }

    if (mail) {
      const checkEmail = await client.query(
        "SELECT id_utilisateur FROM Utilisateur WHERE mail_utilisateur = $1 AND id_utilisateur != $2",
        [mail, id]
      );

      if (checkEmail.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          error: "Email déjà utilisé",
        });
      }
    }

    const updateQuery = `
      UPDATE Utilisateur 
      SET 
        nom_utilisateur = COALESCE($1, nom_utilisateur),
        prenom_utilisateur = COALESCE($2, prenom_utilisateur),
        mail_utilisateur = COALESCE($3, mail_utilisateur),
        tel_utilisateur = COALESCE($4, tel_utilisateur),
        login_utilisateur = COALESCE($5, login_utilisateur),
        sexe_utilisateur = COALESCE($6, sexe_utilisateur)
      WHERE id_utilisateur = $7
      RETURNING *
    `;

    const result = await client.query(updateQuery, [nom, prenom, mail, tel_utilisateur, login, sexe, id]);

    await client.query("COMMIT");

    res.json({
      message: "Utilisateur mis à jour avec succès",
      user: {
        id: result.rows[0].id_utilisateur,
        nom: result.rows[0].nom_utilisateur,
        prenom: result.rows[0].prenom_utilisateur,
        mail: result.rows[0].mail_utilisateur,
        tel_utilisateur: result.rows[0].tel_utilisateur,
        login: result.rows[0].login_utilisateur,
        sexe: result.rows[0].sexe_utilisateur,
      }
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur modification utilisateur : ", err);
    res.status(500).json({
      error: "Erreur serveur",
    });
  } finally {
    client.release(); 
  }
});

module.exports = router;
