const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const utilisateursRoutes = require('./routes/utilisateurs');
console.log(utilisateursRoutes);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database', 'mintonette_cup.sqlite');
console.log("Chemin de la DB :", dbPath);

// Ouvre la base de données
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("❌ Impossible d'ouvrir la DB :", err.message);
  } else {
    console.log("✅ Base de données ouverte avec succès !");
  }
});

// Middleware pour rendre la DB dispo dans toutes les routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/', utilisateursRoutes);

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${port}`);

  // 🔹 Vérification des routes
  if (app._router) {
    const routes = app._router.stack
      .filter(r => r.route)          // garde seulement les routes montées
      .map(r => r.route.path);       // récupère le chemin
    console.log("✅ Routes chargées :", routes);
  } else {
    console.log("⚠️ _router non défini, aucune route à afficher");
  }
});

