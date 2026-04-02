const prestataireService = require("../services/prestataire.service");

exports.getPrestataire = async (req, res) => {
  try {
    const result = await prestataireService.getPrestataire();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getPrestataireByIdPrestataire = async (req, res) => {
  try {
    const id_presta = req.params.id_presta;

    const result = await prestataireService.getPrestataireByIdPrestataire(id_presta);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getPrestataireByIdUtilisateur = async (req, res) => {
  try {
    const id_user = req.params.id_user;

    const result = await prestataireService.getPrestataireByIdUtilisateur(id_user);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.becomePrestataire = async (req, res) => {
  try {
    const id_user = req.params.id;
    const newPresta = await prestataireService.becomePrestataire(
      id_user,
      req.body,
    );
    return res.status(201).json({
      message: "Prestataire créé avec succès",
      user: newPresta,
    });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.updatePrestataire = async (req, res) => {
  try {
    const id_user = req.params.id;
    const updatePresta = await prestataireService.updatePrestataire(
      id_user,
      req.body,
    );
    return res.status(201).json({
      message: "Prestataire modifié avec succès",
      user: updatePresta,
    });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};
