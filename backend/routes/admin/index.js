const express = require("express");
const router = express.Router();

const utilisateurRoutes = require("./utilisateur");
const prestataireRoutes = require("./prestataire");
const evenementRoutes = require("./evenement");

/**
 * @swagger
 * tags:
 *   name: Administrateur
 *   description: Gestion de l'évènement, des utilisateurs et des prestataires (lecture & suppression)
 */


router.use("/utilisateur", utilisateurRoutes);
router.use("/prestataire", prestataireRoutes);
router.use("/evenement", evenementRoutes);

module.exports = router;
