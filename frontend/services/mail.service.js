import { defineStore } from "pinia";
import { postRequest } from "./axios.service";

export const useMailStore = defineStore("mail", () => {
  async function ResetPassword(login) {
    if (!login) {
      throw new Error("Le login de l'utilisateur est obligatoire");
    }
    
    return postRequest(`/mail/password/reset`, {
        login: login,
    });
  }

  return {
    ResetPassword,
  };
});
