import { defineStore } from "pinia";
import { postRequest, handleError } from "./axios.service";

export const useUtilisateurAuthStore = defineStore("utilisateur_auth", () => {
  async function InscriptionUtilisateur(utilisateur) {
    const res = null;
    try {
      res = await postRequest("/utilisateur/auth/inscription", {
        ...utilisateur,
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function ConnexionUtilisateur(utilisateur) {
    const res = null;
    try {
      res = await postRequest("/utilisateur/auth/connexion", {
        ...utilisateur,
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function UpdateUtilisateur(id_user, utilisateur) {
    if (!id_user) handleError("L'id de l'utilisateur est obligatoire");
    const res = null;

    try {
      res = await postRequest(`/utilisateur/auth/update/${id_user}`, {
        ...utilisateur,
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  return {
    InscriptionUtilisateur,
    ConnexionUtilisateur,
    UpdateUtilisateur,
  };
});
