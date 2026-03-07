const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const serviceMiddleware = require("../middlewares/service.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET services
router.get("/show", serviceController.getServices);

// GET service par id
router.get("/show/:id", serviceController.getServiceById);

// PATCH activer / désactiver le service
router.patch("/activate/:id", serviceMiddleware.validateActivateService, serviceController.activateServiceById);

// POST créer un service
router.post("/add/:id", authMiddleware.authenticateToken, serviceMiddleware.validateAddService , serviceController.addServiceById);

// POST ajouter une activité
router.post("/:id/activites/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddActiviteByIdService, serviceController.addActiviteByIdService);

// POST ajouter un article
router.post("/:id/articles/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddArticleByIdService, serviceController.addArticleByIdService);

module.exports = router;
