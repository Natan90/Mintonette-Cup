const pool = require("../database/db");
const { v4: uuidv4 } = require("uuid");


async function inscriptionUtilisateur(utilisateur) {
  const { nom, prenom, login, mdp, mail, tel_utilisateur, sexe } = utilisateur;
  const client = await pool.connect();

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
    [nom, prenom, login, mdp, mail, tel_utilisateur, sexe], // mettre passwordHash quand il faudra le crypter
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
}

async function connexionUtilisateur(utilisateur) {
  const { login, mdp } = utilisateur;
  const client = await pool.connect();

  await client.query("BEGIN");

  // Récupérer l'utilisateur
  const userResult = await client.query(
    `SELECT * FROM Utilisateur WHERE login_utilisateur = $1`,
    [login],
  );

  if (userResult.rows.length === 0) {
    // Tentative de connexion échouée
    // Faire le nombre de tentative de connexion
    // await client.query(
    //   `INSERT INTO logs_connexion
    //   (email_tentative, succes, message)
    //   VALUES ($1, false, 'Email inexistant')`,
    //   [mail]
    // );

    await client.query("COMMIT");
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

    // const passwordMatch = await bcrypt.compare(mdp, user.mdp_utilisateur);
    // if (!passwordMatch) {
    //   // await client.query(
    //   //   `INSERT INTO logs_connexion
    //   //   (utilisateur_id, email_tentative, succes, message)
    //   //   VALUES ($1, $2, false, 'Mot de passe incorrect')`,
    //   //   [user.id, mail]
    //   // );

    //   await client.query("COMMIT");

    //   return res.status(401).json({
    //     error: "Email ou mot de passe incorrect",
    //   });
    // }

    // Générer un token de session
    const token = uuidv4();
    const expiresAt = new Date();

    expiresAt.setHours(expiresAt.getHours() + 24); // 24h

    // Créer la session
    // await client.query(
    //   `INSERT INTO sessions
    //   (utilisateur_id, token, date_expiration)
    //   VALUES ($1, $2, $3)`,
    //   [user.id, token, expiresAt]
    // );

    // Logger la connexion réussie
    // await client.query(
    //   `INSERT INTO logs_connexion
    //   (utilisateur_id, email_tentative, succes, message)
    //   VALUES ($1, $2, true, 'Connexion réussie')`,
    //   [user.id, mail]
    // );
  
  await client.query("COMMIT");

  return {
    message: "Connexion réussie",
    token: token,
    user: {
      id: user.id_utilisateur,
      login: user.login_utilisateur,
      nom: user.nom_utilisateur,
      prenom: user.prenom_utilisateur,
    },
    expiresAt: expiresAt,
  };
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
      throw { status: 409, message: "Email déjà utilisé" }

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

module.exports = {
  inscriptionUtilisateur,
  connexionUtilisateur,
  updateUtilisateur,
};
