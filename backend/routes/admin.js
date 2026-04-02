const express = require("express");
const router = express.Router();
// Prestataire
const admin_prestataireController = require("../controllers/admin_prestataire.controller");
const admin_prestataireMiddleware = require("../middlewares/admin_prestataire.middleware");

// Statistiques
const admin_statistiqueController = require("../controllers/admin_statistiques.controller");

// Evenement
const admin_evenementController = require("../controllers/admin_evenement.controller");
const admin_evenementMiddleware = require("../middlewares/admin_evenement.middleware");

// Utiilisateur
const admin_utilisateurController = require("../controllers/admin_utilisateur.controller");
const admin_utilisateurMiddleware = require("../middlewares/admin_utilisateur.middleware");
const authMiddleware = require("../middlewares/auth.middleware");


// ========= PRESTATAIRE ========= // 

// PATCH valider un prestataire
/**
 * @swagger
 * /prestataire/validate/{id}:
 *   patch:
 *     summary: Valider un prestataire
 *     tags: [Prestataire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestataire validé avec succès
 *       404:
 *         description: Prestataire non trouvé
 */
router.patch("/prestataire/validate/:id", admin_prestataireMiddleware.validatePrestataireId, admin_prestataireController.validatePrestataireById);

// PATCH refuser un prestataire
/**
 * @swagger
 * /prestataire/refuser/{id}:
 *   patch:
 *     summary: Refuser un prestataire
 *     tags: [Prestataire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestataire refusé
 *       404:
 *         description: Prestataire non trouvé
 */
router.patch("/prestataire/refuser/:id", admin_prestataireMiddleware.refuserPrestataireById, admin_prestataireController.refuserPrestataireById);

// DELETE supprimer un prestataire
/**
 * @swagger
 * /prestataire/delete/{id}:
 *   delete:
 *     summary: Supprimer un prestataire
 *     tags: [Prestataire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestataire supprimé
 *       404:
 *         description: Prestataire non trouvé
 */
router.delete("/prestataire/delete/:id", admin_prestataireMiddleware.deletePrestataireById, admin_prestataireController.deletePrestataireById);

// GET récupère les zones des prestataires
/**
 * @swagger
 * /prestataire/zones:
 *   get:
 *     summary: Récupère les zones des prestataires
 *     tags: [Prestataire]
 *     responses:
 *       200:
 *         description: Liste des zones
 */
router.get("/prestataire/zones", admin_prestataireController.getZone);

// PATCH assigne une zone à un prestataire
/**
 * @swagger
 * /prestataire/assignZone/{id}:
 *   patch:
 *     summary: Assigner une zone à un prestataire
 *     tags: [Prestataire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: zone
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id_zone:
 *               type: integer
 *     responses:
 *       200:
 *         description: Zone assignée
 *       404:
 *         description: Prestataire non trouvé
 *       409:
 *         description: Zone déjà occupée
 */
router.patch("/prestataire/assignZone/:id", admin_prestataireMiddleware.validateAssignZoneById, admin_prestataireController.assignZoneById);

// PATCH n'assigne plus une zone à un prestataire
/**
 * @swagger
 * /prestataire/unassignZone/{id}:
 *   patch:
 *     summary: Retirer une zone à un prestataire
 *     tags: [Prestataire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone libérée
 *       404:
 *         description: Prestataire non trouvé
 */
router.patch("/prestataire/unassignZone/:id", admin_prestataireMiddleware.validateUnassignZoneById, admin_prestataireController.unassignZoneById);


// ========= STATISTIQUE ========= // 

// GET récupère les statistiques
/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Récupère les statistiques admin
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Statistiques globales
 */
router.get("/dashboard/stats", admin_statistiqueController.getStatistiques);


// ========= EVENEMENT ========= // 

// GET récupère l'évènement
/**
 * @swagger
 * /evenement/show:
 *   get:
 *     summary: Récupère l'événement
 *     tags: [Evenement]
 *     responses:
 *       200:
 *         description: Événement récupéré
 */
router.get("/evenement/show", admin_evenementController.getEvenement);

// PUT update l'évènement
/**
 * @swagger
 * /evenement/update:
 *   put:
 *     summary: Met à jour l'événement
 *     tags: [Evenement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               descri_fr:
 *                 type: string
 *               descri_en:
 *                 type: string
 *               color:
 *                 type: string
 *               font:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Événement mis à jour
 */
router.put("/evenement/update", admin_evenementMiddleware.validateUpdateEvenement, admin_evenementController.updateEvenement);


// ========= Utilisateur ========= // 

// GET récupère l'utilisateur courrant
/**
 * @swagger
 * /utilisateur/me:
 *   get:
 *     summary: Récupère l'utilisateur connecté
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur courant
 */
router.get("/utilisateur/me", authMiddleware.authenticateToken, admin_utilisateurController.getCurrentUser);

// GET récupère les utilisateurs
/**
 * @swagger
 * /utilisateur/show:
 *   get:
 *     summary: Liste des utilisateurs
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste utilisateurs
 */
router.get("/utilisateur/show", authMiddleware.authenticateToken, admin_utilisateurController.getUtilisateur);

// GET récupère un utilisateur par id
/**
 * @swagger
 * /utilisateur/show/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Non trouvé
 */
router.get("/utilisateur/show/:id", authMiddleware.authenticateToken, admin_utilisateurMiddleware.validateIdParams, admin_utilisateurController.getUtilisateurById);

// PATCH change le statut de prestataire de l'utilisateur
/**
 * @swagger
 * /utilisateur/changePresta/{id}:
 *   patch:
 *     summary: Change le statut prestataire d'un utilisateur
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statut modifié
 */
router.patch("/utilisateur/changePresta/:id", authMiddleware.authenticateToken, admin_utilisateurMiddleware.validateIdParams, admin_utilisateurMiddleware.validateValueChange, admin_utilisateurController.updateUtilisateurInPresta);

// DELETE supprime un utilisateur
/**
 * @swagger
 * /utilisateur/delete/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.delete("/utilisateur/delete/:id", authMiddleware.authenticateToken, admin_utilisateurMiddleware.validateIdParams, admin_utilisateurController.deleteUtilisateurById);

module.exports = router;
