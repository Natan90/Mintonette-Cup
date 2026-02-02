const mailService = require("../services/mail.service");

exports.resetPassword = async (req, res) => {
  const { mail, prenom_utilisateur } = req.body;

  try { 
    await mailService.resetPassword(mailService, prenom_utilisateur);
    res.json({ message: "Email envoyé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
