const pool = require("../database/db");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function resetPassword(mail, prenom_utilisateur) {
  const subject = "Réinitialisation de votre mot de passe";

  const texteEmail = `
        Bonjour ${result.rows[0].prenom_utilisateur},
        Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte.
        Pour définir un nouveau mot de passe, veuillez cliquer sur le lien ci-dessous (valable 1 heure) :
        ${resetLink}
        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe actuel restera inchangé.
        Merci,
        L'équipe [Nom de votre application]
    `;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: mail,
    subject,
    text: texteEmail,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail envoyé:", info.response);
    return info;
  } catch (err) {
    console.error("Erreur envoi mail:", err);
    throw err;
  }
}

module.exports = {
  resetPassword,
};
