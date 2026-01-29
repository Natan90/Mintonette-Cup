const pool = require("../database/db");

async function validatePrestataireById(id_presta) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifie que le prestataire est en attente
    const checkPresta = await client.query(
      "SELECT id_utilisateur FROM Prestataire WHERE id_prestataire = $1 AND waitingforadmin = true",
      [id_presta],
    );

    if (checkPresta.rows.length === 0) {
      await client.query("ROLLBACK");
      throw { status: 404, message: "Prestataire non trouvé ou déjà validé" };
    }

    const idUtilisateur = checkPresta.rows[0].id_utilisateur;

    // Met à jour le prestataire
    await client.query(
      "UPDATE Prestataire SET waitingforadmin = false WHERE id_prestataire = $1",
      [id_presta],
    );

    // Met à jour l'utilisateur
    await client.query(
      "UPDATE Utilisateur SET ispresta = TRUE WHERE id_utilisateur = $1",
      [idUtilisateur],
    );

    await client.query("COMMIT");

    return { message: "Prestataire validé avec succès" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function refuserPrestataireById(id_presta) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifie que le prestataire est en attente
    const checkPresta = await client.query(
      "SELECT id_utilisateur FROM Prestataire WHERE id_prestataire = $1 AND waitingforadmin = true",
      [id_presta],
    );

    if (checkPresta.rows.length === 0) {
      await client.query("ROLLBACK");
      throw {
        status: 404,
        message: "Prestataire non trouvé ou déjà validé/refusé",
      };
    }

    const idUtilisateur = checkPresta.rows[0].id_utilisateur;

    // Met à jour le prestataire pour le marquer comme refusé
    const result = await client.query(
      `UPDATE Prestataire
       SET waitingforadmin = false, refused = true
       WHERE id_prestataire = $1
       RETURNING *`,
      [id_presta],
    );

    // Met à jour l'utilisateur
    await client.query(
      "UPDATE Utilisateur SET ispresta = FALSE WHERE id_utilisateur = $1",
      [idUtilisateur],
    );

    await client.query("COMMIT");

    return {
      message: "Prestataire refusé avec succès",
      prestataire: result.rows[0],
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function deletePrestataireById(id_presta) {
  await pool.query("DELETE FROM services WHERE prestataire_id = $1", [
    id_presta,
  ]);

  const result = await pool.query(
    "DELETE FROM Prestataire WHERE id_prestataire = $1 RETURNING *",
    [id_presta],
  );
  if (result.rows.length === 0) {
    throw { status: 404, message: "Prestataire non trouvé" };
  }

  const idUtilisateur = result.rows[0].id_utilisateur;

  await pool.query(
    "UPDATE Utilisateur SET ispresta = FALSE WHERE id_utilisateur = $1",
    [idUtilisateur],
  );

  return {
    message: "Prestataire supprimé et utilisateur mis à jour",
    prestataire: result.rows[0],
  };
}


async function getZone() {
    const result = await pool.query(
      `SELECT p.id_prestataire, p.nom_prestataire, p.id_zone, 
              u.nom_utilisateur, u.prenom_utilisateur
       FROM Prestataire p
       JOIN Utilisateur u ON p.id_utilisateur = u.id_utilisateur
       WHERE p.waitingforadmin = false`
    );

    // Créer un tableau de 32 zones
    const zones = [];
    for (let i = 1; i <= 32; i++) {
      const prestataire = result.rows.find(p => p.id_zone === i);
      zones.push({
        id_zone: i,
        occupied: !!prestataire,
        prestataire: prestataire || null
      });
    }

    return zones;
}

async function assignZoneById(id_zone, id_prestataire) {
    const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifier que le prestataire existe
    const prestaCheck = await client.query(
      "SELECT * FROM Prestataire WHERE id_prestataire = $1",
      [id_prestataire]
    );

    if (prestaCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      throw { status: 404, message: "Prestataire non trouvé" };
    }

    // Vérifier que la zone n'est pas déjà attribuée
    const zoneCheck = await client.query(
      "SELECT * FROM Prestataire WHERE id_zone = $1",
      [id_zone]
    );

    if (zoneCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      throw { status: 409, message: "Cette zone est déjà attribuée", prestataire: zoneCheck.rows[0] };
    }

    // Attribuer la zone
    const result = await client.query(
      "UPDATE Prestataire SET id_zone = $1 WHERE id_prestataire = $2 RETURNING *",
      [id_zone, id_prestataire]
    );

    await client.query("COMMIT");

    return {
        message: "Zone attribué avec succès",
        prestataire: result.rows[0]
    }

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function unassignZoneById(id_presta) {
    const result = await pool.query(
      "UPDATE Prestataire SET id_zone = NULL WHERE id_prestataire = $1 RETURNING *",
      [id_presta]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Prestataire non trouvé" }
    }

    return {
        message: "Zone libérée avec succès",
        prestataire: result.rows[0]
    }
}



module.exports = {
  validatePrestataireById,
  refuserPrestataireById,
  deletePrestataireById,
  getZone,
  assignZoneById,
  unassignZoneById
};
