exports.validatePrestataireId = (req, res, next) => {
  const { id } = req.params.id;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID prestataire invalide" });
  }
  next();
};

exports.refuserPrestataireById = (req, res, next) => {
  const { id } = req.params.id;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID prestataire invalide" });
  }
  next();
};

exports.deletePrestataireById = (req, res, next) => {
  const { id } = req.params.id;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID prestataire invalide" });
  }
  next();
};

exports.validateAssignZoneById = (req, res, next) => {
  const id_zone = req.params.id;
  const { id_prestataire } = req.body;

  if (!id_prestataire || !id_zone) {
    return res.status(400).json({ error: "ID prestataire et ID zone requis" });
  }

  if (isNaN(id_zone) || id_zone < 1 || id_zone > 32) {
    return res.status(400).json({ error: "ID zone doit être un nombre entre 1 et 32" });
  }

  next();
};

exports.validateUnassignZoneById = (req, res, next) => {
  const { id } = req.params.id;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID prestataire invalide" });
  }
  next();
};
