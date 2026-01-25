const type_prestataireService = require("../services/type_prestataire.service");

exports.getTypePrestataire = async (req, res) => {
  try {
    const result = await type_prestataireService.getTypePrestataire();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
