const gradinService = require("../services/gradin.service");

exports.getGradin = async (req, res) => {
  try {
    const id_match = req.params.id;
    const result = await gradinService.getGradinByMatchId(id_match);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.updateGradin = async (req, res) => {
  try {
    const result = await gradinService.updateGradin(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
