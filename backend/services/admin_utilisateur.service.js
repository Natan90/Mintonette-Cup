const pool = require("../database/db");

async function getUtilisateur() {
  const result = await pool.query(`
      SELECT u.*,
      p.waitingforadmin 
      FROM Utilisateur u
      LEFT JOIN Prestataire p
      ON p.id_utilisateur = u.id_utilisateur
      `);

  return result.rows;
}

async function getUtilisateurById(id_user) {
  const result = await pool.query(
    `
      SELECT u.*,
      p.waitingforadmin 
      FROM Utilisateur u
      LEFT JOIN Prestataire p
      ON p.id_utilisateur = u.id_utilisateur
      WHERE u.id_utilisateur=$1`,
    [id_user],
  );

  if (result.rows.length === 0)
    throw { status: 404, message: "Utilisateur non trouvé" };

  return result.rows[0];
}

async function updateUtilisateurInPresta(id_user, valueChange) {
  const result = await pool.query(
    `UPDATE Utilisateur
       SET ispresta = $1
       WHERE id_utilisateur = $2
       RETURNING *`,
    [valueChange, id_user],
  );

  if (result.rows.length === 0)
    throw { status: 404, message: "Utilisateur non trouvé" };

  return {
    utilisateur: result.rows[0],
    message: "Utilisateur mis à jour avec succès",
  };
}

async function deleteUtilisateurById(id_user) {
  await pool.query("DELETE FROM Prestataire WHERE id_utilisateur=$1", [id_user]);
  const result = await pool.query(
    "DELETE FROM Utilisateur WHERE id_utilisateur=$1 RETURNING *",
    [id_user],
  );
  if (result.rows.length === 0) {
    throw { status: 404, message: "Utilisateur non trouvé" };
  }
  return {
    utilisateur: result.rows[0],
    message: "Utilisateur supprimé",
  };
}

module.exports = {
  getUtilisateur,
  getUtilisateurById,
  updateUtilisateurInPresta,
  deleteUtilisateurById
};
