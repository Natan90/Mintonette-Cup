const express = require("express");
const router = express.Router();
const pool = require("../../database/db");


/**
 * @swagger
 * /admin/prestataire/validate/{id}:
 *   patch:
 *     summary: Valide un prestataire en attente
 *     tags: [Administrateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du prestataire
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Prestataire validé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: ID invalide
 *       409:
 *         description: Prestataire déjà validé
 *       500:
 *         description: Erreur serveur
 */

router.patch("/validate/:id", async (req, res) => {
  const id_presta = req.params.id;

  if (!id_presta)
    return res.status(400).json({
      error: "La prestation est invalide",
    }); 
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const checkPresta = await client.query(
      "SELECT id_utilisateur FROM Prestataire WHERE id_prestataire = $1 AND waitingforadmin = true",
      [id_presta]
    );  

    if (checkPresta.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Prestataire non trouvé " });
    }

    const idUtilisateur = checkPresta.rows[0].id_utilisateur;

    const result = await client.query(
      `UPDATE Prestataire
        SET
          waitingforadmin = false
        WHERE id_prestataire = $1`,
        [id_presta]
    );

    await client.query(
      "UPDATE Utilisateur SET ispresta = TRUE WHERE id_utilisateur = $1",
      [idUtilisateur]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Prestataire validé avec succès"
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


router.patch("/refuser/:id", async (req, res) => {
  const id_presta = req.params.id;

  if (!id_presta)
    return res.status(400).json({ error: "ID prestataire invalide" });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const checkPresta = await client.query(
      "SELECT id_utilisateur FROM Prestataire WHERE id_prestataire = $1 AND waitingforadmin = true",
      [id_presta]
    );

    if (checkPresta.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Prestataire non trouvé ou déjà validé/refusé" });
    }

    const idUtilisateur = checkPresta.rows[0].id_utilisateur;

    const result = await client.query(
      `UPDATE Prestataire
       SET waitingforadmin = false, 
       refused = true
       WHERE id_prestataire = $1
       RETURNING *`,
      [id_presta]
    );

    await client.query(
      "UPDATE Utilisateur SET ispresta = FALSE WHERE id_utilisateur = $1",
      [idUtilisateur]
    );
    await client.query("COMMIT");

    res.status(200).json({
      message: "Prestataire refusé avec succès",
      prestataire: result.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});



/**
 * @swagger
 * /admin/prestataire/delete/{id}:
 *   delete:
 *     summary: Supprime un prestataire par son ID
 *     tags: [Administrateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du prestataire
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestataire supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 prestataire:
 *                   type: object
 *       404:
 *         description: Prestataire non trouvé
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */

router.delete("/delete/:id", async (req, res) => {
  const id_presta = req.params.id;

  if (!id_presta)
    return res.status(400).json({
      error: "La prestation est invalide",
    }); 

  try {
    await pool.query("DELETE FROM services WHERE prestataire_id = $1", [id_presta]);

    const result = await pool.query("DELETE FROM Prestataire WHERE id_prestataire = $1 RETURNING *", [id_presta]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    const idUtilisateur = result.rows[0].id_utilisateur;

    await pool.query("UPDATE Utilisateur SET ispresta = FALSE WHERE id_utilisateur = $1",[idUtilisateur]);

    res.json({ 
      message: "Prestataire supprimé et utilisateur mis à jour", 
      prestataire: result.rows[0] 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /admin/prestataire/zones:
 *   get:
 *     summary: Récupère toutes les zones avec leur statut d'attribution
 *     tags: [Administrateur]
 *     responses:
 *       200:
 *         description: Liste des zones avec prestataires
 *       500:
 *         description: Erreur serveur
 */
router.get("/zones", async (req, res) => {
  try {
    // Récupérer tous les prestataires avec leur zone
    const result = await pool.query(
      `SELECT p.id_prestataire, p.nom_prestataire, p.id_zone, 
              u.nom_utilisateur, u.prenom_utilisateur
       FROM Prestataire p
       JOIN Utilisateur u ON p.id_utilisateur = u.id_utilisateur
       WHERE p.id_zone IS NOT NULL AND p.waitingforadmin = false`
    );

    // Créer un tableau de 32 zones
    const zones = [];
    for (let i = 1; i <= 32; i++) {
      const prestataire = result.rows.find(p => p.id_zone === i);
      zones.push({
        id_zone: i,
        occupied: !!prestataire,
        prestataire: prestataire || null
      });
    }

    res.status(200).json({ zones });
  } catch (err) {
    console.error("Erreur récupération zones:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


/**
 * @swagger
 * /admin/prestataire/assignzone:
 *   patch:
 *     summary: Attribue une zone à un prestataire
 *     tags: [Administrateur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_prestataire:
 *                 type: integer
 *               id_zone:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Zone attribuée avec succès
 *       409:
 *         description: Zone déjà occupée
 *       500:
 *         description: Erreur serveur
 */
router.patch("/assignzone", async (req, res) => {
  const { id_prestataire, id_zone } = req.body;

  if (!id_prestataire || !id_zone) {
    return res.status(400).json({ error: "ID prestataire et ID zone requis" });
  }

  if (id_zone < 1 || id_zone > 32) {
    return res.status(400).json({ error: "ID zone doit être entre 1 et 32" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifier que le prestataire existe
    const prestaCheck = await client.query(
      "SELECT * FROM Prestataire WHERE id_prestataire = $1",
      [id_prestataire]
    );

    if (prestaCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Prestataire non trouvé" });
    }

    // Vérifier que la zone n'est pas déjà attribuée
    const zoneCheck = await client.query(
      "SELECT * FROM Prestataire WHERE id_zone = $1",
      [id_zone]
    );

    if (zoneCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ 
        error: "Cette zone est déjà attribuée",
        prestataire: zoneCheck.rows[0]
      });
    }

    // Attribuer la zone
    const result = await client.query(
      "UPDATE Prestataire SET id_zone = $1 WHERE id_prestataire = $2 RETURNING *",
      [id_zone, id_prestataire]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Zone attribuée avec succès",
      prestataire: result.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur attribution zone:", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});


/**
 * @swagger
 * /admin/prestataire/unassignzone/{id}:
 *   patch:
 *     summary: Libère la zone d'un prestataire
 *     tags: [Administrateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du prestataire
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone libérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.patch("/unassignzone/:id", async (req, res) => {
  const id_presta = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE Prestataire SET id_zone = NULL WHERE id_prestataire = $1 RETURNING *",
      [id_presta]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prestataire non trouvé" });
    }

    res.status(200).json({
      message: "Zone libérée avec succès",
      prestataire: result.rows[0]
    });
  } catch (err) {
    console.error("Erreur libération zone:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


module.exports = router;