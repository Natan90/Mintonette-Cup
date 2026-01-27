const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const serviceMiddleware = require("../middlewares/service.middleware");

// GET services
router.get("/show", serviceController.getServices);

// GET service par id
router.get("/show/:id", serviceController.getServiceById);

// PATCH activer / désactiver le service
router.patch("/activate/:id", serviceMiddleware.validateActivateService, serviceController.activateServiceById);

module.exports = router;
