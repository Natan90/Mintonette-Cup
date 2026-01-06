const express = require("express");
const cors = require("cors");
const router = express.Router();

const pool = require("./database/db");
const authRoutes = require("./routes/utilisateurs/authRoutes");
// const paysRoutes = require("./routes/equipes/equipes");
const prestataireRoutes = require("./routes/prestataire/prestataire");
const gradins = require("./routes/gradins/gradin");
const adminRoutes = require("./routes/admin/index");
const { isAdmin } = require("./middleware/roleCheck");
const equipesRoutes = require("./routes/equipes/equipes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    // Allow requests from any localhost origin (different dev ports)
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, server-to-server)
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch (err) {
        // if origin is not a valid URL, reject
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Protect admin routes with role check middleware
app.use("/admin", isAdmin, adminRoutes);
app.use("/utilisateur/auth", authRoutes);
// app.use("/pays", paysRoutes);
app.use("/prestataire", prestataireRoutes);
app.use("/gradin", gradins);
app.use("/equipes", equipesRoutes);


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
