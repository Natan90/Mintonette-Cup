const mailService = require("../services/mail.service");
const utilisateurService = require("../services/utilisateur.service");

exports.resetPassword = async (req, res) => {
  const { mail } = req.body;
  console.log("BODY REÇU :", req.body);

  try { 
    await mailService.resetPassword(mail);
    res.json({ message: "Email envoyé avec succès" });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }
};

exports.confirmResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await utilisateurService.resetPassword(token, newPassword);
    return res.status(201).json(result);

  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    res.status(status).json({ error: message });
  }

}
