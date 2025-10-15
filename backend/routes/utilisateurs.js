const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/utilisateurs', (req, res) => {
  db.all('SELECT * FROM Utilisateur', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;