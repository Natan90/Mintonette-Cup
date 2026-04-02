const express = require("express");
const router = express.Router();
const commentaireController = require("../controllers/commentaire.controller");
const commentaireMiddleware = require("../middlewares/commentaire.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /showCommentaire:
 *   get:
 *     summary: Récupère tous les commentaires
 *     tags: [Commentaire]
 *     responses:
 *       200:
 *         description: Liste des commentaires
 */
router.get("/showCommentaire", commentaireController.showCommentaire);

/**
 * @swagger
 * /addCommentaire:
 *   post:
 *     summary: Ajouter un commentaire
 *     tags: [Commentaire]
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
 *               prenom:
 *                 type: string
 *               titre:
 *                 type: string
 *               texte:
 *                 type: string
 *               note:
 *                 type: number
 *     responses:
 *       200:
 *         description: Commentaire ajouté
 *       401:
 *         description: Non authentifié
 */
router.post(
  "/addCommentaire",
  authMiddleware.authenticateToken,
  commentaireMiddleware.validateCommentaire,
  commentaireController.addCommentaire,
);

/**
 * @swagger
 * /updateCommentaire/{id}:
 *   patch:
 *     summary: Modifier un commentaire (propriétaire uniquement)
 *     tags: [Commentaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               titre:
 *                 type: string
 *               texte:
 *                 type: string
 *               note:
 *                 type: number
 *     responses:
 *       200:
 *         description: Commentaire modifié
 *       403:
 *         description: Interdit (pas propriétaire)
 */
router.patch(
  "/updateCommentaire/:id",
  authMiddleware.authenticateToken,
  commentaireMiddleware.validateCommentaire,
  commentaireController.updateCommentaire,
);

/**
 * @swagger
 * /replyCommentaire/{id}:
 *   patch:
 *     summary: Répondre à un commentaire
 *     tags: [Commentaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reponse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réponse ajoutée
 *       404:
 *         description: Commentaire non trouvé
 */
router.patch(
  "/replyCommentaire/:id",
  authMiddleware.authenticateToken,
  commentaireController.replyCommentaire,
);

/**
 * @swagger
 * /deleteCommentaire/{id}:
 *   delete:
 *     summary: Supprimer un commentaire (admin ou propriétaire)
 *     tags: [Commentaire]
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
 *         description: Commentaire supprimé
 *       403:
 *         description: Interdit
 *       404:
 *         description: Commentaire non trouvé
 */
router.delete(
  "/deleteCommentaire/:id",
  authMiddleware.authenticateToken,
  commentaireController.deleteCommentaire,
);

module.exports = router;
