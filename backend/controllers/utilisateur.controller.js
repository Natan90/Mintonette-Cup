const utilisateurService = require("../services/utilisateur.service");

exports.generateToken = (user) => {
  return utilisateurService.generateToken(user);
};

exports.inscriptionUtilisateur = async (req, res) => {
  try {
    const result = await utilisateurService.inscriptionUtilisateur(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.connexionUtilisateur = async (req, res) => {
  const { login, mdp } = req.body;

  try {
    const result = await utilisateurService.connexionUtilisateur({
      login,
      mdp,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.updateUtilisateur = async (req, res) => {
  try {
    const id_user = req.params.id;
    const result = await utilisateurService.updateUtilisateur(
      id_user,
      req.body,
    );
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
