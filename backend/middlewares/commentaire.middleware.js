exports.validateCommentaire = (req, res, next) => {
  const { texte_commentaire, note_commentaire, date_commentaire } = req.body;

  if (!texte_commentaire || !note_commentaire || !date_commentaire) {
    return res.status(400).json({
      error:
        "Tous les champs (texte_commentaire, note_commentaire, date_commentaire) sont requis",
    });
  }

  next();
};
