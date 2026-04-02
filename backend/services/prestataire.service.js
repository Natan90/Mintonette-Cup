const pool = require("../database/db");

async function getPrestataire() {
  const result = await pool.query(
    `SELECT
        p.*,
        u.*,
        t.nom_type_prestataire,
        COALESCE(s.nb_services, 0) AS nb_services
      FROM Prestataire p
      JOIN Utilisateur u ON p.id_utilisateur = u.id_utilisateur
      JOIN Type_prestataire t ON p.type_prestataire_id = t.id_type_prestataire
      LEFT JOIN (
        SELECT prestataire_id, COUNT(*) AS nb_services
        FROM Services
        GROUP BY prestataire_id) s 
        ON p.id_prestataire = s.prestataire_id
      ORDER BY p.waitingforadmin, p.nom_prestataire;
      `,
  );
  return result.rows;
}

async function getPrestataireByIdPrestataire(id_presta) {
  const resultPresta = await pool.query(
    `SELECT 
        p.*,
        u.prenom_utilisateur,
        u.id_utilisateur,
        u.nom_utilisateur,
        u.login_utilisateur,
        u.mail_utilisateur,
        u.tel_utilisateur,
        u.sexe_utilisateur,
        u.ispresta,
        u.isadmin,
        t.is_activity
     FROM Prestataire p
     JOIN Utilisateur u ON p.id_utilisateur = u.id_utilisateur
     JOIN Type_prestataire t ON p.type_prestataire_id = t.id_type_prestataire
     WHERE P.id_prestataire = $1`,
    [id_presta]
  );

  return {
    prestataire : resultPresta.rows[0]
  };
}

async function getPrestataireByIdUtilisateur(id_user) {
  const resultPresta = await pool.query(
    `SELECT 
        p.*,
        u.prenom_utilisateur,
        u.nom_utilisateur,
        u.login_utilisateur,
        u.mail_utilisateur,
        u.tel_utilisateur,
        u.sexe_utilisateur,
        u.ispresta,
        u.isadmin
     FROM Prestataire p
     JOIN Utilisateur u ON p.id_utilisateur = u.id_utilisateur
     WHERE P.id_utilisateur = $1`,
    [id_user]
  );

  return {
    prestataire : resultPresta.rows[0]
  };
}

async function becomePrestataire(id_user, prestataire) {
  const { nom, descri, mail, tel, specificite, type, services } = prestataire;
  const client = await pool.connect();

  await client.query("BEGIN");

  // Vérifier si le mail existe déjà
  const checkPresta = await client.query(
    "SELECT id_prestataire FROM Prestataire WHERE id_utilisateur = $1",
    [id_user],
  );

  const checkPrestaWaiting = await client.query(
    "SELECT id_prestataire FROM Prestataire WHERE id_utilisateur = $1 AND waitingForAdmin = true",
    [id_user],
  );

  if (checkPresta.rows.length > 0) {
    await client.query("ROLLBACK");

    let message = "Vous êtes déjà prestataire";

    if (checkPrestaWaiting.rows.length > 0) {
      message = "Votre demande est en cours de validation"
    }

    throw { status: 409, message: message };
  }

  const result = await client.query(
    `INSERT INTO Prestataire 
        (nom_prestataire, descri_prestataire, mail_prestataire, tel_prestataire, waitingForAdmin, specificite, message_ajout, id_utilisateur, type_prestataire_id) VALUES
        ($1, $2, $3, $4, true, $5, true, $6, $7)
        RETURNING id_prestataire`,
    [nom, descri, mail, tel, JSON.stringify(specificite), id_user, type],
  );

  const newPresta = result.rows[0];

  await client.query("COMMIT");

  return {
    id_utilisateur: newPresta.id_utilisateur,
    id_prestataire: newPresta.id_prestataire,
  };
}

async function updatePrestataire(id_user, prestataire) {
  const { nom, descri, mail, tel, specificite, type } = prestataire;
  const client = await pool.connect();

  await client.query("BEGIN");

  // Vérifier si le mail existe déjà
  const checkPresta = await client.query(
    "SELECT id_prestataire FROM Prestataire WHERE id_utilisateur = $1",
    [id_user],
  );

  if (checkPresta.rows.length === 0) {
    await client.query("ROLLBACK");

    throw { status: 409, message: "Vous n'êtes pas un prestataire" };
  }
  const result = await client.query(
    `UPDATE Prestataire
        SET 
            nom_prestataire = $1,
            descri_prestataire = $2,
            mail_prestataire = $3,
            tel_prestataire = $4,
            waitingForAdmin = true,
            specificite = $5,
            message_ajout = false,
            type_prestataire_id = $6
        WHERE id_utilisateur = $7
        RETURNING id_prestataire;
        `,
    [nom, descri, mail, tel, JSON.stringify(specificite), type, id_user],
  );

  const newPresta = result.rows[0];

  await client.query("COMMIT");

  return {
    id_utilisateur: newPresta.id_utilisateur,
  };
}

module.exports = {
  getPrestataire,
  getPrestataireByIdPrestataire,
  getPrestataireByIdUtilisateur,
  becomePrestataire,
  updatePrestataire,
};
