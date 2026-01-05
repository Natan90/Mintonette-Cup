const express = require("express");
const router = express.Router();
const pool = require("../../database/db");
const { log } = require("node:console");

/**
 * @swagger
 * tags:
 *   name: Sieges
 *   description: Gestion des sièges (réservation, panier)
 */

/**
 * @swagger
 * /siege/show:
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
    const result = await pool.query(
      "SELECT * FROM Siege ORDER BY zone ASC, numero_colonne ASC, numero_ligne ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /siege/update:
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
    dans_panier,
    id_utilisateur,
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE Siege
      SET 
        est_reserve = $1,
        dans_panier = $2,
        id_utilisateur = COALESCE($7, id_utilisateur)
      WHERE match_id = $6
        AND numero_colonne = $3
        AND numero_ligne = $4
        AND zone = $5
      RETURNING *
      `,
      [
        est_reserve,
        dans_panier,
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
 * /siege/panier:
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

router.put("/panier", async (req, res) => {
  const { numero_colonne, numero_ligne, zone, dans_panier } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Siege SET dans_panier = $1 WHERE numero_colonne = $2 AND numero_ligne = $3 AND zone = $4 RETURNING *",
      [dans_panier, numero_colonne, numero_ligne, zone]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /siege/panier/show:
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
  try {
    const result = await pool.query(
      "SELECT * FROM Siege WHERE dans_panier = true"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
