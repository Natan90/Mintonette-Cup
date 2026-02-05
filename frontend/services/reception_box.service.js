import { defineStore } from "pinia";
import { getRequest, postRequest } from "./axios.service";

export const useMailBoxStore = defineStore("mailbox", () => {
  async function getMessagesById(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }

    return getRequest(`/mailbox/message/received/${id_user}`);
  }

  return {
    getMessagesById,
  };
});
