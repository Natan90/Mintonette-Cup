const pool = require("../database/db");

async function getMessagesById(id_user) {
    const messageReceived = await pool.query(
        `SELECT * FROM Mailbox_Message
        WHERE recipient_id = $1 AND is_deleted_by_recipient = FALSE
        ORDER BY sent_at DESC`,
        [id_user]
    );

    const messageSent = await pool.query(
        `SELECT * FROM Mailbox_Message
        WHERE sender_id = $1 AND is_deleted_by_sender = FALSE
        ORDER BY sent_at DESC`,
        [id_user]
    );

    const nbMessageNotRead = await pool.query(
        `SELECT COUNT(*)
        FROM Mailbox_Message
        WHERE recipient_id = $1 AND read_at IS NULL AND is_deleted_by_recipient = FALSE`,
        [id_user]
    );

    return {
        result: {
            messageReceived: messageReceived.rows,
            messageSent: messageSent.rows,
            nbMessageNotRead: Number(nbMessageNotRead.rows[0].count),
        }
    };
};

async function sendMessageTo(id_user_exped, id_user_dest) {

}


module.exports = {
    getMessagesById,
    sendMessageTo,
}