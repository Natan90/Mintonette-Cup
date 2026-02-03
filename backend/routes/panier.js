const express = require("express");
const router = express.Router();
const panierController = require("../controllers/panier.controller");
const panierMiddleware = require("../middlewares/panier.middleware");
const authSessionMiddleware = require("../middlewares/authSession.middleware");

// GET panier par utilisateur
router.get("/show/:id", panierController.getPanier);

// POST ajouter au panier (siège ou service)
router.post(
  "/add/:id",
  authSessionMiddleware,
  panierMiddleware.validateAdd,
  panierController.addPanier,
);

// DELETE retirer du panier (siège ou service)
router.delete(
  "/delete/:id",
  authSessionMiddleware,
  panierMiddleware.validateRemove,
  panierController.deletePanier,
);

// DELETE vider complètement le panier
router.delete("/clear/:id", authSessionMiddleware, panierController.clearPanier);

// POST payer son panier
router.post(
  "/pay/:id",
  authSessionMiddleware,
  panierMiddleware.validatePay,
  panierController.payPanier,
);

// GET billets après achats
router.get(
  "/billets/show/:id",
  authSessionMiddleware,
  panierMiddleware.valideBillets,
  panierController.getBillets,
);

module.exports = router;
