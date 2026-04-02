const pool = require("../database/db");

async function getServices() {
  const servicesResult = await pool.query(`
    SELECT 
      s.*,
      CASE
        WHEN t.is_activity = TRUE THEN TRUE
        ELSE s.is_activity
      END AS service_is_activity,
      p.*,
      t.*
    FROM Services s
    JOIN Prestataire p
    ON s.prestataire_id = p.id_prestataire
    JOIN Type_prestataire t
    ON p.type_prestataire_id = t.id_type_prestataire
    `);

  const articlesResult = await pool.query(`SELECT * FROM Article`);

  const activitesResult = await pool.query(`SELECT * FROM Activite`);

  return {
    services: servicesResult.rows,
    articles: articlesResult.rows,
    activites: activitesResult.rows,
  };
}

async function getServiceByIdPrestataire(id_presta) {
  const serviceResult = await pool.query(
    `SELECT * FROM Services WHERE prestataire_id = $1`,
    [id_presta],
  );

  return {
    services: serviceResult.rows,
  };
}

async function getServiceByIdService(id_service) {
  const serviceResult = await pool.query(
    `SELECT * FROM Services WHERE id_service = $1`,
    [id_service],
  );

  if (serviceResult.rows.length === 0)
    throw { status: 404, message: "Service non trouvé" };

  return {
    service: serviceResult.rows[0],
  };
}

async function getArticleByIdService(id_service) {
  const checkService = await pool.query(
    `SELECT * FROM Services WHERE id_service = $1;`,
    [id_service],
  );

  if (checkService.rows.length === 0)
    throw { status: 404, message: "Service non trouvé" };

  const articlesResult = await pool.query(
    `SELECT   
      a.*,
      COUNT(a.id_article) AS nb_article 
    FROM Article a 
    WHERE service_id = $1
    GROUP BY a.id_article;`,
    [id_service],
  );

  return {
    articles: articlesResult.rows,
  };
}

async function getActiviteByIdService(id_service) {
  const checkService = await pool.query(
    `SELECT * FROM Services WHERE id_service = $1;`,
    [id_service],
  );

  if (checkService.rows.length === 0)
    throw { status: 404, message: "Service non trouvé" };

  const activitesResult = await pool.query(
    `SELECT 
      a.*,
      COUNT(a.id_activite) AS nb_activite
    FROM Activite a
    WHERE service_id = $1
    GROUP BY a.id_activite`,
    [id_service],
  );

  return {
    activites: activitesResult.rows,
  };
}

async function getArticleByIdArticle(id_article) {
  const articleResult = await pool.query(
    `SELECT * FROM Article WHERE id_article = $1`,
    [id_article],
  );

  if (articleResult.rows.length === 0)
    throw { status: 404, message: "Article non trouvé" };

  return {
    article: articleResult.rows[0],
  };
}

async function getActiviteByIdActivite(id_activite) {
  const activiteResult = await pool.query(
    `SELECT * FROM Activite WHERE id_activite = $1`,
    [id_activite],
  );

  if (activiteResult.rows.length === 0)
    throw { status: 404, message: "Activité non trouvée" };

  return {
    activite: activiteResult.rows[0],
  };
}

async function activateServiceById(id_service) {
  const result = await pool.query(
    `UPDATE Services
        SET activate = NOT activate
        WHERE id_service = $1
        RETURNING prestataire_id;
        `,
    [id_service],
  );

  return result.rows;
}

