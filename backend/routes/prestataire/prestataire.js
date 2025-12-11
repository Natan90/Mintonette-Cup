const express = require("express");
const router = express.Router();
const pool = require("../../database/db");


/**
 * @swagger
 * tags:
 *   name: Prestataires
 *   description: Gestion des prestataires et de leurs types
 */


/**
 * @swagger
 * /prestataire/show:
 *   get:
 *     summary: Récupère tous les prestataires
 *     tags: [Prestataires]
 *     responses:
 *       200:
 *         description: Liste des prestataires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_prestataire:
 *                     type: integer
 *                   nom_prestataire:
 *                     type: string
 *                   description_prestataire:
 *                     type: string
 *                   type_prestataire_id:
 *                     type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get("/show", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Prestataire ORDER BY nom_prestataire");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



/**
 * @swagger
 * /prestataire/showTypePrestataire:
 *   get:
 *     summary: Récupère la liste des types de prestataires
 *     tags: [Prestataires]
 *     responses:
 *       200:
 *         description: Liste des types de prestataires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_type_prestataire:
 *                     type: integer
 *                   nom_type_prestataire:
 *                     type: string
 *       500:
 *         description: Erreur serveur
 */
router.get("/showTypePrestataire", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Type_prestataire ORDER BY nom_type_prestataire");
    res.json(result.rows);
  }  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /prestataire/showEveryType:
 *   get:
 *     summary: Récupère tous les types (animation, restauration, boutique)
 *     tags: [Prestataires]
 *     responses:
 *       200:
 *         description: Types récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_type_animation:
 *                         type: integer
 *                       nom_type_animation:
 *                         type: string
 *                 restaurations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_type_restauration:
 *                         type: integer
 *                       nom_type_restauration:
 *                         type: string
 *                 boutiques:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_type_boutique:
 *                         type: integer
 *                       nom_type_boutique:
 *                         type: string
 *       500:
 *         description: Erreur serveur
 */
router.get("/showEveryType", async (req, res) => {
  try {
    const animations = await pool.query("SELECT * FROM Type_animation ORDER BY nom_type_animation");
    const restaurations = await pool.query("SELECT * FROM Type_restauration ORDER BY nom_type_restauration");
    const boutiques = await pool.query("SELECT * FROM Type_boutique ORDER BY nom_type_boutique");

    res.json({
      animations: animations.rows,
      restaurations: restaurations.rows,
      boutiques: boutiques.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})


module.exports = router;