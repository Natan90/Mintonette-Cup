const serviceService = require("../services/service.service");

exports.getServices = async (req, res) => {
  try {
    const result = await serviceService.getServices();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id_service } = req.params.id;
    const result = await panierService.getServiceById(id_service);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.activateServiceById = async (req, res) => {
  try {
    const { id_service } = req.params.id;
    const result = await panierService.activateServiceById(id_service);
    return res.status(201).json(result);

  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Erreur activation service : ", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
