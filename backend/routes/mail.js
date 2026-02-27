const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail.controller");
const mailMiddleware = require("../middlewares/mail.middleware");

// POST reset le password
router.post("/password/reset", mailMiddleware.valideResetPassword, mailController.resetPassword);

// POST valider le reset du password
router.post("/password/confirm", mailMiddleware.valideConfirmPassword, mailController.confirmResetPassword);

// POST envoyer le QRCode du billet / activité
router.post("/billets/send/:id", mailMiddleware.validebilletsQR, mailController.billetsQR);

module.exports = router;
