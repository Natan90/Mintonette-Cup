const pool = require("../database/db");

async function getTypePrestataire() {
  const result = (await pool.query(
    "SELECT * FROM Type_prestataire ORDER BY nom_type_prestataire",
  )).rows;
  const count = (await pool.query(
    `SELECT t.nom_type_prestataire, COUNT(p.id_prestataire) AS nb_prestataires
        FROM Type_prestataire t
        LEFT JOIN Prestataire p
          ON p.type_prestataire_id = t.id_type_prestataire
        GROUP BY t.nom_type_prestataire
        ORDER BY nb_prestataires DESC;
        `,
  )).rows;
  const animations = (await pool.query(
    "SELECT * FROM Type_animation ORDER BY nom_type_animation",
  )).rows;
  const restaurations = (await pool.query(
    "SELECT * FROM Type_restauration ORDER BY nom_type_restauration",
  )).rows;
  const boutiques = (await pool.query(
    "SELECT * FROM Type_boutique ORDER BY nom_type_boutique",
  )).rows;

  return { result, count, animations, restaurations, boutiques };
}

module.exports = {
    getTypePrestataire
}
