const pool = require("../database/db");

async function getServices() {
    const result = await pool.query(
      `SELECT * FROM Services`
    );
    return result.rows;
}

async function getServiceById(id_service) {
    const result = await pool.query(
      `SELECT * FROM Services
        WHERE id_service = $1`,
      [id_service]
    );
    if (result.rows.length === 0)
        throw { status: 409, message: "Service non trouvé" };

    return result.rows[0];
}

async function activateServiceById(id_service) {
    const result = await pool.query(
      `UPDATE Services
        SET activate = NOT activate
        WHERE id_service = $1
        RETURNING prestataire_id;
        `,
      [id_service]
    );

    return result.rows;
}

async function CreateService(id_presta, service) {
  const { nom_service, descri_service, besoin, activate, visible_public } = service;

  const checkService = await pool.query(
    `SELECT * FROM Services
    WHERE prestataire_id = $1 AND nom_service = $2`,
    [id_presta, nom_service]
  );

  if (checkService.rows.length === 0) {
    const insertService = await pool.query(
      `INSERT INTO Services (nom_service, descri_service, visible_public, besoin, activate, prestataire_id) VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING id_service`,
      [nom_service, descri_service, visible_public, besoin, activate, id_presta]
    );

    return {
      id_service: insertService.rows[0].id_service,
      message: "Service crée avec succès"
    }
  }
  else {
    return {
      id_service: checkService.rows[0].id_service,
      message: "Ce service existe déjà"
    };
  }
}


module.exports = {
    getServices,
    getServiceById,
    activateServiceById,
    CreateService,
}