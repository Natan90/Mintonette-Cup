exports.valideResetPassword = (req, res, next) => {
    const { mail, prenom_utilisateur } = req.body;

    if (!login) {
        return res.status(400).json({ error: "Le login est manquant" });
    }

    next();
}