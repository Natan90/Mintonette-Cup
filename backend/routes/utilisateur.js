const passport = require("passport");
const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateur.controller");
const utilisateurMiddleware = require("../middlewares/utilisateur.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// POST refresh token 
/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Génère un nouveau token JWT
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token rafraîchi avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Token manquant, invalide ou expiré
 */
router.post(
  "/refresh",
  authMiddleware.authenticateToken,
  utilisateurMiddleware.validateRefreshToken,
  utilisateurController.refreshToken
)


// POST devenir utilisateur
/**
 * @swagger
 * /inscription:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Utilisateur]
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
 *               tel_utilisateur:
 *                 type: string
 *               sexe:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       409:
 *         description: Email déjà utilisé
 */
router.post(
  "/inscription",
  utilisateurMiddleware.validateInscription,
  utilisateurController.inscriptionUtilisateur,
);-

// POST connencter utilisateur
/**
 * @swagger
 * /connexion:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Utilisateur]
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
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Identifiants incorrects
 *       429:
 *         description: Trop de tentatives de connexion
 */
router.post(
  "/connexion",
  utilisateurMiddleware.validateConnexion,
  utilisateurController.connexionUtilisateur,
);

// POST mettre à jour utilisateur
/**
 * @swagger
 * /update/{id}:
 *   post:
 *     summary: Met à jour un utilisateur
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               photo_profil:
 *                 type: string
 *                 description: Image encodée en base64
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 *       409:
 *         description: Email déjà utilisé
 */
router.post(
  "/update/:id",
  authMiddleware.authenticateToken,
  utilisateurMiddleware.validateUpdateUtilisateur,
  utilisateurController.updateUtilisateur,
);

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Redirige vers Google OAuth
 *     tags: [Utilisateur]
 *     responses:
 *       302:
 *         description: Redirection vers Google
 */
router.get("/google", 
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }));

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Callback Google OAuth
 *     tags: [Utilisateur]
 *     responses:
 *       200:
 *         description: Authentification réussie via Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Auth Google échouée
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/fr/utilisateur/connexion",
  }),
  authMiddleware.validateGoogleCallback,
  utilisateurController.googleAuthenticateCallback
);


module.exports = router;
