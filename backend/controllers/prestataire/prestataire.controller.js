const prestataireService = require("../../services/prestataire/prestataire.service");

exports.getPrestataire = async (req, res) => {
  try {
    const result = await prestataireService.res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

exports.getPrestataireById = async (req, res) => {
  try {
    const { type, id } = req.body;

    if (type === "utilisateur") {
      const result = await prestataireService.getPrestataireByIdUser(id);
      return res.status(201).json(result);
    }

    if (type === "prestataire") {
      const result = await prestataireService.getPrestataireByIdPrestataire(id);
      return res.status(201).json(result);
    }

    return res.status(400).json({ error: "Type invalide" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getFiltered = async (req, res) => {
  try {
    const result = await prestataireService.filterPrestatairesAndServices(req.query);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.becomePrestataire = async (req, res) => {
  try {
    const id_user = req.params.id;
    const newPresta = await prestataireService.becomePrestataire(id_user, req.body);
    return res.status(201).json({ 
        message: "Prestataire créé avec succès", 
        user: newPresta 
    });

  } catch (err) {m
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Erreur création prestataire : ", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updatePrestataire = async (req, res) => {
    try {
        const id_user = req.params.id;
        const updatePresta = await prestataireService.updatePrestataire(id_user, req.body);
        return res.status(201).json({ 
            message: "Prestataire modifié avec succès", 
            user: updatePresta 
        });

    } catch (err) {

    }
}
