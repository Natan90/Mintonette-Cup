exports.validateUpdateEvenement = (req, res, next) => {
  const { title, descri_fr, descri_en, color, font, image } = req.body;

  if (!title || !descri_fr || !descri_en || !color || !font || !image) {
    return res.status(400).json({
      error:
        "Tous les champs (title, descri_fr, descri_en, color, font, image) sont requis",
    });
  }

  next();
};
