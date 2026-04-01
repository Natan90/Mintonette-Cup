const pool = require("../database/db");

async function getCommentaire() {
  const result = await pool.query(
    `
      SELECT 
      c.id_commentaire,
      c.id_utilisateur,
      c.nom_commentaire,
      c.prenom_commentaire,
      c.titre_commentaire,
      c.texte_commentaire,
      c.reponse_commentaire,
      c.date_reponse_commentaire,
      c.note_commentaire,
      c.date_commentaire

      FROM Commentaire c
      ORDER BY c.id_commentaire
      `,
  );

  return result.rows;
}

async function addCommentaire({
  idUtilisateur,
  nom,
  prenom,
  titre,
  texte,
  note,
}) {
  const result = await pool.query(
    `INSERT INTO Commentaire (
       id_utilisateur,
       nom_commentaire,
       prenom_commentaire,
       titre_commentaire,
       texte_commentaire,
       note_commentaire,
       date_commentaire
     )
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [idUtilisateur, nom, prenom, titre, texte, note],
  );

  return result.rows[0];
}

async function updateCommentaire(
  id_commentaire,
  { idUtilisateur, nom, prenom, titre, texte, note },
) {
  const result = await pool.query(
    `UPDATE Commentaire
       SET nom_commentaire = $1,
           prenom_commentaire = $2,
           titre_commentaire = $3,
           texte_commentaire = $4,
           note_commentaire = $5
     WHERE id_commentaire = $6
       AND id_utilisateur = $7
     RETURNING *`,
    [nom, prenom, titre, texte, note, id_commentaire, idUtilisateur],
  );

  if (result.rows.length === 0) {
    throw {
      status: 403,
      message: "Vous ne pouvez modifier que vos propres commentaires",
    };
  }

  return result.rows[0];
}

async function replyCommentaire(id_commentaire, reponse) {
  const result = await pool.query(
    `UPDATE Commentaire
       SET reponse_commentaire = $1,
           date_reponse_commentaire = NOW()
     WHERE id_commentaire = $2
     RETURNING *`,
    [reponse, id_commentaire],
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "Commentaire non trouvé" };
  }

  return result.rows[0];
}

async function deleteCommentaire(id_commentaire, user) {
  const result = await pool.query(
    `DELETE FROM Commentaire
     WHERE id_commentaire = $1
       AND ($2::boolean = TRUE OR id_utilisateur = $3)
     RETURNING *`,
    [id_commentaire, Boolean(user?.isadmin), user?.id_utilisateur],
  );

  if (result.rows.length === 0) {
    const commentExists = await pool.query(
      `SELECT id_utilisateur
         FROM Commentaire
        WHERE id_commentaire = $1`,
      [id_commentaire],
    );

    if (commentExists.rows.length === 0) {
      throw { status: 404, message: "Commentaire non trouvé" };
    }

    throw {
      status: 403,
      message: "Vous ne pouvez supprimer que vos propres commentaires",
    };
  }

  return result.rows[0];
}

module.exports = {
  getCommentaire,
  addCommentaire,
  updateCommentaire,
  replyCommentaire,
  deleteCommentaire,
};
