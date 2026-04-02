const express = require("express");
const router = express.Router();
const panierController = require("../controllers/panier.controller");
const panierMiddleware = require("../middlewares/panier.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET panier par utilisateur
/**
 * @swagger
 * /show/{id}:
 *   get:
 *     summary: Récupère le panier actif d’un utilisateur
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contenu du panier
 */
router.get(
  "/show/:id",
  authMiddleware.authenticateToken,
  panierController.getPanier,
);

// POST ajouter au panier (siège ou service)
/**
 * @swagger
 * /add/{id}:
 *   post:
 *     summary: Ajouter un siège ou un service au panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matchId:
 *                 type: integer
 *               numero_colonne:
 *                 type: integer
 *               numero_ligne:
 *                 type: integer
 *               zone:
 *                 type: string
 *               service_id:
 *                 type: integer
 *               quantite:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ajouté au panier
 */
router.post(
  "/add/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.validateAdd,
  panierController.addPanier,
);

// DELETE retirer du panier (siège ou service)
/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Retirer un siège ou service du panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supprimé du panier
 */
router.delete(
  "/delete/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.validateRemove,
  panierController.deletePanier,
);

// DELETE vider complètement le panier
/**
 * @swagger
 * /clear/{id}:
 *   delete:
 *     summary: Vider complètement le panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panier vidé
 */
router.delete(
  "/clear/:id",
  authMiddleware.authenticateToken,
  panierController.clearPanier,
);

// POST payer son panier
/**
 * @swagger
 * /pay/{id}:
 *   post:
 *     summary: Payer le panier et créer une commande
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sieges:
 *                 type: array
 *               services:
 *                 type: array
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Paiement validé
 *       400:
 *         description: Erreur de paiement
 */
router.post(
  "/pay/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.validatePay,
  panierController.payPanier,
);

// GET billets après achats
/**
 * @swagger
 * /billets/show/{id}:
 *   get:
 *     summary: Récupère les billets achetés par utilisateur
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des billets
 */
router.get(
  "/billets/show/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.valideBillets,
  panierController.getBillets,
);

// DELETE supprimer un billet acheté
/**
 * @swagger
 * /billets/remove/{id}:
 *   delete:
 *     summary: Supprimer un billet acheté
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               match_id:
 *                 type: integer
 *               numero_colonne:
 *                 type: integer
 *               numero_ligne:
 *                 type: integer
 *               zone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Billet supprimé
 */
router.delete(
  "/billets/remove/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.validateDeleteBillet,
  panierController.deleteBillet,
);

module.exports = router;
