const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail.controller");
const mailMiddleware = require("../middlewares/mail.middleware");

// POST reset le password
router.post("/password/reset", mailMiddleware.valideResetPassword, mailController.resetPassword);

// POST valider le reset du password
router.post("/password/confirm", mailMiddleware.valideConfirmPassword, mailController.confirmResetPassword);

module.exports = router;
