const pool = require("../database/db");

// Trouver un utilisateur par Google ID
async function findUserByGoogleId(googleId) {
  const result = await pool.query(
    'SELECT * FROM Utilisateur WHERE google_id = $1',
    [googleId]
  );
  return result.rows[0];
}

// Trouver un utilisateur par email
async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM Utilisateur WHERE mail_utilisateur = $1',
    [email.toLowerCase()]
  );
  return result.rows[0];
}

// Créer un utilisateur depuis Google
async function createUserFromGoogle({ googleId, email, name, picture }) {
  const [prenom, ...nomParts] = name.split(' ');
  const nom = nomParts.join(' ') || null;

  const result = await pool.query(
    `
    INSERT INTO Utilisateur
    (prenom_utilisateur, nom_utilisateur, mail_utilisateur, google_id, provider)
    VALUES ($1, $2, $3, $4, 'google')
    RETURNING *
    `,
    [
      prenom,
      nom,
      email ? email.toLowerCase() : null,
      googleId
    ]
  );

  return result.rows[0];
}

async function updateUserGoogleId(userId, googleId) {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE Utilisateur SET google_id = $1, provider = 'google' WHERE id_utilisateur = $2`,
      [googleId, userId]
    );
  } finally {
    client.release();
  }
}


module.exports = {
  findUserByGoogleId,
  findUserByEmail,
  createUserFromGoogle,
  updateUserGoogleId
};
