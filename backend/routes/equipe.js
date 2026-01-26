const express = require("express");
const router = express.Router();
const equipeController = require("../controllers/equipe.controller");
const equipeMiddleware = require("../middlewares/equipe.middleware");

// GET pays 
router.get("/showPays", equipeController.showPays);

// GET player
router.get("/showPlayer", equipeController.showPlayers);

// GET player
router.get("/showMatch", equipeController.showMatches);

// GET match by id_terrain
router.get("/showMatchByTerrain/:id", equipeController.showMatchByTerrain);

module.exports = router;
