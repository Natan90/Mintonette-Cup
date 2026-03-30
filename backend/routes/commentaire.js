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

module.exports = router;
