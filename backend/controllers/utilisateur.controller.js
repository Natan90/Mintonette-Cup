const utilisateurService = require("../services/utilisateur.service");

exports.inscriptionUtilisateur = async (req, res) => {
  try {
    const result = await utilisateurService.inscriptionUtilisateur(req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Erreur inscription utilisateur : ", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.connexionUtilisateur = async (req, res) => {
  try {
    const result = await utilisateurService.connexionUtilisateur(req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Erreur connexion utilisateur : ", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateUtilisateur = async (req, res) => {
  try {
    const id_user = req.params;
    const result = await utilisateurService.updateUtilisateur(id_user, req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Erreur connexion utilisateur : ", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
