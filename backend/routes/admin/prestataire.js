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


module.exports = router;