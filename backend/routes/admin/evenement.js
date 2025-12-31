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
  const id_user = req.params.id;
  const { nom, descri, nb_participants, tarif, mail, tel, specificite, type } =
    req.body;
  if (!nom || !descri || !tarif || !mail || !tel || !specificite || !type || !id_user)
    return res.status(400).json({
      error: "Champs obligatoires manquants",
    });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifier si le mail existe déjà
    const checkPresta = await client.query(
      "SELECT id_prestataire FROM Prestataire WHERE id_utilisateur = $1",
      [id_user]
    );

    if (checkPresta.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "Vous n'êtes pas un prestataire",
      });
    }

    const result = await client.query(
      `UPDATE Prestataire
        SET 
            nom_prestataire = $1,
            descri_prestataire = $2,
            nb_participants = $3,
            tarif_prestataire = $4,
            mail_prestataire = $5,
            tel_prestataire = $6,
            waitingForAdmin = true,
            specificite = $7,
            type_prestataire_id = $8
        WHERE id_utilisateur = $9
        RETURNING id_prestataire;
        `,
      [nom, descri, nb_participants, tarif, mail, tel, specificite, type, id_user]
    );

    const newPresta = result.rows[0];

    await client.query("COMMIT");

    res.status(201).json({
      message: "Prestataire modifié avec succès",
      user: {
        id: newPresta.id_utilisateur,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Erreur modification prestataire : ", err);
    res.status(500).json({
      error: "Erreur serveur",
    });
  } finally {
    client.release();
  }
});


module.exports = router;