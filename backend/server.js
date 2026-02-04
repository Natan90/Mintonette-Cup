const express = require("express");
const cors = require("cors");
const session = require("express-session");
const FileStore = require('session-file-store')(session);

const authRoutes = require("./routes/utilisateur");
// const paysRoutes = require("./routes/equipes/equipes");
const prestataireRoutes = require("./routes/prestataire");
const type_prestataireRoutes = require("./routes/type_prestataire");
const serviceRoute = require("./routes/service");
const gradins = require("./routes/gradin");
const adminRoutes = require("./routes/admin");
const equipesRoutes = require("./routes/equipe");
const panierRoutes = require("./routes/panier");
const mailRoutes = require("./routes/mail");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(session({
  store: new FileStore({ 
    path: process.env.PATH_FILE_STORE,
    ttl: 3600,
    retries: 0
  }),
  name: "userSession",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600000 //1h
  }
}))


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
app.use("/mail", mailRoutes);


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
