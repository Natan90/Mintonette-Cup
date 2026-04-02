const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail.controller");
const mailMiddleware = require("../middlewares/mail.middleware");

// POST reset le password
/**
 * @swagger
 * /password/reset:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *                 example: user@mail.com
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       400:
 *         description: Email invalide
 */
router.post("/password/reset", mailMiddleware.valideResetPassword, mailController.resetPassword);

// POST valider le reset du password
/**
 * @swagger
 * /password/confirm:
 *   post:
 *     summary: Confirmation de réinitialisation du mot de passe
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *       400:
 *         description: Token invalide ou expiré
 */
router.post("/password/confirm", mailMiddleware.valideConfirmPassword, mailController.confirmResetPassword);

// POST envoyer le QRCode du billet / activité
/**
 * @swagger
 * /billets/send/{id}:
 *   post:
 *     summary: Envoie un billet avec QR code par email
 *     tags: [Mail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du billet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               activity:
 *                 type: string
 *               sieges:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     zone:
 *                       type: string
 *                     numero_colonne:
 *                       type: integer
 *                     numero_ligne:
 *                       type: integer
 *                     prix:
 *                       type: number
 *     responses:
 *       200:
 *         description: Email envoyé avec QR code
 *       400:
 *         description: Données invalides
 */
router.post("/billets/send/:id", mailMiddleware.validebilletsQR, mailController.billetsQR);

module.exports = router;