async function createService(id_presta, service) {
  const { nom_service, descri_service, besoin, activate, visible_public } =
    service;

  const prestataireTypeResult = await pool.query(
    `SELECT t.is_activity
     FROM Prestataire p
     JOIN Type_prestataire t ON p.type_prestataire_id = t.id_type_prestataire
     WHERE p.id_prestataire = $1`,
    [id_presta],
  );

  if (prestataireTypeResult.rows.length === 0) {
    throw { status: 404, message: "Prestataire non trouvé" };
  }

  const isActivity = prestataireTypeResult.rows[0].is_activity === true;

  const checkService = await pool.query(
    `SELECT * FROM Services
    WHERE prestataire_id = $1 AND nom_service = $2`,
    [id_presta, nom_service],
  );

  if (checkService.rows.length === 0) {
    const insertService = await pool.query(
      `INSERT INTO Services (nom_service, descri_service, visible_public, besoin, activate, is_activity, prestataire_id) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        nom_service,
        descri_service,
        visible_public,
        besoin,
        activate,
        isActivity,
        id_presta,
      ],
    );

    return {
      service: insertService.rows[0],
      message: "Service crée avec succès",
    };
  } else {
    return {
      service: checkService.rows[0],
      message: "Ce service existe déjà",
    };
  }
}

async function addArticleByIdService(id_service, article) {
  const { nom, stock, prix } = article;

  const checkArticle = await pool.query(
    `SELECT * FROM Article
    WHERE service_id = $1 AND nom_article = $2 AND prix_article = $3`,
    [id_service, nom, prix],
  );

  if (checkArticle.rows.length === 0) {
    const result = await pool.query(
      `INSERT INTO Article (nom_article, stock, prix_article, service_id) VALUES
    ($1, $2, $3, $4)
    RETURNING *`,
      [nom, stock, prix, id_service],
    );

    return {
      article: result.rows[0],
      message: "Article ajouté avec succès",
      status: 201,
    };
  } else {
    return {
      article: checkArticle.rows[0],
      message: "Cet article existe déjà",
      status: 200,
    };
  }
}

async function addActiviteByIdService(id_service, activite) {
  const { nom, nb_participant, prix, date, heure } = activite;

  const date_activite = `${date}T${heure}`;

  const checkActivite = await pool.query(
    `SELECT * FROM Activite
    WHERE service_id = $1 AND nom_activite = $2 AND date_activite = $3`,
    [id_service, nom, date_activite],
  );

  if (checkActivite.rows.length === 0) {
    const result = await pool.query(
      `INSERT INTO Activite (nom_activite, nb_participant, prix_activite, date_activite, service_id) VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *`,
      [nom, nb_participant, prix, date_activite, id_service],
    );

    return {
      activite: result.rows[0],
      message: "Activité ajoutée avec succès",
      status: 201,
    };
  } else {
    return {
      activite: checkActivite.rows[0],
      message: "Cette activité existe déjà",
      status: 200,
    };
  }
}

async function deleteServiceById(id_service) {
  const checkService = await pool.query(
    `SELECT * FROM Services WHERE id_service = $1`,
    [id_service],
  );

  if (checkService.rowCount === 0) {
    throw { status: 404, message: "Service non trouvé" };
  }

  await pool.query(`DELETE FROM Article WHERE service_id = $1`, [id_service]);

  await pool.query(`DELETE FROM Activite WHERE service_id = $1`, [id_service]);

  await pool.query(`DELETE FROM Services WHERE id_service = $1`, [id_service]);

  return { message: "Service supprimé avec succès" };
}

async function deleteArticleById(id_article) {
  const checkArticle = await pool.query(
    `SELECT * FROM Article WHERE id_article = $1`,
    [id_article],
  );

  if (checkArticle.rowCount === 0) {
    throw { status: 404, message: "Article non trouvé" };
  }

  await pool.query(`DELETE FROM Article WHERE id_article = $1`, [id_article]);

  return { message: "Article supprimé avec succès" };
}

async function deleteActiviteById(id_activite) {
  const checkActivite = await pool.query(
    `SELECT * FROM Activite WHERE id_activite = $1`,
    [id_activite],
  );

  if (checkActivite.rowCount === 0) {
    throw { status: 404, message: "Activité non trouvée" };
  }

  await pool.query(`DELETE FROM Activite WHERE id_activite = $1`, [
    id_activite,
  ]);

  return { message: "Activité supprimée avec succès" };
}

async function editActiviteById(id_activite, newActivite) {
  const { nom, nb_participant, prix, date, heure } = newActivite;

  const date_activite = `${date}T${heure}`;

  const checkActivite = await pool.query(
    `SELECT * FROM Activite WHERE id_activite = $1`,
    [id_activite],
  );

  if (checkActivite.rowCount === 0) {
    throw { status: 404, message: "Activité non trouvée" };
  }

  const result = await pool.query(
    `UPDATE Activite SET nom_activite = $1, nb_participant = $2, prix_activite = $3, date_activite = $4
    WHERE id_activite = $5
    RETURNING *;`,
    [nom, nb_participant, prix, date_activite, id_activite],
  );

  return {
    message: "Activité modifiée avec succès",
    article: result.rows[0],
  };
}

async function editArticleById(id_article, newArticle) {
  const { nom, stock, prix } = newArticle;
  const checkArticle = await pool.query(
    `SELECT * FROM Article WHERE id_article = $1`,
    [id_article],
  );

  if (checkArticle.rowCount === 0) {
    throw { status: 404, message: "Article non trouvé" };
  }

  const result = await pool.query(
    `UPDATE Article SET nom_article = $1, stock = $2, prix_article = $3
    WHERE id_article = $4
    RETURNING *;`,
    [nom, stock, prix, id_article],
  );

  return {
    message: "Article modifié avec succès",
    article: result.rows[0],
  };
}

module.exports = {
  getServices,
  getServiceByIdPrestataire,
  getServiceByIdService,
  getArticleByIdService,
  getActiviteByIdService,
  getArticleByIdArticle,
  getActiviteByIdActivite,
  activateServiceById,
  createService,
  addArticleByIdService,
  addActiviteByIdService,
  deleteServiceById,
  deleteArticleById,
  deleteActiviteById,
  editActiviteById,
  editArticleById,
};
