const commentaireService = require("../services/commentaire.service");

exports.showCommentaire = async (req, res) => {
  try {
    const result = await commentaireService.getCommentaire();
    return res.json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};



