const matchService = require("../services/equipe.service");

exports.showPays = async (req, res) => {
  try {
    const result = await matchService.getPays();
    return res.json(result);
  } catch (err) {
    console.error("Erreur getPays :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.showPlayers = async (req, res) => {
  try {
    const result = await matchService.getPlayer();
    return res.json(result);
  } catch (err) {
    console.error("Erreur getPlayer :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.showMatches = async (req, res) => {
  try {
    const result = await matchService.getMatch();
    return res.json(result);
  } catch (err) {
    console.error("Erreur getMatch :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.showMatchByTerrain = async (req, res) => {
  const { idTerrain } = req.params.id;

  try {
    const result = await matchService.getMatchById(idTerrain);
    return res.json(result);
  } catch (err) {
    console.error("Erreur getMatchById :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
