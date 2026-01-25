const express = require("express");
const router = express.Router();
const gradinController = require("../controllers/gradin.controller");
const gradinMiddleware = require("../middlewares/gradin.middleware");

// GET gradin par id_match
router.get("/show/:id_gradin", gradinMiddleware.validateGetGradinByMatchId, gradinController.getGradin);

// PUT modifier les gradins
router.put("/update", gradinMiddleware.validateUpdateGradin, gradinController.updateGradin);

module.exports = router;
