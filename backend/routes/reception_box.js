const express = require("express");
const router = express.Router();
const reception_boxController = require("../controllers/reception_box.controller");
const reception_boxMiddleware = require("../middlewares/reception_box.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/message/received/:id", authMiddleware.authenticateToken, reception_boxMiddleware.validateGetMessageById, reception_boxController.getMessagesById);


module.exports = router;