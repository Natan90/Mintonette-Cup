exports.validateGetGradinByMatchId = (req, res, next) => {
  const id_match = req.params.id;

  if (!id_match) {
    return res.status(400).json({ error: "id_match requis" });
  }

  next();
};

exports.validateUpdateGradin = (req, res, next) => {
  const {matchId, numero_colonne, numero_ligne, zone, est_reserve, id_utilisateur} = req.body;

  if (!matchId || isNaN(matchId)) {
    return res.status(400).json({
      error: "matchId invalide ou manquant",
    });
  }

  if (numero_colonne === undefined && numero_ligne === undefined && !zone) {
    return res.status(400).json({
      error: "Informations de gradin manquantes",
    });
  }

  if (est_reserve !== undefined && typeof est_reserve !== "boolean") {
    return res.status(400).json({
      error: "est_reserve doit être un booléen",
    });
  }

  if (est_reserve && !id_utilisateur) {
    return res.status(400).json({
      error: "id_utilisateur requis pour réserver un gradin",
    });
  }

  next();
};
