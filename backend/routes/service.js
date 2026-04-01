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

// GET activite par id_service
router.get("/:id/activite/show", serviceMiddleware.validateId, serviceController.getActiviteByIdService);

// GET article par id_service
router.get("/:id/article/show", serviceMiddleware.validateId, serviceController.getArticleByIdService);

// GET article par id_article
router.get("/article/:id_article/show", serviceMiddleware.validateArticleById, serviceController.getArticleByIdArticle);

// GET activite par id_activite
router.get("/activite/:id_activite/show", serviceMiddleware.validateActiviteById, serviceController.getActiviteByIdActivite);

// PATCH activer / désactiver le service
router.patch("/:id/activate", authMiddleware.authenticateToken, serviceMiddleware.validateId, serviceController.activateServiceById);

// POST créer un service
router.post("/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddService , serviceController.addServiceById);

// POST ajouter une activité
router.post("/activites/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddActiviteByIdService, serviceController.addActiviteByIdService);

// POST ajouter un article
router.post("/articles/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddArticleByIdService, serviceController.addArticleByIdService);

// PUT modifier une activité
router.put("/activite/:id/edit", authMiddleware.authenticateToken, serviceMiddleware.validateAddActiviteByIdService, serviceController.editActiviteById);

// PUT modifier un article
router.put("/article/:id/edit", authMiddleware.authenticateToken, serviceMiddleware.validateAddArticleByIdService, serviceController.editArticleById);

// DELETE supprimer un service
router.delete("/:id/delete", authMiddleware.authenticateToken, serviceMiddleware.validateId , serviceController.deleteServiceById);

// DELETE supprimer un article
router.delete("/article/:id/delete", authMiddleware.authenticateToken, serviceMiddleware.validateId , serviceController.deleteArticleById);

// DELETE supprimer une activite
router.delete("/activite/:id/delete", authMiddleware.authenticateToken, serviceMiddleware.validateId , serviceController.deleteActiviteById);


module.exports = router;
