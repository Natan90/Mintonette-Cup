const express = require("express");
const cors = require("cors");
const router = express.Router();

const pool = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const paysRoutes = require("./routes/equipes/equipes");
const utilisateursRoutes = require("./routes/utilisateurs");

const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/utilisateur", authRoutes);
app.use("/pays", paysRoutes);

// Swagger
const swaggerSpec = require("./swagger");
const { default: axios } = require("axios");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


router.post("/", async (req, res) => {
  try {
    const { contenu, utilisateur_id } = req.body;

    if (!contenu || !utilisateur_id) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    console.log("Données reçues :", { contenu, utilisateur_id });


    res.json({
      message: "Article reçu avec succès !",
      contenu,
      utilisateur_id,
    });
  } catch (err) {
    console.error("Erreur lors de la sauvegarde :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
