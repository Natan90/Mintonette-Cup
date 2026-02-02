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