const express = require("express");
const router = express.Router();
const prestataireController = require("../controllers/prestataire.controller");
const prestataireMiddleware = require("../middlewares/prestataire.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET prestataire
router.get("/show", prestataireController.getPrestataire);

// GET prestataire par type (utilisateur ou prestataire)
router.get("/show/:id", prestataireController.getPrestataireById);

// GET filtre du prestataire ou service
router.get("/showFilter", prestataireMiddleware.validateFilter, prestataireController.getFiltered);

// POST devenir prestataire
router.post("/becomePrestataire/:id", authMiddleware.authenticateToken, prestataireMiddleware.validateBecomePresta, prestataireController.becomePrestataire);

// POST mettre à jour prestataire
router.post("/updatePrestataire/:id", authMiddleware.authenticateToken, prestataireMiddleware.validateUpdatePresta, prestataireController.updatePrestataire);

module.exports = router;
