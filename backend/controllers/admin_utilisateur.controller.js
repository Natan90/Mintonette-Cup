const admin_utilisateurService = require("../services/admin_utilisateur.service");

exports.getUtilisateur = async (req, res) => {
    try {
        const result = await admin_utilisateurService.getUtilisateur();
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

exports.getUtilisateurById = async (req, res) => {
    try {
        const result = await admin_utilisateurService.getUtilisateurById(req.params.id);
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

exports.updateUtilisateurInPresta = async (req, res) => {
    try {
        const result = await admin_utilisateurService.updateUtilisateurInPresta(req.params.id, req.body.valueChange);
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

exports.deleteUtilisateurById = async (req, res) => {
    try {
        const result = await admin_utilisateurService.deleteUtilisateurById(req.params.id);
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "Non authentifié" });
        }
        const result = await admin_utilisateurService.getUtilisateurById(req.session.user.id);

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne" });
    }
}

