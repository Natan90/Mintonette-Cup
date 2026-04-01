import { defineStore } from "pinia";
import { getRequest, postRequest } from "./axios.service";

export const useMailBoxStore = defineStore("mailbox", () => {
  async function getMessagesById(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }

    return getRequest(`/mailbox/message/${id_user}/received`);
  }

  async function getMessagesByIdMessage(id_message, isReceived) {
    if (!id_message) {
      throw new Error("L'id du message est obligatoire");
    }

    return getRequest(`/mailbox/message/${id_message}/select`, {
      params: { isReceived },
    });
  }

  async function updateMessageById(id_user, id_message) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }
    if (!id_message) {
      throw new Error("L'id du message est obligatoire");
    }

    return postRequest(`/mailbox/message/${id_user}/read`, {
      id_message,
    });
  }
  
  async function removeMessageById(id_user, id_message) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }
    if (!id_message) {
      throw new Error("L'id du message est obligatoire");
    }

    return postRequest(`/mailbox/message/${id_user}/delete`, {
      id_message,
    });
  }
  async function sendMessageTo(
    id_user_from,
    { id_user_to, subject, message, id_type_message },
  ) {
    if (!id_user_from) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }

    if (!id_user_to || !subject || !message || !id_type_message) {
      throw new Error("Champs obligatoires manquants");
    }

    return postRequest(`/mailbox/message/${id_user_from}/send`, {
      id_user_to: id_user_to,
      subject: subject,
      message: message,
      id_type_message: id_type_message,
    });
  }

  return {
    getMessagesById,
    getMessagesByIdMessage,
    updateMessageById,
    sendMessageTo,
    removeMessageById,
  };
});
