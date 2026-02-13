const pool = require("../database/db");

async function getMessagesById(id_user) {
  const messageReceived = await pool.query(
    `SELECT 
        m.*,
        t.*
      FROM Mailbox_Message m
      JOIN Type_Message t
      ON m.type_message_id = t.id_type_message
        WHERE m.recipient_id = $1 AND m.is_deleted_by_recipient = FALSE
        ORDER BY m.sent_at DESC`,
    [id_user],
  );

  const messageSent = await pool.query(
    `SELECT 
        m.*,
        t.*
      FROM Mailbox_Message m
      JOIN Type_Message t
      ON m.type_message_id = t.id_type_message
        WHERE m.sender_id = $1 AND m.is_deleted_by_sender = FALSE
        ORDER BY m.sent_at DESC`,
    [id_user],
  );

  const nbMessageNotRead = await pool.query(
    `SELECT COUNT(*)
        FROM Mailbox_Message
        WHERE recipient_id = $1 AND read_at IS NULL AND is_deleted_by_recipient = FALSE`,
    [id_user],
  );

  return {
    result: {
      messageReceived: messageReceived.rows,
      messageSent: messageSent.rows,
      nbMessageNotRead: Number(nbMessageNotRead.rows[0].count),
    },
  };
}

async function getMessagesByIdMessage(id_message, isReceived) {
  let joinSQL = "ON m.recipient_id = u.id_utilisateur";

  if (isReceived) {
    joinSQL = "ON m.sender_id = u.id_utilisateur"
  }

  const message = await pool.query(
    `SELECT 
        m.*,
        t.*,
        u.*
      FROM Mailbox_Message m
      JOIN Type_Message t
      ON m.type_message_id = t.id_type_message
      JOIN Utilisateur u
      ` + joinSQL + `
        WHERE m.id_message = $1
        ORDER BY m.sent_at DESC`,
        [id_message],
  )
  return message.rows[0];
} 

async function sendMessageTo(id_user_exped, id_user_dest) {}

async function updateMessageById(id_user, id_message) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const res = await pool.query(
      `UPDATE Mailbox_Message
        SET 
            read_at = NOW()
            WHERE id_message = $1
            AND recipient_id = $2;`,
      [id_message, id_user],
    );
    await client.query("COMMIT");

    return res.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw { status: 500, message: "Erreur serveur" };
  } finally {
    client.release();
  }
}

module.exports = {
  getMessagesById,
  sendMessageTo,
  updateMessageById,
  getMessagesByIdMessage,
};
