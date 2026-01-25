const panierService = require("../services/panier.service");

exports.getPanier = async (req, res) => {
  try {
    const { id_user } = req.params;
    const result = await panierService.getPanierByUser(id_user);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.addPanier = async (req, res) => {
  try {
    const { type, id_user } = req.body;

    if (type === "siege") {
      const { matchId, numero_colonne, numero_ligne, zone } = req.body;
      const result = await panierService.addSiege(id_user, matchId, numero_colonne, numero_ligne, zone);
      return res.status(201).json(result);
    }

    if (type === "service") {
      const { service_id, quantite } = req.body;
      const result = await panierService.addService(id_user, service_id, quantite);
      return res.status(201).json(result);
    }

    return res.status(400).json({ error: "Type invalide" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.removeSiege = async (req, res) => {
  try {
    const { id_panier, numero_colonne, numero_ligne, zone, matchId } = req.body;
    await panierService.removeSiege(id_panier, numero_colonne, numero_ligne, zone, matchId);
    res.json({ message: "Siège retiré du panier" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deletePanier = async (req, res) => {
    try {
        const { type, id_user } = req.body;

        if (type === "siege") {
            const { matchId, numero_colonne, numero_ligne, zone } = req.body;
            const result = await panierService.removeSiege(id_user, matchId, numero_colonne, numero_ligne, zone);
            return res.status(201).json(result);
        }

        if (type === "service") {
            const { service_id, quantite } = req.body;
            const result = await panierService.removeService(id_user, service_id, quantite);
            return res.status(201).json(result);
        }

        return res.status(400).json({ error: "Type invalide" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
