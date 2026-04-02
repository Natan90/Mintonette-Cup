const express = require("express");
const router = express.Router();
const reception_boxController = require("../controllers/reception_box.controller");
const reception_boxMiddleware = require("../middlewares/reception_box.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /message/{id}/select:
 *   get:
 *     summary: Récupère un message détaillé
 *     tags: [Mailbox]
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
 *         description: Détail du message
 *       404:
 *         description: Message non trouvé
 */
router.get(
  "/message/:id/select",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateGetMessageByIdMessage,
  reception_boxController.getMessagesByIdMessage,
);

/**
 * @swagger
 * /message/{id}/received:
 *   get:
 *     summary: Récupère la boîte mail complète (reçus + envoyés + non lus)
 *     tags: [Mailbox]
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
 *         description: Messages utilisateur
 */
router.get(
  "/message/:id/received",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateGetMessageById,
  reception_boxController.getMessagesById,
);

/**
 * @swagger
 * /message/{id}/read:
 *   post:
 *     summary: Marquer un message comme lu
 *     tags: [Mailbox]
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
 *         description: Message marqué comme lu
 */
router.post(
  "/message/:id/read",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateUpdateMessageById,
  reception_boxController.updateMessageById,
);

/**
 * @swagger
 * /message/{id}/delete:
 *   post:
 *     summary: Supprimer un message (soft delete côté sender/recipient)
 *     tags: [Mailbox]
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
 *         description: Message supprimé
 */
router.post(
  "/message/:id/delete",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateUpdateMessageById,
  reception_boxController.deleteMessageById,
);

/**
 * @swagger
 * /message/{id}/send:
 *   post:
 *     summary: Envoyer un message à un utilisateur
 *     tags: [Mailbox]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user_to:
 *                 type: integer
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               id_type_message:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Message envoyé
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/message/:id/send",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateSendMessageTo,
  reception_boxController.sendMessageTo,
);

module.exports = router;
