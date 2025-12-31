const express = require("express");
const router = express.Router();
const pool = require("../../database/db");


router.get("/show", async (req, res) => {
    try {
    const result = await pool.query(`
      SELECT * FROM Evenement 
      `
    );
    res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put("/update", async (req, res) => {
  const { title, descri_fr, descri_en, color, font, image } = req.body;

  const client = await pool.connect();

  try {
    const descriJson = {
      fr: { texte: descri_fr },
      en: { texte: descri_en }
    };

    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE Evenement
        SET 
            nom_evenement = $1,
            color_title = $2,
            text_font = $3,
            image_evenement = $4,
            descri_evenement = $5
        WHERE id_evenement = 1;
        `,
      [title, color, font, image, descriJson]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Évènement modifié avec succès",
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Erreur modification évènement : ", err);
    res.status(500).json({
      error: "Erreur serveur",
    });
  } finally {
    client.release();
  }
});


module.exports = router;