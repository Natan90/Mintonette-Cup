const pool = require("../database/db");

async function getPanierByUser(id_user) {
  const result = await pool.query(
    `SELECT 
        p.*,
        ps.*,
        s.*,
        m.id_match,
        m.date_match,
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

async function getBilletsById(id_user) {}

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

async function payPanier(id_user, sieges, services, total) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const s of sieges) {
      const check = await client.query(
        `
        SELECT est_reserve
        FROM Siege
        WHERE match_id = $1
          AND numero_colonne = $2
          AND numero_ligne = $3
          AND zone = $4
        FOR UPDATE
        `,
        [s.match_id, s.numero_colonne, s.numero_ligne, s.zone],
      );

      if (check.rows.length === 0 || check.rows[0].est_reserve) {
        throw new Error("Siège déjà réservé");
      }
    }

    const commandeRes = await client.query(
      `
      INSERT INTO Commande (utilisateur_id, total)
      VALUES ($1, $2)
      RETURNING id_commande
      `,
      [id_user, total],
    );

    const id_commande = commandeRes.rows[0].id_commande;

    for (const s of sieges) {
      await client.query(
        `
        UPDATE Siege
        SET est_reserve = $5, id_utilisateur = $6
        WHERE match_id = $1
          AND numero_colonne = $2
          AND numero_ligne = $3
          AND zone = $4
        `,
        [s.match_id, s.numero_colonne, s.numero_ligne, s.zone, true, id_user],
      );

      await client.query(
        `
        INSERT INTO Commande_Siege
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          id_commande,
          s.match_id,
          s.numero_colonne,
          s.numero_ligne,
          s.zone,
          s.prix,
        ],
      );
    }

    for (const srv of services) {
      await client.query(
        `
        INSERT INTO Commande_Service
        VALUES ($1, $2, $3, $4)
        `,
        [id_commande, srv.service_id, srv.quantite, srv.prix_unitaire],
      );
    }
    await client.query("COMMIT");
    return {
      message: "Paiement validé",
      id_commande,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function getBilletsByUser(id_user) {
  const result = await pool.query(
    `
    SELECT
      c.id_commande,
      c.date_commande,
      c.total,

      cs.match_id,
      cs.numero_colonne,
      cs.numero_ligne,
      cs.zone,
      cs.prix AS prix_siege,

      m.date_match,
      pays1.nom_pays AS equipe1,
      pays2.nom_pays AS equipe2,

      srv.nom_service,
      csv.quantite,
      csv.prix_unitaire

    FROM Commande c

    LEFT JOIN Commande_Siege cs
      ON cs.id_commande = c.id_commande

    LEFT JOIN Match m
      ON m.id_match = cs.match_id

    LEFT JOIN Equipe e1 ON e1.id_equipe = m.id_equipe1
    LEFT JOIN Pays pays1 ON pays1.id_pays = e1.id_pays

    LEFT JOIN Equipe e2 ON e2.id_equipe = m.id_equipe2
    LEFT JOIN Pays pays2 ON pays2.id_pays = e2.id_pays

    LEFT JOIN Commande_Service csv
      ON csv.id_commande = c.id_commande

    LEFT JOIN Services srv
      ON srv.id_service = csv.service_id

    WHERE c.utilisateur_id = $1
    ORDER BY c.date_commande DESC
  `,
    [id_user],
  );

  return result.rows;
}

async function clearPanier(id_user) {
  const panierRes = await pool.query(
    `SELECT id_panier FROM Panier WHERE utilisateur_id = $1 AND actif = true`,
    [id_user],
  );

  if (panierRes.rows.length === 0) return;

  const id_panier = panierRes.rows[0].id_panier;

  // Supprimer tous les sièges du panier
  await pool.query(`DELETE FROM Panier_Siege WHERE id_panier = $1`, [
    id_panier,
  ]);

  // Supprimer tous les services du panier
  await pool.query(`DELETE FROM Panier_Service WHERE id_panier = $1`, [
    id_panier,
  ]);
}

module.exports = {
  getPanierByUser,
  addSiege,
  addService,
  removeSiege,
  removeService,
  payPanier,
  getBilletsByUser,
  clearPanier,
};
