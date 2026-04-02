exports.validatePrestataireByIdUtilisateur = (req, res, next) => {
  const id_user = req.params.id_user;
  
  if (!id_user) {
    return res.status(400).json({ error: "L'id de l'utilisateur est obligatoire" });
  }

  next();
}

exports.validatePrestataireByIdPrestataire = (req, res, next) => {
  const id_presta = req.params.id_presta;
  
  if (!id_presta) {
    return res.status(400).json({ error: "L'id du prestataier est obligatoire" });
  }

  next();
}

exports.validateBecomePresta = (req, res, next) => {
    const { nom, descri, mail, tel, specificite, type } = req.body;

    if (!nom || !descri || !mail || !tel || !specificite || !type) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    next();
};

exports.validateUpdatePresta = (req, res, next) => {
    const { nom, descri, mail, tel, specificite, type } = req.body;

    if (!nom || !descri || !mail || !tel || !specificite || !type) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    next();
};