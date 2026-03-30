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

exports.addCommentaire = async (req, res) => {
  try {
    const { titre_commentaire, texte_commentaire, note_commentaire } = req.body;
    const utilisateur = req.user;

    const result = await commentaireService.addCommentaire({
      nom: utilisateur.nom_utilisateur,
      prenom: utilisateur.prenom_utilisateur,
      titre: titre_commentaire,
      texte: texte_commentaire,
      note: note_commentaire,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.updateCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre_commentaire, texte_commentaire, note_commentaire } = req.body;
    const utilisateur = req.user;

    const result = await commentaireService.updateCommentaire(id, {
      nom: utilisateur.nom_utilisateur,
      prenom: utilisateur.prenom_utilisateur,
      titre: titre_commentaire,
      texte: texte_commentaire,
      note: note_commentaire,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.replyCommentaire = async (req, res) => {
  try {
    if (!req.user?.isadmin) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const { id } = req.params;
    const { reponse_commentaire } = req.body;

    const result = await commentaireService.replyCommentaire(
      id,
      reponse_commentaire,
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.deleteCommentaire = async (req, res) => {
  try {
    if (!req.user?.isadmin) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const { id } = req.params;
    const result = await commentaireService.deleteCommentaire(id);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
