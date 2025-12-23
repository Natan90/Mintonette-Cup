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
});


router.post("/becomePrestataire", async (req, res) => {
  const { nom, descri, nb_participants, tarif, mail, tel, type, id_user } = req.body;
  if (!nom || !descri || !tarif || !mail || !tel || !type || !id_user)
    return res.status(400).json({
      error: "Champs obligatoires manquants",
    });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifier si le mail existe déjà
    const checkPresta = await client.query(
      "SELECT id_prestataire FROM Prestataire WHERE id_utilisateur = $1",
      [id_user]
    );

    if (checkPresta.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "Vous êtes déjà prestataire",
      });
    }

    const result = await client.query(
      `INSERT INTO Prestataire 
        (nom_prestataire, descri_prestataire, nb_participants, tarif_prestataire, mail_prestataire, tel_prestataire, waitingForAdmin, id_utilisateur, type_prestataire_id) VALUES
        ($1, $2, $3, $4, $5, $6, true, $7, $8)
        RETURNING id_prestataire`,
      [nom, descri, nb_participants, tarif, mail, tel, id_user, type]
    );

    const newUser = result.rows[0];

    await client.query("COMMIT");

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser.id_utilisateur,
      }
    });


  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Erreur création prestataire : ", err);
    res.status(500).json({
      error: "Erreur serveur",
    });
  } finally {
    client.release(); 
  }
})


module.exports = router;