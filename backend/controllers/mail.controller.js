const mailService = require("../services/mail.service");
const utilisateurService = require("../services/utilisateur.service");

exports.resetPassword = async (req, res) => {
  const { mail } = req.body;
  console.log("BODY REÇU :", req.body);

  try { 
    await mailService.resetPassword(mail);
    res.json({ message: "Email envoyé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.confirmResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await utilisateurService.resetPassword(token, newPassword);
    return res.status(201).json(result);

  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }

}
