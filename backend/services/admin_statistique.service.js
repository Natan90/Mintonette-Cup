const pool = require("../database/db");

async function getStatistiques() {
  const totalUsers = await pool.query(`SELECT COUNT(*) FROM Utilisateur`);

  const totalPrestataires = await pool.query(
    `SELECT COUNT(*) FROM Prestataire WHERE waitingforadmin = false`,
  );

  const servicesByType = await pool.query(`
      SELECT 
        t.id_type_prestataire,
        t.nom_type_prestataire,
        COUNT(s.id_service) AS nb_services
      FROM Type_prestataire t
      LEFT JOIN Prestataire p
        ON p.type_prestataire_id = t.id_type_prestataire
        AND p.waitingforadmin = false
      LEFT JOIN Services s
        ON s.prestataire_id = p.id_prestataire
      GROUP BY t.id_type_prestataire, t.nom_type_prestataire
      ORDER BY t.nom_type_prestataire
    `);

  return {
    totalUsers: Number(totalUsers.rows[0].count),
    totalPrestataires: Number(totalPrestataires.rows[0].count),
    servicesByType: servicesByType.rows,
  };
}

module.exports = {
  getStatistiques,
};
