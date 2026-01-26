exports.validateIdParams = (req, res, next) => {
  const id = req.params.id;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID invalide" });
  }
  req.params.id = parseInt(id);
  next();
};

exports.validateValueChange = (req, res, next) => {
  const { valueChange } = req.body;
  if (typeof valueChange !== "boolean") {
    return res.status(400).json({ error: "valueChange doit être un boolean" });
  }
  next();
};
