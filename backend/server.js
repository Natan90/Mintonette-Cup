const express = require("express");
const cors = require("cors");
const router = express.Router();

const pool = require("./database/db");
const authRoutes = require("./routes/utilisateurs/authRoutes");
const paysRoutes = require("./routes/equipes/equipes");
const prestataireRoutes = require("./routes/prestataire/prestataire");
// const utilisateursRoutes = require("./routes/utilisateurs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/utilisateur", authRoutes);
app.use("/pays", paysRoutes);
app.use("/prestataire", prestataireRoutes);

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// router.post("/", async (req, res) => {
//   try {
//     const { contenu, utilisateur_id } = req.body;

//     if (!contenu || !utilisateur_id) {
//       return res.status(400).json({ message: "Champs manquants" });
//     }

//     console.log("Données reçues :", { contenu, utilisateur_id });

//     res.json({
//       message: "Article reçu avec succès !",
//       contenu,
//       utilisateur_id,
//     });
//   } catch (err) {
//     console.error("Erreur lors de la sauvegarde :", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// });

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

// module.exports = router;
