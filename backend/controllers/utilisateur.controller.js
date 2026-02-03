const session = require("express-session");

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
  const { login, mdp } = req.body;

  try {
    const result = await utilisateurService.connexionUtilisateur({
      login,
      mdp,
    });

    req.session.user = {
      id: result.user.id,
      login: result.user.login,
      nom: result.user.nom,
      prenom: result.user.prenom,
    };

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
    const id_user = req.params.id;

    if (Number(req.session.user.id) !== Number(id_user)) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    const result = await utilisateurService.updateUtilisateur(
      id_user,
      req.body,
    );
    return res.status(201).json(result);
  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Erreur update utilisateur : ", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deconnexionUtilisateur = async (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Erreur lors de la destruction de la session :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      res.clearCookie("userSession");
      return res.json({ message: "Déconnecté" });
    });
  } else {
    res.json({ message: "Déconnecté" });
  }
};