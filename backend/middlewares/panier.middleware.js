exports.validateAdd = (req, res, next) => {
  const id_user = req.params.id;
  const { type } = req.body;

  if (!type || !["siege", "activite"].includes(type)) {
    return res
      .status(400)
      .json({ error: "Type invalide, doit être 'siege' ou 'activite'" });
  }

  if (!id_user) {
    return res.status(400).json({ error: "id_user requis" });
  }

  if (type === "siege") {
    const { matchId, numero_colonne, numero_ligne, zone } = req.body;
    if (!matchId || numero_colonne == null || numero_ligne == null || !zone) {
      return res.status(400).json({ error: "Données siège manquantes" });
    }
  }

  if (type === "activite") {
    const { id_activite } = req.body;
    if (!id_activite) {
      return res
        .status(400)
        .json({ error: "id_activite requis pour une activité" });
    }
  }

  next();
};

exports.validateRemove = (req, res, next) => {
  const id_user = req.params.id;
  const { type } = req.body;

  if (!type || !["siege", "service"].includes(type)) {
    return res
      .status(400)
      .json({ error: "Type invalide, doit être 'siege' ou 'service'" });
  }

  if (!id_user) {
    return res.status(400).json({ error: "id_user requis" });
  }

  if (type === "siege") {
    const { matchId, numero_colonne, numero_ligne, zone } = req.body;
    if (!matchId || numero_colonne == null || numero_ligne == null || !zone) {
      return res
        .status(400)
        .json({ error: "Données siège manquantes pour la suppression" });
    }
  }

  if (type === "service") {
    const { service_id, quantite } = req.body;
    if (!service_id) {
      return res
        .status(400)
        .json({ error: "service_id requis pour un service" });
    }
    if (quantite && typeof quantite !== "number") {
      return res.status(400).json({ error: "quantite doit être un nombre" });
    }
  }

  next();
};

exports.validatePay = (req, res, next) => {
  const id_user = req.params.id;
  const { sieges, services, total } = req.body;

  if (!id_user) {
    return res.status(400).json({ error: "id_user requis" });
  }

  if (!total) {
    return res.status(400).json({ error: "Il n'y a pas de total" });
  }

  if (!sieges && !services) {
    return res.status(400).json({ error: "Il n'y a rien a acheté" });
  }

  next();
};

exports.valideBillets = (req, res, next) => {
  const id_user = req.params.id;

  if (!id_user) {
    return res.status(400).json({ error: "id_user requis" });
  }

  next();
};

exports.validateDeleteBillet = (req, res, next) => {
  const id_user = req.params.id;
  const { id_commande, match_id, numero_colonne, numero_ligne, zone } =
    req.body;

  if (!id_user) {
    return res.status(400).json({ error: "id_user requis" });
  }

  if (
    !id_commande ||
    !match_id ||
    numero_colonne == null ||
    numero_ligne == null ||
    !zone
  ) {
    return res
      .status(400)
      .json({ error: "Toutes les données du billet sont requises" });
  }

  next();
};
