const express = require("express");
const router = express.Router();
const pool = require("../../database/db");

/**
 * @swagger
 * tags:
 *   name: Administrateur
 *   description: Gestion des utilisateurs (lecture & suppression)
 */


/**
 * @swagger
 * /admin/show:
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
 *       500:
 *         description: Erreur serveur
 */
router.get("/show", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Utilisateur");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /utilisateur/show/{id}:
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
    const result = await pool.query("SELECT * FROM Utilisateur WHERE id_utilisateur=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /utilisateur/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par son ID
 *     tags: [Administrateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
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
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
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
