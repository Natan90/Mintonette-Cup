exports.validateIdTerrain = (req, res, next) => {
  const { idTerrain } = req.params.id;

  if (!idTerrain || isNaN(idTerrain)) {
    return res.status(400).json({
      error: "idTerrain invalide",
    });
  }

  next();
};
