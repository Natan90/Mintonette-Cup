const pool = require("../database/db");

async function getPays() {
    const result = await pool.query("SELECT * FROM Pays ORDER BY id_pays");
    return result.rows;
};

async function getPlayer() {
    const result = await pool.query(
      "SELECT * FROM Joueur ORDER BY id_equipe, poste, numero_joueur"
    );
    return result.rows;
};

async function getMatch() {
    const result = await pool.query("SELECT * FROM Match ORDER BY id_terrain ");
    return result.rows;
};

async function getMatchById(id_terrain) {
    const result = await pool.query(
      `
      SELECT 
        m.id_match,
        m.date_match,
        m.score_equipe1,
        m.score_equipe2,
        m.date_match,
        e1.id_equipe AS team1_id,
        p1.nom_pays AS team1_country,
        e1.entraineur AS team1_coach,

        e2.id_equipe AS team2_id,
        p2.nom_pays AS team2_country,
        e2.entraineur AS team2_coach

      FROM Match m
      JOIN Equipe e1 ON m.id_equipe1 = e1.id_equipe
      JOIN Pays p1 ON e1.id_pays = p1.id_pays
      JOIN Equipe e2 ON m.id_equipe2 = e2.id_equipe
      JOIN Pays p2 ON e2.id_pays = p2.id_pays

      WHERE m.id_terrain = $1
      ORDER BY m.date_match
    `,
      [id_terrain]
    );

    return result.rows;
};


module.exports = {
    getPays,
    getPlayer,
    getMatch,
    getMatchById
}