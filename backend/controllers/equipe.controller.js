const matchService = require("../services/equipe.service");

exports.showPays = async (req, res) => {
  try {
    const result = await matchService.getPays();
    return res.json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.showPlayers = async (req, res) => {
  try {
    const result = await matchService.getPlayer();
    return res.json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.showMatches = async (req, res) => {
  try {
    const result = await matchService.getMatch();
    return res.json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.showMatchByTerrain = async (req, res) => {
  const idTerrain = req.params.id;

  try {
    const result = await matchService.getMatchById(idTerrain);
    return res.json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
