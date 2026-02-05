const express = require("express");
const router = express.Router();
const panierController = require("../controllers/panier.controller");
const panierMiddleware = require("../middlewares/panier.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET panier par utilisateur
router.get("/show/:id", authMiddleware.authenticateToken, panierController.getPanier);

// POST ajouter au panier (siège ou service)
router.post(
  "/add/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.validateAdd,
  panierController.addPanier,
);

// DELETE retirer du panier (siège ou service)
router.delete(
  "/delete/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.validateRemove,
  panierController.deletePanier,
);

// DELETE vider complètement le panier
router.delete("/clear/:id", authMiddleware.authenticateToken, panierController.clearPanier);

// POST payer son panier
router.post(
  "/pay/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.validatePay,
  panierController.payPanier,
);

// GET billets après achats
router.get(
  "/billets/show/:id",
  authMiddleware.authenticateToken,
  panierMiddleware.valideBillets,
  panierController.getBillets,
);

module.exports = router;
