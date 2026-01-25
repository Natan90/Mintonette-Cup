const express = require("express");
const router = express.Router();
const type_prestataireController = require("../controllers/type_prestataire.controller");
const type_prestataireMiddleware = require("../middlewares/type_prestataire.middleware");

// GET type prestataire
router.get("/show", type_prestataireController.getTypePrestataire);

module.exports = router;
