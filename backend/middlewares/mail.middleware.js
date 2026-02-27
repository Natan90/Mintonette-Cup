exports.valideResetPassword = (req, res, next) => {
    const { mail } = req.body;

    if (!mail) {
        return res.status(400).json({ error: "Le mail est manquant" });
    }

    next();
}

exports.valideConfirmPassword = (req, res, next) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    next();
}

exports.validebilletsQR = (req, res, next) => {
    const id_billet = req.params.id;
    const { mail, user, activity } = req.body; 

    if (isNaN(id_billet)) {
        return res.status(400).json({ error: "ID invalide" });
    }

    if (!mail || !user || !activity) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }
}