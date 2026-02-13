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
      params: { isReceived }
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
      id_message
    })
  }

  return {
    getMessagesById,
    getMessagesByIdMessage,
    updateMessageById,
  };
});
