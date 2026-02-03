import { defineStore } from "pinia";
import { postRequest } from "./axios.service";

export const useUtilisateurAuthStore = defineStore("utilisateur_auth", () => {

  async function InscriptionUtilisateur(utilisateur) {
    return postRequest("/utilisateur/auth/inscription", {
      ...utilisateur,
    });
  }

  async function ConnexionUtilisateur(utilisateur) {
    return postRequest("/utilisateur/auth/connexion", {
      ...utilisateur,
    });
  }

  async function UpdateUtilisateur(id_user, utilisateur) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }

    return postRequest(`/utilisateur/auth/update/${id_user}`, {
      ...utilisateur,
    });
  }

  async function ResetPasswordUtilisateur(token, newPassword) {
    if (!newPassword) {
      throw new Error("Le mot de passe est obligatoire");
    }

    return postRequest(`/mail/password/confirm`, {
      token,
      newPassword,
    })
  }

  async function DeconnexionUtilisateur() {
    return postRequest("/utilisateur/auth/logout", {}, { withCredentials: true });
  }

  return {
    InscriptionUtilisateur,
    ConnexionUtilisateur,
    UpdateUtilisateur,
    ResetPasswordUtilisateur,
    DeconnexionUtilisateur,
  };
});
