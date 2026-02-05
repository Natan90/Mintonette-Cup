const admin_statistiquesService = require("../services/admin_statistique.service");

exports.getStatistiques = async (req, res) => {
  try {
    const result = await admin_statistiquesService.getStatistiques();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
