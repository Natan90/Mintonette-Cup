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
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    const servicesResult = await client.query(
      `SELECT s.id_service 
       FROM Services s
       JOIN Prestataire p ON s.prestataire_id = p.id_prestataire
       WHERE p.id_utilisateur = $1`,
      [id_user]
    );
    const serviceIds = servicesResult.rows.map(r => r.id_service);

    if (serviceIds.length > 0) {
      await client.query(
        `DELETE FROM Article WHERE service_id = ANY($1)`,
        [serviceIds]
      );

      await client.query(
        `DELETE FROM Activite WHERE service_id = ANY($1)`,
        [serviceIds]
      );

      await client.query(
        `DELETE FROM Panier_Service WHERE service_id = ANY($1)`,
        [serviceIds]
      );

      await client.query(
        `DELETE FROM Commande_Service WHERE service_id = ANY($1)`,
        [serviceIds]
      );

      await client.query(
        `DELETE FROM Services WHERE id_service = ANY($1)`,
        [serviceIds]
      );
    }
    await client.query(
      `DELETE FROM Prestataire WHERE id_utilisateur = $1`,
      [id_user]
    );

    await client.query(
      `DELETE FROM Mailbox_Message WHERE sender_id = $1 OR recipient_id = $1`,
      [id_user]
    );
    await client.query(
      `DELETE FROM Nombre_Connexion WHERE login_tentative = (
        SELECT login_utilisateur FROM Utilisateur WHERE id_utilisateur = $1
      )`,
      [id_user]
    );
    await client.query(
      `DELETE FROM Commentaire WHERE id_utilisateur = $1`,
      [id_user]
    );

    const result = await client.query(
      `DELETE FROM Utilisateur WHERE id_utilisateur = $1 RETURNING *`,
      [id_user]
    );

    if (result.rows.length === 0) {
      throw { status: 404, message: "Utilisateur non trouvé" };
    }

    await client.query("COMMIT");

    return {
      utilisateur: result.rows[0],
      message: "Utilisateur supprimé",
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getUtilisateur,
  getUtilisateurById,
  updateUtilisateurInPresta,
  deleteUtilisateurById
};
