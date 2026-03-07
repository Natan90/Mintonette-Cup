exports.validateActivateService = (req, res, next) => {
  const id_service = req.params.id; 

  if (!id_service) {
    return res.status(400).json({ error: "id_service est requis" });
  }

  if (isNaN(id_service)) {
    return res.status(400).json({ error: "id_service doit être un nombre" });
  }

  next();
};

exports.validateAddService = (req, res, next) => {
  const id_prestataire = req.params.id;
  const { nom_service, descri_service, besoin, activate, visible_public, is_activity } = req.body;
  // Validation id_prestataire
  if (!id_prestataire) {
    return res.status(400).json({ error: "id_prestataire est requis" });
  }
  if (isNaN(id_prestataire)) {
    return res.status(400).json({ error: "id_prestataire doit être un nombre" });
  }

  if (!nom_service || nom_service.trim() === "") {
    return res.status(400).json({ error: "nom_service est requis" });
  }

  if (descri_service && typeof descri_service !== "object") {
    return res.status(400).json({ error: "descri_service doit être un objet JSON" });
  }

  if (besoin && typeof besoin !== "object") {
    return res.status(400).json({ error: "besoin doit être un objet JSON" });
  }

  if (activate !== undefined && typeof activate !== "boolean") {
    return res.status(400).json({ error: "activate doit être un booléen" });
  }

  if (visible_public !== undefined && typeof visible_public !== "boolean") {
    return res.status(400).json({ error: "visible_public doit être un booléen" });
  }

  next();
};
