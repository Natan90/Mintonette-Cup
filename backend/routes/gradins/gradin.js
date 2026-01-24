const express = require("express");
const router = express.Router();
const pool = require("../../database/db");

/**
 * @swagger
 * tags:
 *   name: Sieges
 *   description: Gestion des sièges (réservation, panier)
 */

/**
 * @swagger
 * /gradin/show:
 *   get:
 *     summary: Récupère tous les sièges
 *     tags: [Sieges]
 *     responses:
 *       200:
 *         description: Liste des sièges récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   numero_colonne:
 *                     type: integer
 *                     example: 5
 *                   numero_ligne:
 *                     type: integer
 *                     example: 3
 *                   zone:
 *                     type: string
 *                     example: "A"
 *                   est_reserve:
 *                     type: boolean
 *                     example: false
 *                   dans_panier:
 *                     type: boolean
 *                     example: true
 *                   id_utilisateur:
 *                     type: integer
 *                     nullable: true
 *       500:
 *         description: Erreur serveur
 */

router.get("/show", async (req, res) => {
  try {
    const { matchId } = req.query;

    if (!matchId) {
      return res.status(400).json({ error: "matchId est requis" });
    }


    const result = await pool.query(
      "SELECT * FROM Siege WHERE match_id = $1 ORDER BY numero_colonne, numero_ligne",
      [matchId]
    );

    console.log(
      `${result.rows.length} sièges trouvés pour le match ${matchId}`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des sièges:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /gradin/update:
 *   put:
 *     summary: Met à jour l’état d’un siège
 *     tags: [Sieges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_colonne
 *               - numero_ligne
 *               - zone
 *               - est_reserve
 *               - dans_panier
 *             properties:
 *               numero_colonne:
 *                 type: integer
 *                 example: 5
 *               numero_ligne:
 *                 type: integer
 *                 example: 3
 *               zone:
 *                 type: string
 *                 example: "A"
 *               est_reserve:
 *                 type: boolean
 *                 example: true
 *               dans_panier:
 *                 type: boolean
 *                 example: false
 *               id_utilisateur:
 *                 type: integer
 *                 nullable: true
 *                 example: 12
 *     responses:
 *       200:
 *         description: Siège mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Erreur serveur
 */

router.put("/update", async (req, res) => {
  const {
    matchId,
    numero_colonne,
    numero_ligne,
    zone,
    est_reserve,
    id_utilisateur,
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE Siege
      SET 
        est_reserve = $1,
        id_utilisateur = COALESCE($6, id_utilisateur)
      WHERE match_id = $5
        AND numero_colonne = $2
        AND numero_ligne = $3
        AND zone = $4
      RETURNING *
      `,
      [
        est_reserve,
        numero_colonne,
        numero_ligne,
        zone,
        matchId,
        id_utilisateur,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /gradin/panier:
 *   put:
 *     summary: Met à jour le panier d’un siège
 *     tags: [Sieges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_colonne
 *               - numero_ligne
 *               - zone
 *               - dans_panier
 *             properties:
 *               numero_colonne:
 *                 type: integer
 *                 example: 5
 *               numero_ligne:
 *                 type: integer
 *                 example: 3
 *               zone:
 *                 type: string
 *                 example: "A"
 *               dans_panier:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Panier du siège mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Erreur serveur
 */

router.post("/panier/add", async (req, res) => {
  const {
    utilisateur_id,
    matchId,
    numero_colonne,
    numero_ligne,
    zone
  } = req.body;

  try {
    const panierRes = await pool.query(
      `SELECT id_panier FROM Panier
       WHERE utilisateur_id = $1 AND actif = true`,
      [utilisateur_id]
    );

    let id_panier;

    if (panierRes.rows.length === 0) {
      const newPanier = await pool.query(
        `INSERT INTO Panier (utilisateur_id)
         VALUES ($1) RETURNING id_panier`,
        [utilisateur_id]
      );
      id_panier = newPanier.rows[0].id_panier;
    } else {
      id_panier = panierRes.rows[0].id_panier;
    }

    await pool.query(
      `INSERT INTO Panier_Siege
       (id_panier, numero_colonne, numero_ligne, zone, match_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [id_panier, numero_colonne, numero_ligne, zone, matchId]
    );

    res.status(200).json({ message: "Siège ajouté au panier" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/panier/remove", async (req, res) => {
  const {
    id_panier,
    numero_colonne,
    numero_ligne,
    zone,
    matchId
  } = req.body;

  try {
    await pool.query(
      `DELETE FROM Panier_Siege
       WHERE id_panier = $1
         AND numero_colonne = $2
         AND numero_ligne = $3
         AND zone = $4
         AND match_id = $5`,
      [id_panier, numero_colonne, numero_ligne, zone, matchId]
    );

    res.json({ message: "Siège retiré du panier" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /gradin/panier/show:
 *   get:
 *     summary: Récupère les sièges présents dans le panier
 *     tags: [Sieges]
 *     responses:
 *       200:
 *         description: Liste des sièges dans le panier
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   numero_colonne:
 *                     type: integer
 *                     example: 5
 *                   numero_ligne:
 *                     type: integer
 *                     example: 3
 *                   zone:
 *                     type: string
 *                     example: "A"
 *                   est_reserve:
 *                     type: boolean
 *                     example: false
 *                   dans_panier:
 *                     type: boolean
 *                     example: true
 *                   id_utilisateur:
 *                     type: integer
 *                     nullable: true
 *       500:
 *         description: Erreur serveur
 */

router.get("/panier/show", async (req, res) => {
  const { utilisateur_id } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT s.*
      FROM Panier p
      JOIN Panier_Siege ps ON ps.id_panier = p.id_panier
      JOIN Siege s ON 
        s.numero_colonne = ps.numero_colonne
        AND s.numero_ligne = ps.numero_ligne
        AND s.zone = ps.zone
        AND s.match_id = ps.match_id
      WHERE p.utilisateur_id = $1
        AND p.actif = true
      `,
      [utilisateur_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
