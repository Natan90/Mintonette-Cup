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
async function getPrestataireByIdUser(id_user) {
  const result = await pool.query(
    `SELECT 
        p.*,
        u.*
        FROM Prestataire p
        JOIN Utilisateur u
            ON p.id_utilisateur = u.id_utilisateur
        WHERE p.id_utilisateur = $1`,
    [id_user],
  );
  return result.rows;
}

async function getPrestataireByIdPrestataire(id_presta) {
  const result = await pool.query(
    `SELECT 
        p.*,
        u.*
        FROM Prestataire p
        JOIN Utilisateur u
            ON p.id_utilisateur = u.id_utilisateur
        WHERE id_prestataire = $1`,
    [id_presta],
  );
  return result.rows;
}

async function filterPrestatairesAndServices({
  nom,
  category,
  prixMin,
  prixMax,
  type,
}) {
  let sql = "";
  const values = [];
  let index = 1;
  console.log("Type filter:", type);


  if (type === "services") {
    sql = `
      SELECT
        s.*,
        p.nom_prestataire,
        t.nom_type_prestataire
      FROM Services s
      JOIN Prestataire p ON s.prestataire_id = p.id_prestataire
      JOIN Type_prestataire t ON p.type_prestataire_id = t.id_type_prestataire
      WHERE 1=1
    `;
  } else {
    sql = `
      SELECT
        p.*,
        t.nom_type_prestataire,
        COUNT(s.id_service) AS nb_services
      FROM Prestataire p
      JOIN Type_prestataire t ON p.type_prestataire_id = t.id_type_prestataire
      LEFT JOIN Services s ON s.prestataire_id = p.id_prestataire
      WHERE 1=1
    `;
  }

  if (nom) {
    sql += ` AND p.nom_prestataire ILIKE $${index}`;
    values.push(`%${nom}%`);
    index++;
  }

  if (category && category !== "0") {
    sql += ` AND p.type_prestataire_id = $${index}`;
    values.push(Number(category));
    index++;
  }

  if (prixMin) {
    sql += ` AND s.prix >= $${index}`;
    values.push(prixMin);
    index++;
  }

  if (prixMax) {
    sql += ` AND s.prix <= $${index}`;
    values.push(prixMax);
    index++;
  }

  if (type === "services") {
    sql += ` ORDER BY s.nom_service`;
  } else {
    sql += `
      GROUP BY p.id_prestataire, t.nom_type_prestataire
      ORDER BY p.nom_prestataire
    `;
  }

  const result = await pool.query(sql, values);
  return result.rows;
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

  if (checkPresta.rows.length > 0) {
    await client.query("ROLLBACK");

    throw { status: 409, message: "Vous êtes déjà prestataire" };
  }

  const result = await client.query(
    `INSERT INTO Prestataire 
        (nom_prestataire, descri_prestataire, mail_prestataire, tel_prestataire, waitingForAdmin, specificite, message_ajout, id_utilisateur, type_prestataire_id) VALUES
        ($1, $2, $3, $4, true, $5, true, $6, $7)
        RETURNING id_prestataire`,
    [nom, descri, mail, tel, JSON.stringify(specificite), id_user, type],
  );

  const newPresta = result.rows[0];

  if (Array.isArray(services) && services.length > 0) {
    for (const service of services) {
      const titre_service = {
        fr: { texte: service.titre_service?.fr?.texte || "" },
        en: { texte: service.titre_service?.en?.texte || "" },
      };

      const descri_service = {
        fr: { texte: service.descri_service?.fr?.texte || "" },
        en: { texte: service.descri_service?.en?.texte || "" },
      };

      const besoin = {
        fr: service.besoin?.fr || "",
        en: service.besoin?.en || "",
      };

      await client.query(
        `INSERT INTO Services (nom_service, titre_service, descri_service, visible_public, besoin, prix, nb_participants, activate, prestataire_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8)`,
        [
          service.nom_service,
          JSON.stringify(titre_service),
          JSON.stringify(descri_service),
          service.visible_public ?? true,
          JSON.stringify(besoin),
          service.prix ?? 0,
          service.nb_participants ?? nb_participants,
          newPresta.id_prestataire,
        ],
      );
    }
  }

  await client.query("COMMIT");

  return {
    id_utilisateur: newPresta.id_utilisateur,
    id_prestataire: newPresta.id_prestataire,
  };
}

async function updatePrestataire(id_user, prestataire) {
  const { nom, descri, mail, tel, specificite, type, services } = prestataire;
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
  const id_prestataire = checkPresta.rows[0].id_prestataire;

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

  if (Array.isArray(services)) {
    for (const service of services) {
      const titre_service = {
        fr: { texte: service.titre_service?.fr?.texte || "" },
        en: { texte: service.titre_service?.en?.texte || "" },
      };
      const descri_service = {
        fr: { texte: service.descri_service?.fr?.texte || "" },
        en: { texte: service.descri_service?.en?.texte || "" },
      };
      const besoin = {
        fr: service.besoin?.fr || "",
        en: service.besoin?.en || "",
      };

      if (service.id_service) {
        await client.query(
          `UPDATE Services
              SET 
                nom_service = $1,
                titre_service = $2,
                descri_service = $3,
                besoin = $4,
                visible_public = $5,
                prix = $6,
                nb_participants = $7
              WHERE id_service = $8 AND prestataire_id = $9`,
          [
            service.nom_service,
            JSON.stringify(titre_service),
            JSON.stringify(descri_service),
            JSON.stringify(besoin),
            service.visible_public ?? true,
            service.prix ?? 0,
            service.nb_participants ?? nb_participants,
            service.id_service,
            id_prestataire,
          ],
        );
      } else {
        await client.query(
          `INSERT INTO Services
              (nom_service, titre_service, descri_service, besoin, visible_public, prix, nb_participants, activate, prestataire_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8)`,
          [
            service.nom_service,
            JSON.stringify(titre_service),
            JSON.stringify(descri_service),
            JSON.stringify(besoin),
            service.visible_public ?? true,
            service.prix ?? 0,
            service.nb_participants ?? nb_participants,
            id_prestataire,
          ],
        );
      }
    }
  }
  const newPresta = result.rows[0];

  await client.query("COMMIT");

  return {
    id_utilisateur: newPresta.id_utilisateur,
  };
}

module.exports = {
  getPrestataire,
  getPrestataireByIdUser,
  getPrestataireByIdPrestataire,
  filterPrestatairesAndServices,
  becomePrestataire,
  updatePrestataire,
};
