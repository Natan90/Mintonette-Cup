const gradinService = require("../services/gradin.service");

exports.getGradin = async (req, res) => {
  try {
    const id_match = req.params;
    const result = await gradinService.getGradinByMatchId(id_match);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

exports.updateGradin = async (req, res) => {
  try {
    const result = await gradinService.updateGradin(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};
