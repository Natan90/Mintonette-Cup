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

exports.validateAddArticleByIdService = (req, res, next) => {
  const id_service = req.params.id;
  const { nom, stock, prix } = req.body;

  if (!id_service) {
    return res.status(400).json({ error: "id_service est requis" });
  }
  if (isNaN(id_service)) {
    return res.status(400).json({ error: "id_service doit être un nombre" });
  }

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "nom est requis" });
  }

  if (stock === undefined || stock === null) {
    return res.status(400).json({ error: "stock est requis" });
  }
  if (isNaN(stock) || Number(stock) < 0) {
    return res.status(400).json({ error: "stock doit être un nombre positif" });
  }

  if (prix === undefined || prix === null) {
    return res.status(400).json({ error: "prix est requis" });
  }
  if (isNaN(prix) || Number(prix) < 0) {
    return res.status(400).json({ error: "prix doit être un nombre positif" });
  }

  next();
};

exports.validateAddActiviteByIdService = (req, res, next) => {
  const id_service = req.params.id;
  const { nom, nb_participant, prix, date, heure } = req.body;

  if (!id_service) {
    return res.status(400).json({ error: "id_service est requis" });
  }
  if (isNaN(id_service)) {
    return res.status(400).json({ error: "id_service doit être un nombre" });
  }

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "nom est requis" });
  }

  if (nb_participant === undefined || nb_participant === null) {
    return res.status(400).json({ error: "nb_participant est requis" });
  }
  if (isNaN(nb_participant) || Number(nb_participant) < 1) {
    return res.status(400).json({ error: "nb_participant doit être un nombre supérieur à 0" });
  }

  if (prix === undefined || prix === null) {
    return res.status(400).json({ error: "prix est requis" });
  }
  if (isNaN(prix) || Number(prix) < 0) {
    return res.status(400).json({ error: "prix doit être un nombre positif" });
  }

  if (!date) {
    return res.status(400).json({ error: "date est requise" });
  }
  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "date doit être une date valide" });
  }

  if (!heure) {
    return res.status(400).json({ error: "heure est requise" });
  }

  next();
};
