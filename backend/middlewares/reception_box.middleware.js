exports.validateGetMessageById = (req, res, next) => {
    const id_user = req.params.id;

    if (!id_user || isNaN(parseInt(id_user))) {
        return res.status(400).json({ error: "ID invalide" });
    }
    req.params.id =  parseInt(id_user);
    next();
};

exports.validateGetMessageByIdMessage = (req, res, next) => {
    const id_message = req.params.id;
    const { isReceived } = req.query;

    if (!id_message || isNaN(parseInt(id_message))) {
        return res.status(400).json({ error: "ID invalide" });
    }

    if (!isReceived) {
        return res.status(400).json({ error: "isReceived est null" });
    }
    req.params.id =  parseInt(id_message);
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