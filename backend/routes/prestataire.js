const express = require("express");
const router = express.Router();
const prestataireController = require("../controllers/prestataire.controller");
const prestataireMiddleware = require("../middlewares/prestataire.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET prestataire
/**
 * @swagger
 * /show:
 *   get:
 *     summary: Récupère tous les prestataires
 *     tags: [Prestataire]
 *     responses:
 *       200:
 *         description: Liste des prestataires
 */
router.get("/show", prestataireController.getPrestataire);

// GET prestataire par id_presta
/**
 * @swagger
 * /show/{id_presta}:
 *   get:
 *     summary: Récupère un prestataire par son id prestataire
 *     tags: [Prestataire]
 *     parameters:
 *       - in: path
 *         name: id_presta
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestataire trouvé
 *       404:
 *         description: Prestataire non trouvé
 */
router.get("/show/:id_presta", prestataireMiddleware.validatePrestataireByIdPrestataire, prestataireController.getPrestataireByIdPrestataire);

// GET prestataire par id_user
/**
 * @swagger
 * /show/{id_user}:
 *   get:
 *     summary: Récupère un prestataire par id utilisateur
 *     tags: [Prestataire]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestataire trouvé
 *       404:
 *         description: Prestataire non trouvé
 */
router.get("/show/:id_user", prestataireMiddleware.validatePrestataireByIdUtilisateur, prestataireController.getPrestataireByIdUtilisateur);

// POST devenir prestataire
/**
 * @swagger
 * /becomePrestataire/{id}:
 *   post:
 *     summary: Devenir prestataire
 *     tags: [Prestataire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               descri:
 *                 type: string
 *               mail:
 *                 type: string
 *               tel:
 *                 type: string
 *               specificite:
 *                 type: object
 *               type:
 *                 type: integer
 *               services:
 *                 type: array
 *     responses:
 *       200:
 *         description: Demande envoyée
 *       409:
 *         description: Déjà prestataire ou en attente
 */
router.post("/becomePrestataire/:id", authMiddleware.authenticateToken, prestataireMiddleware.validateBecomePresta, prestataireController.becomePrestataire);

// POST mettre à jour prestataire
/**
 * @swagger
 * /updatePrestataire/{id}:
 *   post:
 *     summary: Mise à jour d’un prestataire
 *     tags: [Prestataire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               descri:
 *                 type: string
 *               mail:
 *                 type: string
 *               tel:
 *                 type: string
 *               specificite:
 *                 type: object
 *               type:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Prestataire mis à jour
 *       409:
 *         description: Utilisateur non prestataire
 */
router.post("/updatePrestataire/:id", authMiddleware.authenticateToken, prestataireMiddleware.validateUpdatePresta, prestataireController.updatePrestataire);

module.exports = router;
