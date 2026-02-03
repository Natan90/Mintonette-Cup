const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateur.controller");
const utilisateurMiddleware = require("../middlewares/utilisateur.middleware");
const authSessionMiddleware = require("../middlewares/authSession.middleware");


// POST devenir utilisateur
router.post("/inscription", utilisateurMiddleware.validateInscription, utilisateurController.inscriptionUtilisateur);

// POST connencter utilisateur
router.post("/connexion", utilisateurMiddleware.validateConnexion, utilisateurController.connexionUtilisateur);

// POST mettre à jour utilisateur
router.post("/update/:id", authSessionMiddleware, utilisateurMiddleware.validateUpdateUtilisateur, utilisateurController.updateUtilisateur);

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("mySession");
    res.json({ message: "Déconnecté" });
  });
});


module.exports = router;
