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
    const result = await pool.query(
      `SELECT
        p.*,
        u.id_utilisateur,
        u.prenom_utilisateur,
        u.nom_utilisateur,
        t.nom_type_prestataire
      FROM Prestataire p
      JOIN Utilisateur u
        ON p.id_utilisateur = u.id_utilisateur
      JOIN Type_prestataire t
        ON p.type_prestataire_id = t.id_type_prestataire
      ORDER BY p.waitingforadmin, p.nom_prestataire;
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /prestataire/show/{id}:
 *   get:
 *     summary: Récupère le prestataire avec son ID
 *     tags: [Prestataires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du prestataire
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestataire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_prestataire:
 *                   type: integer
 *                 nom_prestataire:
 *                   type: string
 *                 descri_prestataire:
 *                   type: string
 *                 nb_participants:
 *                   type: integer
 *                 tarif_prestataire:
 *                   type: number
 *                 mail_prestataire:
 *                   type: string
 *                 tel_prestataire:
 *                   type: string
 *                 specificite:
 *                   type: string
 *                 waitingForAdmin:
 *                   type: boolean
 *                 type_prestataire_id:
 *                   type: integer
 *                 id_utilisateur:
 *                   type: integer
 *       404:
 *         description: Prestataire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/show/:id", async (req, res) => {
  const idPresta = req.params.id;
  try {
    const result = await pool.query(
      `SELECT * FROM Prestataire
        WHERE id_prestataire = $1`,
      [idPresta]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Prestataire non trouvé" });

    const resultServices = await pool.query(
      `SELECT * FROM Services WHERE prestataire_id = $1`,
      [idPresta]
    );

    res.json({
      prestataire: result.rows[0],
      services: resultServices.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /prestataire/showFilter:
 *   get:
 *     summary: Récupère la liste des prestataires filtrés
 *     description: >
 *       Permet de filtrer les prestataires selon plusieurs critères :
 *       nom, catégorie de service et fourchette de prix.
 *       Tous les paramètres sont optionnels.
 *     tags: [Prestataires]
 *     parameters:
 *       - in: query
 *         name: nom
 *         required: false
 *         description: Filtrer les prestataires par nom (recherche partielle)
 *         schema:
 *           type: string
 *           example: "pizza"
 *
 *       - in: query
 *         name: category
 *         required: false
 *         description: ID du type de prestataire (0 = tous)
 *         schema:
 *           type: integer
 *           example: 2
 *
 *       - in: query
 *         name: prixMin
 *         required: false
 *         description: Prix minimum du prestataire
 *         schema:
 *           type: number
 *           example: 10
 *
 *       - in: query
 *         name: prixMax
 *         required: false
 *         description: Prix maximum du prestataire
 *         schema:
 *           type: number
 *           example: 50
 *
 *     responses:
 *       200:
 *         description: Liste des prestataires correspondant aux filtres
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
 *                   descri_prestataire:
 *                     type: string
 *                   nb_participants:
 *                     type: integer
 *                   tarif_prestataire:
 *                     type: number
 *                   mail_prestataire:
 *                     type: string
 *                   tel_prestataire:
 *                     type: string
 *                   specificite:
 *                     type: string
 *                   waitingForAdmin:
 *                     type: boolean
 *                   type_prestataire_id:
 *                     type: integer
 *                   nom_type_prestataire:
 *                     type: string
 *
 *       500:
 *         description: Erreur serveur
 */
router.get("/showFilter", async (req, res) => {
  const { nom, category, prixMin, prixMax } = req.query;
  try {
    let sql = `
      SELECT
        p.*,
        t.nom_type_prestataire
      FROM Prestataire p
      JOIN Type_prestataire t
        ON p.type_prestataire_id = t.id_type_prestataire
      WHERE 1 = 1 `;
    const values = [];
    let index = 1;

    if (nom) {
      sql += ` AND p.nom_prestataire ILIKE $${index}`;
      values.push(`%${nom}%`);
      index++;
    }

    if (category && category !== "0") {
      sql += ` AND p.type_prestataire_id = $${index}`;
      values.push(Number(category));
      index++;
    }

    if (prixMin) {
      sql += ` AND p.tarif_prestataire >= $${index}`;
      values.push(prixMin);
      index++;
    }

    if (prixMax) {
      sql += ` AND p.tarif_prestataire <= $${index}`;
      values.push(prixMax);
      index++;
    }

    sql += ` ORDER BY p.nom_prestataire`;

    const result = await pool.query(sql, values);

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
    const result = await pool.query(
      "SELECT * FROM Type_prestataire ORDER BY nom_type_prestataire"
    );
    const count = await pool.query(
      `SELECT t.nom_type_prestataire, COUNT(p.id_prestataire) AS nb_prestataires
        FROM Type_prestataire t
        LEFT JOIN Prestataire p
          ON p.type_prestataire_id = t.id_type_prestataire
        GROUP BY t.nom_type_prestataire
        ORDER BY nb_prestataires DESC;
        `
    );

    res.json({
      result: result.rows,
      count: count.rows,
    });
  } catch (err) {
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
    const animations = await pool.query(
      "SELECT * FROM Type_animation ORDER BY nom_type_animation"
    );
    const restaurations = await pool.query(
      "SELECT * FROM Type_restauration ORDER BY nom_type_restauration"
    );
    const boutiques = await pool.query(
      "SELECT * FROM Type_boutique ORDER BY nom_type_boutique"
    );

    res.json({
      animations: animations.rows,
      restaurations: restaurations.rows,
      boutiques: boutiques.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /prestataire/becomePrestataire/{id}:
 *   post:
 *     summary: Crée un prestataire à partir d’un utilisateur
 *     tags: [Prestataires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - descri
 *               - nb_participants
 *               - tarif
 *               - mail
 *               - tel
 *               - specificite
 *               - type
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Atelier peinture"
 *               descri:
 *                 type: string
 *                 example: "Atelier créatif pour enfants"
 *               nb_participants:
 *                 type: integer
 *                 example: 10
 *               tarif:
 *                 type: number
 *                 example: 15
 *               mail:
 *                 type: string
 *                 example: "contact@atelier.fr"
 *               tel:
 *                 type: string
 *                 example: "0612345678"
 *               specificite:
 *                 type: string
 *                 example: "Peinture acrylique"
 *               type:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Prestataire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Prestataire créé avec succès
 *       400:
 *         description: Champs obligatoires manquants
 *       409:
 *         description: L'utilisateur est déjà prestataire
 *       500:
 *         description: Erreur serveur
 */
router.post("/becomePrestataire/:id", async (req, res) => {
  const id_user = req.params.id;
  const { nom, descri, nb_participants, tarif, mail, tel, specificite, type, services } = req.body;
  if ( !nom || !descri || !tarif || !mail || !tel || !specificite || !type || !id_user || services.length === 0)
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
        (nom_prestataire, descri_prestataire, nb_participants, tarif_prestataire, mail_prestataire, tel_prestataire, waitingForAdmin, specificite, message_ajout, id_utilisateur, type_prestataire_id) VALUES
        ($1, $2, $3, $4, $5, $6, true, $7, true, $8, $9)
        RETURNING id_prestataire`,
      [
        nom,
        descri,
        nb_participants,
        tarif,
        mail,
        tel,
        specificite,
        id_user,
        type,
      ]
    );

    const newPresta = result.rows[0];

    if (Array.isArray(services) && services.length > 0) {
      for (const service of services) {
        await client.query(
          `INSERT INTO Services (nom_service, prestataire_id)
          VALUES ($1, $2)`,
          [service, newPresta.id_prestataire]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Prestataire créé avec succès",
      user: {
        id: newPresta.id_utilisateur,
      },
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
});

/**
 * @swagger
 * /prestataire/updatePresta/{id}:
 *   put:
 *     summary: Met à jour les informations d’un prestataire
 *     tags: [Prestataires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - descri
 *               - nb_participants
 *               - tarif
 *               - mail
 *               - tel
 *               - specificite
 *               - type
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Atelier peinture"
 *               descri:
 *                 type: string
 *                 example: "Atelier créatif mis à jour"
 *               nb_participants:
 *                 type: integer
 *                 example: 12
 *               tarif:
 *                 type: number
 *                 example: 20
 *               mail:
 *                 type: string
 *                 example: "contact@atelier.fr"
 *               tel:
 *                 type: string
 *                 example: "0612345678"
 *               specificite:
 *                 type: string
 *                 example: "Peinture à l’huile"
 *               type:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Prestataire modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Prestataire modifié avec succès
 *       400:
 *         description: Champs obligatoires manquants
 *       409:
 *         description: L'utilisateur n'est pas prestataire
 *       500:
 *         description: Erreur serveur
 */
router.put("/updatePresta/:id", async (req, res) => {
  const id_user = req.params.id;
  const { nom, descri, nb_participants, tarif, mail, tel, specificite, type } =
    req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifier si le mail existe déjà
    const checkPresta = await client.query(
      "SELECT id_prestataire FROM Prestataire WHERE id_utilisateur = $1",
      [id_user]
    );

    if (checkPresta.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "Vous n'êtes pas un prestataire",
      });
    }

    const result = await client.query(
      `UPDATE Prestataire
        SET 
            nom_prestataire = $1,
            descri_prestataire = $2,
            nb_participants = $3,
            tarif_prestataire = $4,
            mail_prestataire = $5,
            tel_prestataire = $6,
            waitingForAdmin = true,
            specificite = $7,
            message_ajout = false,
            type_prestataire_id = $8
        WHERE id_utilisateur = $9
        RETURNING id_prestataire;
        `,
      [
        nom,
        descri,
        nb_participants,
        tarif,
        mail,
        tel,
        specificite,
        type,
        id_user,
      ]
    );

    const newPresta = result.rows[0];

    await client.query("COMMIT");

    res.status(201).json({
      message: "Prestataire modifié avec succès",
      user: {
        id: newPresta.id_utilisateur,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Erreur modification prestataire : ", err);
    res.status(500).json({
      error: "Erreur serveur",
    });
  } finally {
    client.release();
  }
});

module.exports = router;
