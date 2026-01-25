const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/utilisateurs/authRoutes");
// const paysRoutes = require("./routes/equipes/equipes");
const prestataireRoutes = require("./routes/prestataire/prestataire");
const type_prestataireRoutes = require("./routes/type_prestataire");
const serviceRoute = require("./routes/service");
const gradins = require("./routes/gradins/gradin");
const adminRoutes = require("./routes/admin/index");
const equipesRoutes = require("./routes/equipes/equipes");
const panierRoutes = require("./routes/panier");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRoutes);
app.use("/utilisateur/auth", authRoutes);
// app.use("/pays", paysRoutes);
app.use("/prestataire", prestataireRoutes);
app.use("/prestataire/type_prestataire", type_prestataireRoutes);
app.use("/prestataire/service", serviceRoute);
app.use("/gradin", gradins);
app.use("/equipes", equipesRoutes);
app.use("/panier", panierRoutes);


// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      tagsSorter: "alpha",
    },
  })
);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
