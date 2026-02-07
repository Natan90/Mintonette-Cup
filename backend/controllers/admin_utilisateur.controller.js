const admin_utilisateurService = require("../services/admin_utilisateur.service");

exports.getUtilisateur = async (req, res) => {
  try {
    const result = await admin_utilisateurService.getUtilisateur();
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur interne";
    res.status(status).json({ error: message });
  }
};

exports.getUtilisateurById = async (req, res) => {
  try {
    const result = await admin_utilisateurService.getUtilisateurById(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur interne";
    res.status(status).json({ error: message });
  }
};

exports.updateUtilisateurInPresta = async (req, res) => {
  try {
    const result = await admin_utilisateurService.updateUtilisateurInPresta(
      req.params.id,
      req.body.valueChange,
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur interne";
    res.status(status).json({ error: message });
  }
};

exports.deleteUtilisateurById = async (req, res) => {
  try {
    const result = await admin_utilisateurService.deleteUtilisateurById(
      req.params.id,
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur interne";
    res.status(status).json({ error: message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    console.log("req.user =", req.user);

    const id_user = req.user.id_utilisateur;
    const result = await admin_utilisateurService.getUtilisateurById(id_user);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur interne";
    res.status(status).json({ error: message });
  }
};
