const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const serviceMiddleware = require("../middlewares/service.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET services
router.get("/show", serviceController.getServices);

// GET service par id_prestataire
router.get("/show/prestataire/:id_presta", serviceMiddleware.validateServiceByIdPrestataire, serviceController.getServiceByIdPrestataire);

// GET service par id_service
router.get("/show/service/:id_service", serviceMiddleware.validateServiceByIdService, serviceController.getServiceByIdService);

// PATCH activer / désactiver le service
router.patch("/:id/activate", serviceMiddleware.validateActivateService, serviceController.activateServiceById);

// POST créer un service
router.post("/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddService , serviceController.addServiceById);

// DELETE supprimer un service
router.delete("/:id/delete", authMiddleware.authenticateToken, serviceMiddleware.validateDeleteService , serviceController.deleteServiceById);

// POST ajouter une activité
router.post("/activites/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddActiviteByIdService, serviceController.addActiviteByIdService);

// POST ajouter un article
router.post("/articles/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddArticleByIdService, serviceController.addArticleByIdService);

module.exports = router;
