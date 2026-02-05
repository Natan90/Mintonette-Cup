exports.validateGetMessageById = (req, res, next) => {
    const id_user = req.params.id;

    if (!id_user || isNaN(parseInt(id_user))) {
        return res.status(400).json({ error: "ID invalide" });
    }

    req.params.id =  parseInt(id_user);
    next();
};