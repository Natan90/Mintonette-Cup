const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const serviceMiddleware = require("../middlewares/service.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// GET services
/**
 * @swagger
 * /show:
 *   get:
 *     summary: Récupère tous les services avec prestataires, articles et activités
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste complète des services
 */
router.get("/show", serviceController.getServices);

// GET service par id_prestataire
/**
 * @swagger
 * /show/prestataire/{id_presta}:
 *   get:
 *     summary: Récupère les services d’un prestataire
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id_presta
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Services du prestataire
 */
router.get("/show/prestataire/:id_presta", serviceMiddleware.validateServiceByIdPrestataire, serviceController.getServiceByIdPrestataire);

// GET service par id_service
/**
 * @swagger
 * /show/service/{id_service}:
 *   get:
 *     summary: Récupère un service par son ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id_service
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service trouvé
 *       404:
 *         description: Service non trouvé
 */
router.get("/show/service/:id_service", serviceMiddleware.validateServiceByIdService, serviceController.getServiceByIdService);

// GET activite par id_service
/**
 * @swagger
 * /{id}/activite/show:
 *   get:
 *     summary: Récupère les activités d’un service
 *     tags: [Activites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des activités
 */
router.get("/:id/activite/show", serviceMiddleware.validateId, serviceController.getActiviteByIdService);

// GET article par id_service
/**
 * @swagger
 * /{id}/article/show:
 *   get:
 *     summary: Récupère les articles d’un service
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des articles du service
 */
router.get("/:id/article/show", serviceMiddleware.validateId, serviceController.getArticleByIdService);

// GET article par id_article
/**
 * @swagger
 * /article/{id_article}/show:
 *   get:
 *     summary: Récupère un article par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id_article
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
router.get("/article/:id_article/show", serviceMiddleware.validateArticleById, serviceController.getArticleByIdArticle);

// GET activite par id_activite
/**
 * @swagger
 * /activite/{id_activite}/show:
 *   get:
 *     summary: Récupère une activité par ID
 *     tags: [Activites]
 *     parameters:
 *       - in: path
 *         name: id_activite
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activité trouvée
 *       404:
 *         description: Activité non trouvée
 */
router.get("/activite/:id_activite/show", serviceMiddleware.validateActiviteById, serviceController.getActiviteByIdActivite);

// PATCH activer / désactiver le service
/**
 * @swagger
 * /{id}/activate:
 *   patch:
 *     summary: Active ou désactive un service
 *     tags: [Services]
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
 *         description: Service activé/désactivé avec succès
 *       404:
 *         description: Service non trouvé
 */
router.patch("/:id/activate", authMiddleware.authenticateToken, serviceMiddleware.validateId, serviceController.activateServiceById);

// POST créer un service
/**
 * @swagger
 * /{id}/add:
 *   post:
 *     summary: Crée un service pour un prestataire
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_service:
 *                 type: string
 *               descri_service:
 *                 type: string
 *               besoin:
 *                 type: string
 *               activate:
 *                 type: boolean
 *               visible_public:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Service créé
 *       200:
 *         description: Service déjà existant
 */
router.post("/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddService , serviceController.addServiceById);

// POST ajouter une activité
/**
 * @swagger
 * /activites/{id}/add:
 *   post:
 *     summary: Ajoute une activité à un service
 *     tags: [Activites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               nb_participant:
 *                 type: integer
 *               prix:
 *                 type: number
 *               date:
 *                 type: string
 *                 example: "2026-01-01"
 *               heure:
 *                 type: string
 *                 example: "10:00"
 *     responses:
 *       201:
 *         description: Activité créée
 *       200:
 *         description: Activité déjà existante
 */
router.post("/activites/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddActiviteByIdService, serviceController.addActiviteByIdService);

// POST ajouter un article
/**
 * @swagger
 * /articles/{id}/add:
 *   post:
 *     summary: Ajoute un article à un service
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               stock:
 *                 type: integer
 *               prix:
 *                 type: number
 *     responses:
 *       201:
 *         description: Article créé
 *       200:
 *         description: Article déjà existant
 */
router.post("/articles/:id/add", authMiddleware.authenticateToken, serviceMiddleware.validateAddArticleByIdService, serviceController.addArticleByIdService);

// PUT modifier une activité
/**
 * @swagger
 * /activite/{id}/edit:
 *   put:
 *     summary: Modifie une activité
 *     tags: [Activites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               nb_participant:
 *                 type: integer
 *               prix:
 *                 type: number
 *               date:
 *                 type: string
 *               heure:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activité modifiée
 *       404:
 *         description: Activité non trouvée
 */
router.put("/activite/:id/edit", authMiddleware.authenticateToken, serviceMiddleware.validateAddActiviteByIdService, serviceController.editActiviteById);

// PUT modifier un article
/**
 * @swagger
 * /article/{id}/edit:
 *   put:
 *     summary: Modifie un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               stock:
 *                 type: integer
 *               prix:
 *                 type: number
 *     responses:
 *       200:
 *         description: Article modifié
 *       404:
 *         description: Article non trouvé
 */
router.put("/article/:id/edit", authMiddleware.authenticateToken, serviceMiddleware.validateAddArticleByIdService, serviceController.editArticleById);

// DELETE supprimer un service
/**
 * @swagger
 * /{id}/delete:
 *   delete:
 *     summary: Supprime un service (avec ses articles et activités)
 *     tags: [Services]
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
 *         description: Service supprimé
 *       404:
 *         description: Service non trouvé
 */
router.delete("/:id/delete", authMiddleware.authenticateToken, serviceMiddleware.validateId , serviceController.deleteServiceById);

// DELETE supprimer un article
/**
 * @swagger
 * /article/{id}/delete:
 *   delete:
 *     summary: Supprime un article
 *     tags: [Articles]
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
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
router.delete("/article/:id/delete", authMiddleware.authenticateToken, serviceMiddleware.validateId , serviceController.deleteArticleById);

// DELETE supprimer une activite
/**
 * @swagger
 * /activite/{id}/delete:
 *   delete:
 *     summary: Supprime une activité
 *     tags: [Activites]
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
 *         description: Activité supprimée
 *       404:
 *         description: Activité non trouvée
 */
router.delete("/activite/:id/delete", authMiddleware.authenticateToken, serviceMiddleware.validateId , serviceController.deleteActiviteById);


module.exports = router;
