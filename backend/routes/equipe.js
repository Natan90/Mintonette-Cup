const express = require("express");
const router = express.Router();
const equipeController = require("../controllers/equipe.controller");
const equipeMiddleware = require("../middlewares/equipe.middleware");

// GET pays 
/**
 * @swagger
 * /showPays:
 *   get:
 *     summary: Récupère la liste des pays
 *     tags: [Equipe]
 *     responses:
 *       200:
 *         description: Liste des pays
 */
router.get("/showPays", equipeController.showPays);

// GET player
/**
 * @swagger
 * /showPlayer:
 *   get:
 *     summary: Récupère la liste des joueurs
 *     tags: [Equipe]
 *     responses:
 *       200:
 *         description: Liste des joueurs
 */
router.get("/showPlayer", equipeController.showPlayers);

// GET player
/**
 * @swagger
 * /showMatch:
 *   get:
 *     summary: Récupère la liste des matchs
 *     tags: [Match]
 *     responses:
 *       200:
 *         description: Liste des matchs
 */
router.get("/showMatch", equipeController.showMatches);

// GET match by id_terrain
/**
 * @swagger
 * /showMatchByTerrain/{id}:
 *   get:
 *     summary: Matchs par terrain
 *     tags: [Match]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des matchs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_match:
 *                     type: integer
 *                   date_match:
 *                     type: string
 *                   score_equipe1:
 *                     type: integer
 *                   score_equipe2:
 *                     type: integer
 *                   team1_country:
 *                     type: string
 *                   team2_country:
 *                     type: string
 */
router.get("/showMatchByTerrain/:id", equipeController.showMatchByTerrain);

module.exports = router;
