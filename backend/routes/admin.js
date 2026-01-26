const express = require("express");
const router = express.Router();
const admin_prestataireController = require("../controllers/admin_prestataire.controller");
const admin_prestataireMiddleware = require("../middlewares/admin_prestataire.middleware");

// PATCH valider un prestataire
router.patch("/validate/:id", admin_prestataireMiddleware.validatePrestataireId, admin_prestataireController.validatePrestataireById);

// PATCH refuser un prestataire
router.patch("/refuser/:id", admin_prestataireMiddleware.refuserPrestataireById, admin_prestataireController.refuserPrestataireById);

// DELETE supprimer un prestataire
router.delete("/delete/:id", admin_prestataireMiddleware.deletePrestataireById, admin_prestataireController.deletePrestataireById);

// GET récupère les zones des prestataires
router.get("/zones", admin_prestataireController.getZone);

// PATCH assigne une zone à un prestataire
router.patch("/assignZone/:id", admin_prestataireMiddleware.validateAssignZoneById, admin_prestataireController.assignZoneById);

// PATCH n'assigne plus une zone à un prestataire
router.patch("/unassignZone/:id", admin_prestataireMiddleware.validateUnassignZoneById, admin_prestataireController.unassignZoneById);

module.exports = router;
