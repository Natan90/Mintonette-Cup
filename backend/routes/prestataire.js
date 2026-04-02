const express = require("express");
const router = express.Router();
const prestataireController = require("../controllers/prestataire.controller");
const prestataireMiddleware = require("../middlewares/prestataire.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET prestataire
router.get("/show", prestataireController.getPrestataire);

// GET prestataire par id_presta
router.get("/show/:id_presta", prestataireMiddleware.validatePrestataireByIdPrestataire, prestataireController.getPrestataireByIdPrestataire);

// GET prestataire par id_user
router.get("/show/:id_user", prestataireMiddleware.validatePrestataireByIdUtilisateur, prestataireController.getPrestataireByIdUtilisateur);

// POST devenir prestataire
router.post("/becomePrestataire/:id", authMiddleware.authenticateToken, prestataireMiddleware.validateBecomePresta, prestataireController.becomePrestataire);

// POST mettre à jour prestataire
router.post("/updatePrestataire/:id", authMiddleware.authenticateToken, prestataireMiddleware.validateUpdatePresta, prestataireController.updatePrestataire);

module.exports = router;
