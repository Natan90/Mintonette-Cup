const express = require("express");
const router = express.Router();
const reception_boxController = require("../controllers/reception_box.controller");
const reception_boxMiddleware = require("../middlewares/reception_box.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/message/:id/select",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateGetMessageByIdMessage,
  reception_boxController.getMessagesByIdMessage,
);

router.get(
  "/message/:id/received",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateGetMessageById,
  reception_boxController.getMessagesById,
);

router.post(
  "/message/:id/read",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateUpdateMessageById,
  reception_boxController.updateMessageById,
);

router.post(
  "/message/:id/delete",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateUpdateMessageById,
  reception_boxController.deleteMessageById,
);

router.post(
  "/message/:id/send",
  authMiddleware.authenticateToken,
  reception_boxMiddleware.validateSendMessageTo,
  reception_boxController.sendMessageTo,
);

module.exports = router;
