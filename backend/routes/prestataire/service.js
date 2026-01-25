const express = require("express");
const router = express.Router();
const pool = require("../../database/db");

router.get("/show", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM Services`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

router.get("/show/:id", async (req, res) => {
  const id_service = req.params.id;

  try {
    const result = await pool.query(
      `SELECT * FROM Services
        WHERE id_service = $1`,
      [id_service]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Service non trouvé" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/activate/:id", async (req, res) => {
  const { id_service } = req.params.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE Services
        SET activate = NOT activate
        WHERE id_service = $1
        RETURNING prestataire_id;
        `,
      [id_service]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Service modifié avec succès",
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Erreur modification service : ", err);
    res.status(500).json({
      error: "Erreur serveur",
    });
  } finally {
    client.release();
  }
});

module.exports = router;