const admin_evenementService = require("../services/admin_evenement.service");

exports.getEvenement = async (req, res) => {
  try {
    const result = await admin_evenementService.getEvenement();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur interne";
    res.status(status).json({ error: message });
  }
};

exports.updateEvenement = async (req, res) => {
  try {
    const result = await admin_evenementService.updateEvenement(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur interne";
    res.status(status).json({ error: message });
  }
};
