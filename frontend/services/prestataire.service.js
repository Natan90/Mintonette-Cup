import { defineStore } from "pinia";
import { getRequest, postRequest, putRequest } from "./axios.service";

export const usePrestataireStore = defineStore("prestataire", () => {

  async function GetPrestataires() {
    return getRequest("/prestataire/show");
  }

  async function GetPrestataireById(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return getRequest(`/prestataire/show/${id_presta}`);
  }

  async function GetValuesFilter(values) {
    if (values.prixMin < 0) {
      throw new Error("Le prix minimum ne peut pas être négatif");
    }

    const params = {
    type: values.type || "prestataires",
    nom: values.nom || "",
    category: values.category ?? 0,
    prixMin: values.prixMin ?? "",
    prixMax: values.prixMax ?? "",
  };

    return getRequest("/prestataire/showFilter", { params });
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
    GetPrestataireById,
    GetValuesFilter,
    BecomePrestataire,
    UpdatePrestataire,
  };
});
