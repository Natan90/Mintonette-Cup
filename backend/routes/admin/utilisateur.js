const express = require("express");
const router = express.Router();
const pool = require("../../database/db");


/**
 * @swagger
 * /admin/utilisateur/show:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs
 *     tags: [Administrateur]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_utilisateur:
 *                     type: integer
 *                   nom_utilisateur:
 *                     type: string
 *                   prenom_utilisateur:
 *                     type: string
 *                   login_utilisateur:
 *                     type: string
 *                   mail_utilisateur:
 *                     type: string
 *                   tel_utilisateur:
 *                     type: string
 *                   sexe_utilisateur:
 *                     type: string
 *                   waitingforadmin:
 *                     type: boolean
 *                     description: Indique si l'utilisateur prestataire est en attente de validation
 *       500:
 *         description: Erreur serveur
 */

router.get("/show", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.*,
      p.waitingforadmin 
      FROM Utilisateur u
      LEFT JOIN Prestataire p
      ON p.id_utilisateur = u.id_utilisateur
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
 * /admin/utilisateur/show/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags: [Administrateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_utilisateur:
 *                   type: integer
 *                 nom_utilisateur:
 *                   type: string
 *                 prenom_utilisateur:
 *                   type: string
 *                 login_utilisateur:
 *                   type: string
 *                 mail_utilisateur:
 *                   type: string
 *                 tel_utilisateur:
 *                   type: string
 *                 sexe_utilisateur:
 *                   type: string
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get("/show/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(`
      SELECT u.*,
      p.waitingforadmin 
      FROM Utilisateur u
      LEFT JOIN Prestataire p
      ON p.id_utilisateur = u.id_utilisateur
      WHERE u.id_utilisateur=$1`, 
    [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /admin/utilisateur/changePresta/{id}:
 *   patch:
 *     summary: Change le statut prestataire d’un utilisateur
 *     tags: [Administrateur]
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
 *               - valueChange
 *             properties:
 *               valueChange:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Statut prestataire mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 utilisateur:
 *                   type: object
 *       400:
 *         description: Utilisateur invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.patch("/changePresta/:id", async (req, res) => {
  const idUser = req.params.id;
  const valueChange = req.body.valueChange;

  if (!idUser)
    return res.status(400).json({ error: "Utilisateur invalide" });

  try {
    const result = await pool.query(
      `UPDATE Utilisateur
       SET ispresta = $1
       WHERE id_utilisateur = $2
       RETURNING *`,
      [valueChange, idUser]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({
      message: `Utilisateur mis à jour avec succès`,
      utilisateur: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /admin/utilisateur/delete/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par son ID
 *     tags: [Administrateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 utilisateur:
 *                   type: object
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM Prestataire WHERE id_utilisateur=$1", [id]);
    const result = await pool.query("DELETE FROM Utilisateur WHERE id_utilisateur=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé", utilisateur: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;