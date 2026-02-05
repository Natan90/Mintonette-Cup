const jwt = require('jsonwebtoken');
const userService = require("../services/admin_utilisateur.service");

// Middleware pour vérifier le JWT
exports.authenticateToken = async (req, res, next) => {
    try {
        // Extraire le token du header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];  // Format: "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                error: "Vous devez être connecté pour accéder à cette ressource"
            });
        }
        
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérer l'utilisateur
        const user = await userService.getUtilisateurById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                error: 'Utilisateur non trouvé'
            });
        }
        req.user = user;
        next();
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expiré',
                message: 'Votre session a expiré, veuillez vous reconnecter'
            });
        }

            if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({
                error: 'Token invalide',
                message: 'Le token fourni est invalide'
            });
        }

            res.status(500).json({
            error: 'Erreur serveur',
            message: err.message
        });
    }
}