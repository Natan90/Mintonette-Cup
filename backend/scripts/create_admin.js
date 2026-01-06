const path = require('path');
// DB pool will load backend/.env itself (db.js does explicit dotenv load)
const pool = require('../database/db');
const bcrypt = require('bcrypt');

(async () => {
  const login = 'admin';
  const password = 'admin';
  const mail = 'admin@localhost';
  const nom = 'Admin';
  const prenom = 'Admin';
  const tel = null;
  const sexe = null;

  try {
    const hash = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    try {
      // Ensure role column exists (safe, non-destructive)
      await client.query("ALTER TABLE Utilisateur ADD COLUMN IF NOT EXISTS role_utilisateur VARCHAR(50) DEFAULT 'user'");
      await client.query('BEGIN');
      const check = await client.query(
        'SELECT id_utilisateur FROM Utilisateur WHERE login_utilisateur = $1 OR mail_utilisateur = $2',
        [login, mail]
      );

      if (check.rows.length > 0) {
        const id = check.rows[0].id_utilisateur;
        const res = await client.query(
          `UPDATE Utilisateur SET mdp_utilisateur = $1, role_utilisateur = $2, nom_utilisateur = COALESCE(NULLIF($3, ''), nom_utilisateur), prenom_utilisateur = COALESCE(NULLIF($4, ''), prenom_utilisateur), mail_utilisateur = COALESCE(NULLIF($5, ''), mail_utilisateur) WHERE id_utilisateur = $6 RETURNING *`,
          [hash, 'admin', nom, prenom, mail, id]
        );
        await client.query('COMMIT');
        console.log(`Utilisateur existant mis à jour en admin (id=${res.rows[0].id_utilisateur}). Login: ${login} - mot de passe: ${password}`);
      } else {
        const insert = await client.query(
          `INSERT INTO Utilisateur (nom_utilisateur, prenom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, tel_utilisateur, sexe_utilisateur, role_utilisateur)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id_utilisateur`,
          [nom, prenom, login, hash, mail, tel, sexe, 'admin']
        );
        await client.query('COMMIT');
        console.log(`Nouvel utilisateur admin créé (id=${insert.rows[0].id_utilisateur}). Login: ${login} - mot de passe: ${password}`);
      }
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erreur lors de la création de l\'admin :', err);
    process.exit(1);
  } finally {
    // close pool to allow process to exit
    try { await pool.end(); } catch (e) {}
  }

  process.exit(0);
})();
