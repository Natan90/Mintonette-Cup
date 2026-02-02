import { defineStore } from "pinia";
import { postRequest } from "./axios.service";

export const useMailStore = defineStore("mail", () => {
  async function ResetPassword(mail) {
    if (!mail) {
      throw new Error("Le mail de l'utilisateur est obligatoire");
    }
    
    return postRequest(`/mail/password/reset`, {
        mail: mail,
    });
  }

  return {
    ResetPassword,
  };
});
