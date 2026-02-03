const pool = require("../database/db");
const bcrypt = require("bcrypt");

const MAX_ATTEMPTS = 3; // Nombre de tentatives maximum de connexion
const WINDOW_MINUTES = 5; // Intervalle de temps en minutes pour les tentatives
const BLOCK_MINUTES = 15; // Blocage temporaire en minutes après nb_tentatives > 3
let blockedAccount = false; // Vérifie si le compte est bloqué

async function inscriptionUtilisateur(utilisateur) {
  const { nom, prenom, login, mdp, mail, tel_utilisateur, sexe } = utilisateur;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifier si le mail existe déjà
    const checkUser = await client.query(
      "SELECT id_utilisateur FROM Utilisateur WHERE mail_utilisateur = $1",
      [mail],
    );

    if (checkUser.rows.length > 0) {
      await client.query("ROLLBACK");

      throw { status: 409, message: "Email déjà utilisé" };
    }

    const passwordHash = await bcrypt.hash(mdp, 10);

    const result = await client.query(
      `INSERT INTO Utilisateur 
            (nom_utilisateur, prenom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, tel_utilisateur, sexe_utilisateur) VALUES
            ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_utilisateur`,
      [nom, prenom, login, passwordHash, mail, tel_utilisateur, sexe],
    );

    const newUser = result.rows[0];

    // Assigner le rôle (user par défaut)

    await client.query("COMMIT");

    return {
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser.id_utilisateur,
      },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function connexionUtilisateur(utilisateur) {
  const { login, mdp } = utilisateur;
  const client = await pool.connect();

  if (blockedAccount) {
    throw { status: 429, message: "Compte temporairement bloqué" };
  }

  try {
    await client.query("BEGIN");


    // Récupérer l'utilisateur
    const userResult = await client.query(
      `SELECT * FROM Utilisateur WHERE login_utilisateur = $1`,
      [login],
    );

    const now = new Date();

    let attemptRes = await client.query(
      `SELECT * FROM Nombre_Connexion WHERE login_tentative = $1`,
      [login],
    );

    let attempt;

    if (attemptRes.rows.length === 0) {
      attempt = {
        login_tentative: login,
        nb_tentative: 0,
        first_attempt_at: now,
        last_attempt_at: now,
        blocked_until: null,
      };

      await client.query(
        `INSERT INTO Nombre_Connexion
         (login_tentative, nb_tentative, first_attempt_at, last_attempt_at, succes, message)
         VALUES ($1, $2, $3, $4, false, 'Tentative initiale')`,
        [login, 0, now, now],
      );
    } else {
      attempt = attemptRes.rows[0];
    }

    if (attempt.blocked_until && attempt.blocked_until > now) {
      await client.query("COMMIT");
      throw { status: 429, message: "Compte temporairement bloqué" };
    }

    // Si l'utilisateur n'existe pas
    if (userResult.rows.length === 0) {
      await updateNombreConnexion(client, attempt, login, now);
      throw { status: 401, message: "Login ou mot de passe incorrect" };
    }
    const user = userResult.rows[0];

    // if (!user.actif) {
    //   // await client.query(
    //   //   `INSERT INTO logs_connexion
    //   //   (utilisateur_id, email_tentative, succes, message)
    //   //   VALUES ($1, $2, false, 'Compte désactivé')`,
    //   //   [user.id, mail]
    //   // );

    //   await client.query("COMMIT");

    //   return res.status(403).json({
    //     error: "Compte désactivé",
    //   });
    // }

    const passwordMatch = await bcrypt.compare(mdp, user.mdp_utilisateur);
    if (!passwordMatch) {
      await updateNombreConnexion(client, attempt, login, now);
      throw { status: 401, message: "Login ou mot de passe incorrect" };
    }

    blockedAccount = false;
    await client.query(
      `UPDATE Nombre_Connexion
       SET nb_tentative = 0,
           first_attempt_at = $2,
           last_attempt_at = $3,
           blocked_until = null,
           succes = true,
           message = 'Connexion réussie'
       WHERE login_tentative = $1`,
      [login, now, now],
    );

    // Générer un token de session
    // const token = uuidv4();
    // const expiresAt = new Date();

    // expiresAt.setHours(expiresAt.getHours() + 24); // 24h

    // Créer la session
    // await client.query(
    //   `INSERT INTO sessions
    //   (utilisateur_id, token, date_expiration)
    //   VALUES ($1, $2, $3)`,
    //   [user.id, token, expiresAt]
    // );

    await client.query("COMMIT");

    return {
      message: "Connexion réussie",
      user: {
        id: user.id_utilisateur,
        login: user.login_utilisateur,
        nom: user.nom_utilisateur,
        prenom: user.prenom_utilisateur,
      },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function updateNombreConnexion(client, attempt, login, now) {
  // Vérifier la fenêtre de temps
  const firstAttempt = new Date(attempt.first_attempt_at);
  const diffMinutes = (now - firstAttempt) / 60000;

  let nbTentatives = attempt.nb_tentative;
  let firstAttemptAt = attempt.first_attempt_at;

  if (diffMinutes > WINDOW_MINUTES) {
    // Réinitialiser la fenêtre
    nbTentatives = 1;
    firstAttemptAt = now;
  } else {
    nbTentatives += 1;
  }

  // Calculer le blocage si max atteint
  let blockedUntil = null;
  if (nbTentatives >= MAX_ATTEMPTS) {
    blockedUntil = new Date(now.getTime() + BLOCK_MINUTES * 60000);
  }

  // Mettre à jour la table
  await client.query(
    `UPDATE Nombre_Connexion
         SET nb_tentative = $2,
             first_attempt_at = $3,
             last_attempt_at = $4,
             blocked_until = $5,
             succes = false,
             message = 'Login ou mot de passe incorrect'
         WHERE login_tentative = $1`,
    [login, nbTentatives, firstAttemptAt, now, blockedUntil],
  );

  await client.query("COMMIT");

  let status = 401;
  if (nbTentatives >= MAX_ATTEMPTS) {
    status = nbTentatives >= MAX_ATTEMPTS ? 429 : 401;
    blockedAccount = true;
  }

  const message = nbTentatives >= MAX_ATTEMPTS ? "Compte temporairement bloqué" : "Login ou mot de passe incorrect";
  throw { status, message };
}


async function updateUtilisateur(id_user, utilisateur) {
  const { nom, prenom, mail, tel_utilisateur, login, sexe, photo_profil } =
    utilisateur;
  const client = await pool.connect();

  await client.query("BEGIN");

  const checkUser = await client.query(
    "SELECT id_utilisateur FROM Utilisateur WHERE id_utilisateur = $1",
    [id_user],
  );

  if (checkUser.rows.length === 0) {
    await client.query("ROLLBACK");
    throw { status: 404, message: "Utilisateur non trouvé" };
  }

  if (mail) {
    const checkEmail = await client.query(
      "SELECT id_utilisateur FROM Utilisateur WHERE mail_utilisateur = $1 AND id_utilisateur != $2",
      [mail, id_user],
    );

    if (checkEmail.rows.length > 0) {
      await client.query("ROLLBACK");
      throw { status: 409, message: "Email déjà utilisé" };
    }
  }

  let photoBuffer = null;
  if (photo_profil) {
    photoBuffer = Buffer.from(photo_profil, "base64");
  }

  const updateQuery = `
      UPDATE Utilisateur 
      SET 
        nom_utilisateur = COALESCE($1, nom_utilisateur),
        prenom_utilisateur = COALESCE($2, prenom_utilisateur),
        mail_utilisateur = COALESCE($3, mail_utilisateur),
        tel_utilisateur = COALESCE($4, tel_utilisateur),
        login_utilisateur = COALESCE($5, login_utilisateur),
        sexe_utilisateur = COALESCE($6, sexe_utilisateur),
        photo_profil_utilisateur = COALESCE($7, photo_profil_utilisateur)
      WHERE id_utilisateur = $8
      RETURNING *
    `;

  const result = await client.query(updateQuery, [
    nom,
    prenom,
    mail,
    tel_utilisateur,
    login,
    sexe,
    photoBuffer,
    id_user,
  ]);

  await client.query("COMMIT");

  return {
    message: "Utilisateur mis à jour avec succès",
    user: {
      id: result.rows[0].id_utilisateur,
      nom: result.rows[0].nom_utilisateur,
      prenom: result.rows[0].prenom_utilisateur,
      mail: result.rows[0].mail_utilisateur,
      tel_utilisateur: result.rows[0].tel_utilisateur,
      login: result.rows[0].login_utilisateur,
      sexe: result.rows[0].sexe_utilisateur,
    },
  };
}

async function resetPassword(token, newPassword) {
  const result = await pool.query(
    `SELECT * FROM Utilisateur
     WHERE reset_token = $1
     AND reset_token_expire > NOW()`,
    [token]
  );

  if (result.rows.length === 0) {
    throw new Error("Lien invalide ou expiré");
  }

  const userId = result.rows[0].id_utilisateur;
  const hash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE Utilisateur
     SET mdp_utilisateur = $1,
         reset_token = NULL,
         reset_token_expire = NULL
     WHERE id_utilisateur = $2`,
    [hash, userId]
  );

  return{ message: "Mot de passe réinitialisé" };
}

module.exports = {
  inscriptionUtilisateur,
  connexionUtilisateur,
  updateUtilisateur,
  resetPassword,
};
