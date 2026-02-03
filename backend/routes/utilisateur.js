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

// POST deconnexion utilisateur
router.post("/logout", authSessionMiddleware, utilisateurController.deconnexionUtilisateur)


module.exports = router;
