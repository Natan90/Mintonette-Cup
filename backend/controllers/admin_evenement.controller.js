const admin_evenementService = require("../services/admin_evenement.service");

exports.getEvenement = async (req, res) => {
    try {
        const result = await admin_evenementService.getEvenement();
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.updateEvenement = async (req, res) => {
    try {
        const result = await admin_evenementService.updateEvenement(req.body);
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}
