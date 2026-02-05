const type_prestataireService = require("../services/type_prestataire.service");

exports.getTypePrestataire = async (req, res) => {
  try {
    const result = await type_prestataireService.getTypePrestataire();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
