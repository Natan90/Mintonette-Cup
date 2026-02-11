exports.validateGetMessageById = (req, res, next) => {
    const id_user = req.params.id;

    if (!id_user || isNaN(parseInt(id_user))) {
        return res.status(400).json({ error: "ID invalide" });
    }
    req.params.id =  parseInt(id_user);
    next();
};

exports.validateUpdateMessageById = (req, res, next) => {
    const id_user = req.params.id;
    const { id_message } = req.body;

    if (!id_user || isNaN(parseInt(id_user))) {
        return res.status(400).json({ error: "ID invalide" });
    }
    req.params.id =  parseInt(id_user);

    if (!id_message || isNaN(parseInt(id_message))) {
        return res.status(400).json({ error: "ID invalide" });
    }

    next();
}