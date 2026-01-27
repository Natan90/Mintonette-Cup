const pool = require("../database/db");

async function getEvenement() {
    const result = await pool.query(`
      SELECT * FROM Evenement 
      `
    );
    return result.rows[0];
}

async function updateEvenement(evenement) {
    const { title, descri_fr, descri_en, color, font, image } = evenement;
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
        WHERE id_evenement = 1
        RETURNING *;
        `,
      [title, color, font, image, descriJson]
    );

    await client.query("COMMIT");

    return {
        result: result.rows[0],
        message: "Évènement modifié avec succès"
    }
  } catch (err) {
    await client.query("ROLLBACK");
    throw { status: 500, message: "Erreur serveur" };

  } finally {
    client.release();
  }
}

module.exports = {
    getEvenement, 
    updateEvenement
}