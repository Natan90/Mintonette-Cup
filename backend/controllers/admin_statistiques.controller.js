const admin_statistiquesService = require("../services/admin_statistique.service");

exports.getStatistiques = async (req, res) => {
    try {
        const result = await admin_statistiquesService.getStatistiques();
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}