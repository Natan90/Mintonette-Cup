const pool = require("../database/db");


async function getCommentaire(){
      const result = await pool.query(
      `
      SELECT 
      c.id_commentaire,
      c.texte_commentaire,
      c.note_commentaire,
      c.date_commentaire

      FROM Commentaire c
      WHERE c.id_commentaire = $1
      ORDER BY c.id_commentaire
      `,
    );

    return result.rows;
};


module.exports = {
   getCommentaire
}