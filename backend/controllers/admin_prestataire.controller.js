const adminPrestataireService = require("../services/admin.prestataire_service");

exports.validatePrestataireById = async (req, res) => {
  const id_presta = req.params.id;
  try {
    const result = await adminPrestataireService.validatePrestataireById(id_presta);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

exports.refuserPrestataireById = async (req, res) => {
  const id_presta = req.params.id;

  try {
    const result = await adminPrestataireService.refuserPrestataireById(id_presta);
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.deletePrestataireById = async (req, res) => {
  const id_presta = req.params.id;
  try {
    const result = await adminPrestataireService.deletePrestataireById(id_presta);
    return res.status(201).json(result);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getZone = async (req, res) => {
  try {
    const result = await adminPrestataireService.getZone();
    return res.status(201).json(result);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.assignZoneById = async (req, res) => {
    const id_zone = req.params.id;
    const id_prestataire = req.body;
    try {
        const result = await adminPrestataireService.assignZoneById(id_zone, id_prestataire);
        return res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "Erreur serveur";
        res.status(status).json({ error: message });
    }
};

exports.unassignZoneById = async (req, res) => {
    const id_presta = req.params.id;
    try {
        const result = await adminPrestataireService.unassignZoneById(id_presta);
        return res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "Erreur serveur";
        res.status(status).json({ error: message });
    }
};
