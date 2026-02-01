const express = require("express");
const router = express.Router();
const panierController = require("../controllers/panier.controller");
const panierMiddleware = require("../middlewares/panier.middleware");

// GET panier par utilisateur
router.get("/show/:id", panierController.getPanier);

// POST ajouter au panier (siège ou service)
router.post(
  "/add/:id",
  panierMiddleware.validateAdd,
  panierController.addPanier,
);

// DELETE retirer du panier (siège ou service)
router.delete(
  "/delete/:id",
  panierMiddleware.validateRemove,
  panierController.deletePanier,
);

// DELETE vider complètement le panier
router.delete("/clear/:id", panierController.clearPanier);

// POST payer son panier
router.post(
  "/pay/:id",
  panierMiddleware.validatePay,
  panierController.payPanier,
);

router.get(
  "/billets/show/:id",
  panierMiddleware.valideBillets,
  panierController.getBillets,
);

module.exports = router;
