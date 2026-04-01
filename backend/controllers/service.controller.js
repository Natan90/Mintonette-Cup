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

exports.getServiceByIdService = async (req, res) => {
  try {
    const id_service = req.params.id_service;
    const result = await serviceService.getServiceByIdService(id_service);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getServiceByIdPrestataire = async (req, res) => {
  try {
    const id_presta = req.params.id_presta;
    const result = await serviceService.getServiceByIdPrestataire(id_presta);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getArticleByIdService = async (req, res) => {
  try {
    const id_service = req.params.id;
    const result = await serviceService.getArticleByIdService(id_service);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getActiviteByIdService = async (req, res) => {
  try {
    const id_service = req.params.id;
    const result = await serviceService.getActiviteByIdService(id_service);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getArticleByIdArticle = async (req, res) => {
  try {
    const id_article = req.params.id_article;
    const result = await serviceService.getArticleByIdArticle(id_article);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.getActiviteByIdActivite = async (req, res) => {
  try {
    const id_activite = req.params.id_activite;
    const result = await serviceService.getActiviteByIdActivite(id_activite);
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

exports.addServiceById = async (req, res) => {
  try {
    const id_prestataire = req.params.id;
    const result = await serviceService.createService(id_prestataire, req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.addArticleByIdService = async(req, res) => {
  try {
    const id_service = req.params.id;
    const result = await serviceService.addArticleByIdService(id_service, req.body);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Erreur serveur" });
  }
};

exports.addActiviteByIdService = async(req, res) => {
  try {
    const id_service = req.params.id;
    const result = await serviceService.addActiviteByIdService(id_service, req.body);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Erreur serveur" });
  }
};

exports.deleteServiceById = async(req, res) => {
  try {
    const id_service = req.params.id;
    const result = await serviceService.deleteServiceById(id_service);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Erreur serveur" });
  }
}

exports.deleteArticleById = async(req, res) => {
  try {
    const id_article = req.params.id;
    const result = await serviceService.deleteArticleById(id_article);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Erreur serveur" });
  }
}

exports.deleteActiviteById = async(req, res) => {
  try {
    const id_activite = req.params.id;
    const result = await serviceService.deleteActiviteById(id_activite);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Erreur serveur" });
  }
}

exports.editActiviteById = async(req, res) => {
  try {
    const id_activite = req.params.id;
    const result = await serviceService.editActiviteById(id_activite, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Erreur serveur" });
  }
}

exports.editArticleById = async(req, res) => {
  try {
    const id_article = req.params.id;
    const result = await serviceService.editArticleById(id_article, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Erreur serveur" });
  }
}