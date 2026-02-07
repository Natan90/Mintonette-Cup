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

router.get(
  "/google",
  (req, res, next) => {
    console.log("🔹 Route /google appelée");
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/fr/utilisateur/connexion" }),
  async (req, res, next) => {

    try {
      const user = req.user;
      if (!user) {
        console.log("❌ Aucun user dans req.user");
        return res.redirect(`${process.env.LINK_FRONT}/fr/utilisateur/connexion`);

      }

      // Générer le token directement depuis le service
      const utilisateurService = require("../services/utilisateur.service");
      const token = utilisateurService.generateToken(user);

      console.log("✅ Redirection avec token Google");
      // Redirection vers le front
      res.redirect(`${process.env.LINK_FRONT}/fr/utilisateur/connexion?token=${token}`);
    } catch (err) {
      next(err);
    }
  }
);


module.exports = router;
