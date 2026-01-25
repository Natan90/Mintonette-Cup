exports.validateActivateService = (req, res, next) => {
  const { id_service } = req.params; 

  if (!id_service) {
    return res.status(400).json({ error: "id_service est requis" });
  }

  if (isNaN(id_service)) {
    return res.status(400).json({ error: "id_service doit être un nombre" });
  }

  next();
};
