const express = require("express");
const router = express.Router();
const panierController = require("../controllers/panier.controller");
const panierMiddleware = require("../middlewares/panier.middleware");

// GET panier par utilisateur
router.get("/show/:id", panierController.getPanier);

// POST ajouter au panier (siège ou service)
router.post("/add", panierMiddleware.validateAdd, panierController.addPanier);

// DELETE retirer du panier (siège ou service)
router.delete("/delete", panierMiddleware.validateRemove, panierController.deletePanier);

module.exports = router;
