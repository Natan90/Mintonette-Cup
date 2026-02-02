const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail.controller");
const mailMiddleware = require("../middlewares/mail.middleware");

// POST reset le password
router.post("/password/reset", mailMiddleware.valideResetPassword, mailController.resetPassword);


module.exports = router;
