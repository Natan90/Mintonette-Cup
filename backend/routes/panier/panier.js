const express = require("express");
const router = express.Router();
const pool = require("../../database/db");


router.get("/show/:id", async (req, res) => {
    const id_user = req.params.id; 

    try {

        const result = await pool.query(` 
        SELECT 
        p.id_panier,
        p.utilisateur_id,
        p.actif,
        ps.numero_colonne AS siege_colonne,
        ps.numero_ligne AS siege_ligne,
        ps.zone AS siege_zone,
        ps.match_id AS siege_match_id,
        s.est_reserve,
        s.id_utilisateur AS siege_utilisateur_id,
        psrv.service_id,
        srv.nom_service,
        srv.prix AS prix_service,
        psrv.quantite AS quantite_service,
        psrv.prix_unitaire AS prix_unitaire_service
        FROM Panier p
        LEFT JOIN Panier_Siege ps
            ON ps.id_panier = p.id_panier
        LEFT JOIN Siege s
            ON s.numero_colonne = ps.numero_colonne
            AND s.numero_ligne = ps.numero_ligne
            AND s.zone = ps.zone
            AND s.match_id = ps.match_id
        LEFT JOIN Panier_Service psrv
            ON psrv.id_panier = p.id_panier
        LEFT JOIN Services srv
            ON srv.id_service = psrv.service_id
        WHERE p.utilisateur_id = $1;
        `, [id_user])

        res.json(result.rows);
    } catch (err) {
        console.error(err);
    }
})

router.post("/addService", async (req, res) => {
  const { id_user, service_id, quantite } = req.body;

  try {
    let panierResult = await pool.query(
      `SELECT id_panier FROM Panier WHERE utilisateur_id = $1 AND actif = TRUE`,
      [id_user]
    );

    let panier_id;

    if (panierResult.rows.length === 0) {
      const insertPanier = await pool.query(
        `INSERT INTO Panier (utilisateur_id) VALUES ($1) RETURNING id_panier`,
        [id_user]
      );
      panier_id = insertPanier.rows[0].id_panier;
    } else {
      panier_id = panierResult.rows[0].id_panier;
    }

    const serviceInPanier = await pool.query(
      `SELECT quantite FROM Panier_Service WHERE id_panier = $1 AND service_id = $2`,
      [panier_id, service_id]
    );

    if (serviceInPanier.rows.length === 0) {
      await pool.query(
        `INSERT INTO Panier_Service (id_panier, service_id, quantite, prix_unitaire)
         VALUES ($1, $2, $3, (SELECT prix FROM Services WHERE id_service = $2))`,
        [panier_id, service_id, quantite || 1]
      );
    } else {
      const nouvelleQuantite = serviceInPanier.rows[0].quantite + (quantite || 1);
      await pool.query(
        `UPDATE Panier_Service
         SET quantite = $1
         WHERE id_panier = $2 AND service_id = $3`,
        [nouvelleQuantite, panier_id, service_id]
      );
    }

    res.json({ success: true, panier_id });
  } catch (err) {
    console.error("Erreur lors de l'ajout au panier :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



module.exports = router;
