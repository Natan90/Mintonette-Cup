const admin_utilisateurService = require("../services/admin_utilisateur.service");

exports.getUtilisateur = async (req, res) => {
    try {
        const result = await admin_utilisateurService.getUtilisateur();
        return result;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

exports.getUtilisateurById = async (req, res) => {
    try {
        const result = await admin_utilisateurService.getUtilisateurById(req.params);
        return result;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

exports.updateUtilisateurInPresta = async (req, res) => {
    try {
        const result = await admin_utilisateurService.updateUtilisateurInPresta(req.params, req.body.valueChange);
        return result;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

exports.deleteUtilisateurById = async (req, res) => {
    try {
        const result = await admin_utilisateurService.deleteUtilisateurById(req.params);
        return result;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}
