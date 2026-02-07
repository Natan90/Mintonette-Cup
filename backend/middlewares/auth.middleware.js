const jwt = require('jsonwebtoken');
const userService = require("../services/admin_utilisateur.service");

// Middleware pour vérifier le JWT
exports.authenticateToken = async (req, res, next) => {
    try {
        console.log("🔹 Middleware JWT démarré");

        // Extraire le token du header Authorization
        const authHeader = req.headers['authorization'];
        console.log("🔹 Header Authorization :", authHeader);

        const token = authHeader && authHeader.split(' ')[1];  // Format: "Bearer TOKEN"
        console.log("🔹 Token extrait :", token);

        if (!token) {
            console.log("❌ Pas de token trouvé");
            return res.status(401).json({
                error: "Vous devez être connecté pour accéder à cette ressource"
            });
        }
        
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔹 JWT décodé :", decoded);

        // Récupérer l'utilisateur
        const result = await userService.getUtilisateurById(decoded.userId);
        console.log("🔹 Résultat service getUtilisateurById :", result);

        if (!result) {
            console.log("❌ Utilisateur non trouvé dans la DB");
            return res.status(404).json({
                error: 'Utilisateur non trouvé'
            });
        }

        req.user = result;
        console.log("✅ req.user défini :", req.user);

        next();
    } catch(err) {
        console.error("❌ Erreur dans le middleware JWT :", err);

        if (err.name === 'TokenExpiredError') {
            console.log("❌ Token expiré");
            return res.status(401).json({
                error: 'Token expiré',
                message: 'Votre session a expiré, veuillez vous reconnecter'
            });
        }

        if (err.name === 'JsonWebTokenError') {
            console.log("❌ Token invalide");
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
