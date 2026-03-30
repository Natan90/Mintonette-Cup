exports.validateCommentaire = (req, res, next) => {
  const { titre_commentaire, texte_commentaire, note_commentaire } = req.body;

  if (!titre_commentaire || !texte_commentaire || !note_commentaire) {
    return res.status(400).json({
      error:
        "Tous les champs (titre_commentaire, texte_commentaire, note_commentaire) sont requis",
    });
  }

  const note = Number(note_commentaire);
  if (
    !Number.isFinite(note) ||
    note < 0.5 ||
    note > 5 ||
    !Number.isInteger(note * 2)
  ) {
    return res.status(400).json({
      error: "La note doit être comprise entre 0,5 et 5 par demi-point",
    });
  }

  next();
};
