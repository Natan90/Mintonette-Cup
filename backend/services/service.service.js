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
    const client = await pool.connect();

    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE Services
        SET activate = NOT activate
        WHERE id_service = $1
        RETURNING prestataire_id;
        `,
      [id_service]
    );

    await client.query("COMMIT");
    return result.rows;
}


module.exports = {
    getServices,
    getServiceById,
    activateServiceById,
}