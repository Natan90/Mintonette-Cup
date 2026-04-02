import { defineStore } from "pinia";
import { getRequest, postRequest, putRequest } from "./axios.service";

export const usePrestataireStore = defineStore("prestataire", () => {

  async function GetPrestataires() {
    return getRequest("/prestataire/show");
  }

  async function GetPrestataireByIdPrestataire(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return getRequest(`/prestataire/show/${id_presta}`);
  }

  async function GetPrestataireByIdUtilisateur(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }
    return getRequest(`/prestataire/show/utilisateur/${id_user}`);
  }

  async function BecomePrestataire(id_user, data) {
    if (!id_user) {
      throw new Error("L'id du prestataire est obligatoire");
    }

    return postRequest(`/prestataire/becomePrestataire/${id_user}`, data);
  }

  async function UpdatePrestataire(id_user, data) {
  if (!id_user) {
    throw new Error("L'id utilisateur est obligatoire");
  }

  return postRequest(`/prestataire/updatePrestataire/${id_user}`, data);
  }

  return {
    GetPrestataires,
    GetPrestataireByIdPrestataire,
    GetPrestataireByIdUtilisateur,
    BecomePrestataire,
    UpdatePrestataire,
  };
});
