const reception_boxService = require("../services/reception_box.service");

exports.getMessagesById = async (req, res) => {
    try {
        const id_user = req.params.id;
        const result = await reception_boxService.getMessagesById(id_user);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.status || 500;
        const message = err.message || "Erreur interne";
        res.status(status).json({ error: message });
    }
}

exports.getMessagesByIdMessage = async (req, res) => {
    try {
        const id_message = req.params.id;
        const { isReceived } = req.query;
        const result = await reception_boxService.getMessagesByIdMessage(id_message, isReceived);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.status || 500;
        const message = err.message || "Erreur interne";
        res.status(status).json({ error: message });
    }
}

exports.sendMessageTo = async (req, res) => {
    try {
        const id_user_exped = req.params.id;
        const { id_user_dest } = req.body;
        const result = await reception_boxService.sendMessageTo(id_user_exped, id_user_dest);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.status || 500;
        const message = err.message || "Erreur interne";
        res.status(status).json({ error: message });
    }
}

exports.updateMessageById = async (req, res) => {
    try {
        const id_user = req.params.id;
        const { id_message } = req.body;
        const result = await reception_boxService.updateMessageById(id_user, id_message);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.status || 500;
        const message = err.message || "Erreur interne";
        res.status(status).json({ error: message });
    }
}