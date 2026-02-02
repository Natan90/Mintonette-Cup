const pool = require("../database/db");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function resetPassword(mail) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query(
    `UPDATE Utilisateur
     SET reset_token = $1, reset_token_expire = $2
     WHERE mail_utilisateur = $3`,
    [token, expiresAt, mail]
  );

  const resetLink = process.env.LINK_FRONT + `fr/reset-password/${token}`;

  const subject = "Réinitialisation de votre mot de passe";

  const texteEmail = `
        Bonjour,
        Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte (${mail}).
        Pour définir un nouveau mot de passe, veuillez cliquer sur le lien ci-dessous (valable 1 heure) :
        ${resetLink}
        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe actuel restera inchangé.
        Merci,
        L'équipe de la Mintonette Cup
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
