const express = require("express");
const router = express.Router();
const commentaireController = require("../controllers/commentaire.controller");
const commentaireMiddleware = require("../middlewares/commentaire.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/showCommentaire", commentaireController.showCommentaire);
router.post(
  "/addCommentaire",
  authMiddleware.authenticateToken,
  commentaireMiddleware.validateCommentaire,
  commentaireController.addCommentaire,
);

router.patch(
  "/updateCommentaire/:id",
  authMiddleware.authenticateToken,
  commentaireMiddleware.validateCommentaire,
  commentaireController.updateCommentaire,
);

router.patch(
  "/replyCommentaire/:id",
  authMiddleware.authenticateToken,
  commentaireController.replyCommentaire,
);

router.delete(
  "/deleteCommentaire/:id",
  authMiddleware.authenticateToken,
  commentaireController.deleteCommentaire,
);

module.exports = router;
