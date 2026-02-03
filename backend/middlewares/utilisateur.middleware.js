exports.validateInscription = (req, res, next) => {
  const { nom, prenom, login, mdp, mail, tel_utilisateur, sexe } = req.body;

  if (!nom || !prenom || !login || !mdp || !mail || !tel_utilisateur || !sexe) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  if (mdp.length < 8) {
    return res.status(400).json({ error: "Le mot de passe doit contenir minimum 8 carcatères" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(mail)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  next();
};

exports.validateConnexion = (req, res, next) => {
  const { login, mdp } = req.body;

  if (!login || !mdp) {
    return res.status(400).json({ error: "Login ou mot de passe requis" });
  }

  next();
};

exports.validateUpdateUtilisateur = (req, res, next) => {
  const id = req.params.id;
  const { nom, prenom, mail, tel_utilisateur, login, sexe, photo_profil } =
    req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  if (!nom && !prenom && !mail && !tel_utilisateur && !login && !sexe && !photo_profil) {
    return res.status(400).json({
      error: "Aucune donnée à mettre à jour",
    });
  }

  if (mail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({ error: "Email invalide" });
    }
  }

  next();
};
