const express = require("express");
const router = express.Router();



router.get("/show", (req, res) => {
  const db = req.db;
  db.all("SELECT * FROM Utilisateur", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

