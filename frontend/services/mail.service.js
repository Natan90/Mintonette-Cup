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

  async function BilletsQR(id_billet, mail, user, activity, sieges) {
    if (!id_billet) {
      throw new Error("Le mail de l'utilisateur est obligatoire");
    }

    if (!mail || !user || !activity || !sieges) {
      throw new Error("Champs obligatoires manquants");
    }

    return postRequest(`/mail/billets/send/${id_billet}`, {
      mail, 
      user, 
      activity,
      sieges
    });
  }

  return {
    ResetPassword,
    BilletsQR,
  };
});
