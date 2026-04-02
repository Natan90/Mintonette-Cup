const express = require("express");
const router = express.Router();
const type_prestataireController = require("../controllers/type_prestataire.controller");
const type_prestataireMiddleware = require("../middlewares/type_prestataire.middleware");

// GET type prestataire
/**
 * @swagger
 * /show:
 *   get:
 *     summary: Récupère tous les types de prestataires et catégories associées
 *     tags: [TypePrestataire]
 *     responses:
 *       200:
 *         description: Liste des types de prestataires, statistiques et catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   description: Liste des types de prestataires
 *                   items:
 *                     type: object
 *                 count:
 *                   type: array
 *                   description: Nombre de prestataires par type
 *                   items:
 *                     type: object
 *                     properties:
 *                       nom_type_prestataire:
 *                         type: string
 *                       nb_prestataires:
 *                         type: integer
 *                 animations:
 *                   type: array
 *                   description: Types d’animations
 *                   items:
 *                     type: object
 *                 restaurations:
 *                   type: array
 *                   description: Types de restaurations
 *                   items:
 *                     type: object
 *                 boutiques:
 *                   type: array
 *                   description: Types de boutiques
 *                   items:
 *                     type: object
 */
router.get("/show", type_prestataireController.getTypePrestataire);

module.exports = router;
