const express = require("express");
const router = express.Router();
const gradinController = require("../controllers/gradin.controller");
const gradinMiddleware = require("../middlewares/gradin.middleware");

// GET gradin par id_match
/**
 * @swagger
 * /show/{id}:
 *   get:
 *     summary: Récupère les sièges (gradins) d'un match
 *     tags: [Gradin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     responses:
 *       200:
 *         description: Liste des sièges du match
 *       404:
 *         description: Match non trouvé
 */
router.get("/show/:id", gradinMiddleware.validateGetGradinByMatchId, gradinController.getGradin);

// PUT modifier les gradins
/**
 * @swagger
 * /update:
 *   put:
 *     summary: Met à jour un siège (réservation ou libération)
 *     tags: [Gradin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               est_reserve:
 *                 type: boolean
 *               numero_colonne:
 *                 type: integer
 *               numero_ligne:
 *                 type: integer
 *               zone:
 *                 type: string
 *               matchId:
 *                 type: integer
 *               id_utilisateur:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Siège mis à jour
 *       400:
 *         description: Données invalides
 */
router.put("/update", gradinMiddleware.validateUpdateGradin, gradinController.updateGradin);

module.exports = router;
