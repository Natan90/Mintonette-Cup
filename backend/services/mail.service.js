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

  const resetLink = process.env.LINK_FRONT + `fr/reset-password/${token}?continueReset=true&mailValue=${encodeURIComponent(mail)}`;

  const subject = "Réinitialisation de votre mot de passe";

  const texteEmail = `
        <p>Bonjour,</p>
        <p>Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte (${mail}).</p>
        <p>Pour définir un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous (valable 1 heure) :</p>
        <p>
          <a href="${resetLink}" style="
            display: inline-block;
            padding: 10px 20px;
            color: white;
            background-color: #1e90ff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          ">Réinitialiser mon mot de passe</a>
        </p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe actuel restera inchangé.</p>
        <p>Merci,<br>L'équipe de la Mintonette Cup</p>
    `;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: mail,
    subject,
    html: texteEmail,
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
