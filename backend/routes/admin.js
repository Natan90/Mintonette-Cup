const express = require("express");
const router = express.Router();
// Prestataire
const admin_prestataireController = require("../controllers/admin_prestataire.controller");
const admin_prestataireMiddleware = require("../middlewares/admin_prestataire.middleware");

// Statistiques
const admin_statistiqueController = require("../controllers/admin_statistiques.controller");

// Evenement
const admin_evenementController = require("../controllers/admin_evenement.controller");
const admin_evenementMiddleware = require("../middlewares/admin_evenement.middleware");

// Utiilisateur
const admin_utilisateurController = require("../controllers/admin_utilisateur.controller");
const admin_utilisateurMiddleware = require("../middlewares/admin_utilisateur.middleware");

// ========= PRESTATAIRE ========= // 

// PATCH valider un prestataire
router.patch("/prestataire/validate/:id", admin_prestataireMiddleware.validatePrestataireId, admin_prestataireController.validatePrestataireById);

// PATCH refuser un prestataire
router.patch("/prestataire/refuser/:id", admin_prestataireMiddleware.refuserPrestataireById, admin_prestataireController.refuserPrestataireById);

// DELETE supprimer un prestataire
router.delete("/prestataire/delete/:id", admin_prestataireMiddleware.deletePrestataireById, admin_prestataireController.deletePrestataireById);

// GET récupère les zones des prestataires
router.get("/prestataire/zones", admin_prestataireController.getZone);

// PATCH assigne une zone à un prestataire
router.patch("/prestataire/assignZone/:id", admin_prestataireMiddleware.validateAssignZoneById, admin_prestataireController.assignZoneById);

// PATCH n'assigne plus une zone à un prestataire
router.patch("/prestataire/unassignZone/:id", admin_prestataireMiddleware.validateUnassignZoneById, admin_prestataireController.unassignZoneById);


// ========= STATISTIQUE ========= // 

// GET récupère les statistiques
router.get("/dashboard/stats", admin_statistiqueController.getStatistiques);


// ========= EVENEMENT ========= // 

// GET récupère l'évènement
router.get("/evenement/show", admin_evenementController.getEvenement);

// PUT update l'évènement
router.put("/evenement/update", admin_evenementMiddleware.validateUpdateEvenement, admin_evenementController.updateEvenement);


// ========= Utilisateur ========= // 

// GET récupère les utilisateurs
router.get("/utilisateur/show", admin_utilisateurController.getUtilisateur);

// GET récupère un utilisateur par id
router.get("/utilisateur/show/:id", admin_utilisateurMiddleware.validateIdParams, admin_utilisateurController.getUtilisateurById);

// PATCH change le statut de prestataire de l'utilisateur
router.patch("/utilisateur/changePresta/:id", admin_utilisateurMiddleware.validateIdParams, admin_utilisateurMiddleware.validateValueChange, admin_utilisateurController.updateUtilisateurInPresta);

// DELETE supprime un utilisateur
router.delete("/utilisateur/delete/:id", admin_utilisateurMiddleware.validateIdParams, admin_utilisateurController.deleteUtilisateurById);

module.exports = router;
