const pool = require("../database/db");

async function getGradinByMatchId(id_match) {
    const result = await pool.query(
      "SELECT * FROM Siege WHERE match_id = $1 ORDER BY numero_colonne, numero_ligne",
      [id_match]
    );

    return result.rows;
};

async function updateGradin(gradin) {
    const { est_reserve, numero_colonne, numero_ligne, zone, matchId, id_utilisateur, } = gradin;

    const result = await pool.query(
      `
      UPDATE Siege
      SET 
        est_reserve = $1,
        id_utilisateur = COALESCE($6, id_utilisateur)
      WHERE match_id = $5
        AND numero_colonne = $2
        AND numero_ligne = $3
        AND zone = $4
      RETURNING *
      `,
      [
        est_reserve,
        numero_colonne,
        numero_ligne,
        zone,
        matchId,
        id_utilisateur,
      ]
    );

    return result.rows[0];
}


module.exports = {
    getGradinByMatchId,
    updateGradin,
}