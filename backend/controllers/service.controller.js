const serviceService = require("../services/service.service");

exports.getServices = async (req, res) => {
  try {
    const result = await serviceService.getServices();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const id_service = req.params.id;
    const result = await serviceService.getServiceById(id_service);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.activateServiceById = async (req, res) => {
  try {
    const id_service = req.params.id;
    const result = await serviceService.activateServiceById(id_service);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
