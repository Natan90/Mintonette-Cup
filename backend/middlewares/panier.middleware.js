exports.validateAdd = (req, res, next) => {
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
      return res.status(400).json({ error: "Données siège manquantes" });
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
      return res.status(400).json({ error: "Données siège manquantes pour la suppression" });
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
