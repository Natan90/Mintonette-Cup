const express = require('express');
const cors = require('cors');
const utilisateursRoutes = require('./routes/utilisateurs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connexion à la base
const dbPath = path.join(__dirname, 'database', 'mintonette_cup.sqlite');
const db = new sqlite3.Database(dbPath);

// Middleware pour rendre db accessible
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/', utilisateursRoutes);

app.listen(port, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${port}`);
});
