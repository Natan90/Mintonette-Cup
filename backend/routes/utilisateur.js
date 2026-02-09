const passport = require("passport");
const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateur.controller");
const utilisateurMiddleware = require("../middlewares/utilisateur.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// POST devenir utilisateur
router.post(
  "/inscription",
  utilisateurMiddleware.validateInscription,
  utilisateurController.inscriptionUtilisateur,
);-

// POST connencter utilisateur
router.post(
  "/connexion",
  utilisateurMiddleware.validateConnexion,
  utilisateurController.connexionUtilisateur,
);

// POST mettre à jour utilisateur
router.post(
  "/update/:id",
  authMiddleware.authenticateToken,
  utilisateurMiddleware.validateUpdateUtilisateur,
  utilisateurController.updateUtilisateur,
);

router.get("/google", 
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }));

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
