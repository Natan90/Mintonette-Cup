const pool = require('../database/db');

async function isAdmin(req, res, next) {
  try {
    // Expect a user id in header 'x-user-id' (simple dev auth)
    const userId = req.header('x-user-id') || req.query.userId;
    if (!userId) return res.status(401).json({ error: 'User id manquant' });

    const result = await pool.query(
      'SELECT role_utilisateur FROM Utilisateur WHERE id_utilisateur = $1',
      [userId]
    );

    if (result.rows.length === 0) return res.status(401).json({ error: 'Utilisateur inconnu' });

    const role = result.rows[0].role_utilisateur || 'user';
    if (role !== 'admin') return res.status(403).json({ error: 'Accès refusé: admin requis' });

    // attach role to request for downstream handlers
    req.userRole = role;
    req.userId = Number(userId);
    next();
  } catch (err) {
    console.error('Erreur vérification rôle :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { isAdmin };
