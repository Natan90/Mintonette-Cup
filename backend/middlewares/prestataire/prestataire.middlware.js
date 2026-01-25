exports.validateFilter = (req, res, next) => {
  const { category, prixMin, prixMax, type } = req.query;

  if (type && !["services", "prestataires"].includes(type)) {
    return res.status(400).json({ error: "Type invalide, doit être 'service' ou 'prestataire'" });
  }

  if (prixMin && isNaN(Number(prixMin))) {
    return res.status(400).json({ error: "prixMin doit être un nombre" });
  }

  if (prixMax && isNaN(Number(prixMax))) {
    return res.status(400).json({ error: "prixMax doit être un nombre" });
  }

  if (category && isNaN(Number(category))) {
    return res.status(400).json({ error: "category doit être un nombre" });
  }

  next();
};

exports.validateBecomePresta = (req, res, next) => {
    const { nom, descri, mail, tel, specificite, type, services } = req.body;

    if (!nom || !descri || !mail || !tel || !specificite || !type || services.length === 0) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    next();
};

exports.validateUpdatePresta = (req, res, next) => {
    const { nom, descri, mail, tel, specificite, type, services } = req.body;

    if (!nom || !descri || !mail || !tel || !specificite || !type) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    if (services && !Array.isArray(services)) {
        return res.status(400).json({ error: "Le champ 'services' doit être un tableau" });
    }

    if (services) {
    for (const service of services) {
      if (!service.nom_service) {
        return res.status(400).json({ error: "Chaque service doit avoir un 'nom_service'" });
      }

      if (service.prix && typeof service.prix !== "number") {
        return res.status(400).json({ error: "'prix' d'un service doit être un nombre" });
      }

      if (service.nb_participants && typeof service.nb_participants !== "number") {
        return res.status(400).json({ error: "'nb_participants' d'un service doit être un nombre" });
      }
    }
  }

    next();
};