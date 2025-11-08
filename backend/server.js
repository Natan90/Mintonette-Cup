const express = require("express");
const cors = require("cors");

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
const swaggerSpec = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
