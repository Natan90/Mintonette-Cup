const pool = require("../database/db");

async function getPanierByUser(id_user) {
  const result = await pool.query(
    `SELECT 
        p.*,
        ps.*,
        s.*,
        m.id_match,
        pays1.nom_pays AS equipe1_nom,
        pays2.nom_pays AS equipe2_nom,
        psrv.*,
        srv.nom_service,
        srv.prix AS prix_service
    FROM Panier p
    LEFT JOIN Panier_Siege ps
        ON ps.id_panier = p.id_panier
    LEFT JOIN Siege s
        ON s.numero_colonne = ps.numero_colonne
        AND s.numero_ligne = ps.numero_ligne
        AND s.zone = ps.zone
        AND s.match_id = ps.match_id
    LEFT JOIN Match m
        ON m.id_match = ps.match_id
    LEFT JOIN Equipe e1
        ON e1.id_equipe = m.id_equipe1
    LEFT JOIN Pays pays1
        ON pays1.id_pays = e1.id_pays
    LEFT JOIN Equipe e2
        ON e2.id_equipe = m.id_equipe2
    LEFT JOIN Pays pays2
        ON pays2.id_pays = e2.id_pays
    LEFT JOIN Panier_Service psrv
        ON psrv.id_panier = p.id_panier
    LEFT JOIN Services srv
        ON srv.id_service = psrv.service_id
    WHERE p.utilisateur_id = $1
    AND p.actif = true;`,
    [id_user],
  );
  return result.rows;
}

async function addSiege(id_user, matchId, numero_colonne, numero_ligne, zone) {
  const panierRes = await pool.query(
    `SELECT id_panier FROM Panier WHERE utilisateur_id = $1 AND actif = true`,
    [id_user],
  );

  let id_panier;
  if (panierRes.rows.length === 0) {
    const newPanier = await pool.query(
      `INSERT INTO Panier (utilisateur_id) VALUES ($1) RETURNING id_panier`,
      [id_user],
    );
    id_panier = newPanier.rows[0].id_panier;
  } else {
    id_panier = panierRes.rows[0].id_panier;
  }

  await pool.query(
    `INSERT INTO Panier_Siege (id_panier, numero_colonne, numero_ligne, zone, match_id)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT DO NOTHING`,
    [id_panier, numero_colonne, numero_ligne, zone, matchId],
  );

  return { id_panier };
}

async function addService(id_user, service_id, quantite = 1) {
  const panierRes = await pool.query(
    `SELECT id_panier FROM Panier WHERE utilisateur_id = $1 AND actif = true`,
    [id_user],
  );

  let id_panier;
  if (panierRes.rows.length === 0) {
    const newPanier = await pool.query(
      `INSERT INTO Panier (utilisateur_id) VALUES ($1) RETURNING id_panier`,
      [id_user],
    );
    id_panier = newPanier.rows[0].id_panier;
  } else {
    id_panier = panierRes.rows[0].id_panier;
  }

  const serviceRes = await pool.query(
    `SELECT quantite FROM Panier_Service WHERE id_panier = $1 AND service_id = $2`,
    [id_panier, service_id],
  );

  if (serviceRes.rows.length === 0) {
    await pool.query(
      `INSERT INTO Panier_Service (id_panier, service_id, quantite, prix_unitaire)
       VALUES ($1, $2, $3, (SELECT prix FROM Services WHERE id_service = $2))`,
      [id_panier, service_id, quantite],
    );
  } else {
    const nouvelleQuantite = serviceRes.rows[0].quantite + quantite;
    await pool.query(
      `UPDATE Panier_Service 
      SET quantite = $1 
      WHERE id_panier = $2 AND service_id = $3`,
      [nouvelleQuantite, id_panier, service_id],
    );
  }

  return { id_panier };
}

async function removeSiege(
  id_user,
  numero_colonne,
  numero_ligne,
  zone,
  matchId,
) {
  const panierRes = await pool.query(
    `SELECT id_panier FROM Panier WHERE utilisateur_id = $1 AND actif = true`,
    [id_user],
  );

  if (panierRes.rows.length === 0) return;

  const id_panier = panierRes.rows[0].id_panier;

  await pool.query(
    `DELETE FROM Panier_Siege
     WHERE id_panier = $1 AND numero_colonne = $2 AND numero_ligne = $3
       AND zone = $4 AND match_id = $5`,
    [id_panier, numero_colonne, numero_ligne, zone, matchId],
  );
}

async function removeService(id_user, service_id, quantite = 1) {
  const panierRes = await pool.query(
    `SELECT id_panier FROM Panier WHERE utilisateur_id = $1 AND actif = true`,
    [id_user],
  );

  if (panierRes.rows.length === 0) return;

  const id_panier = panierRes.rows[0].id_panier;

  const service = await pool.query(
    `SELECT quantite FROM Panier_Service WHERE id_panier = $1 AND service_id = $2`,
    [id_panier, service_id],
  );

  if (service.rows.length === 0) return;

  const nouvelleQuantite = service.rows[0].quantite - quantite;

  if (nouvelleQuantite > 0) {
    await pool.query(
      `UPDATE Panier_Service
       SET quantite = $1
       WHERE id_panier = $2 AND service_id = $3`,
      [nouvelleQuantite, id_panier, service_id],
    );
  } else {
    await pool.query(
      `DELETE FROM Panier_Service
       WHERE id_panier = $1 AND service_id = $2`,
      [id_panier, service_id],
    );
  }
}

module.exports = {
  getPanierByUser,
  addSiege,
  addService,
  removeSiege,
  removeService,
};
