const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateur.controller");
const utilisateurMiddleware = require("../middlewares/utilisateur.middleware");
const authMiddleware = require("../middlewares/auth.middleware");


// POST devenir utilisateur
router.post("/inscription", utilisateurMiddleware.validateInscription, utilisateurController.inscriptionUtilisateur);

// POST connencter utilisateur
router.post("/connexion", utilisateurMiddleware.validateConnexion, utilisateurController.connexionUtilisateur);

// POST mettre à jour utilisateur
router.post("/update/:id", authMiddleware.authenticateToken, utilisateurMiddleware.validateUpdateUtilisateur, utilisateurController.updateUtilisateur);


module.exports = router;
