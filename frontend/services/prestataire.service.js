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

  async function BecomePrestataire(prestataire, services) {
    const id_presta = prestataire.id_prestataire;
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }

    return postRequest(`/prestataire/becomePrestataire/${id_presta}`, {
      nom: prestataire.nom_prestataire,
      descri: prestataire.descri_prestataire,
      mail: prestataire.mail_prestataire,
      tel: prestataire.tel_prestataire,
      specificite: prestataire.specificite,
      type: Number(prestataire.id_type_prestataire),
      services,
    });
  }

  async function UpdatePrestataire(prestataire, services) {
    const id_presta = prestataire.id_prestataire;
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }

    return putRequest(`/prestataire/updatePresta/${id_presta}`, {
      nom: prestataire.nom_prestataire,
      descri: prestataire.descri_prestataire,
      mail: prestataire.mail_prestataire,
      tel: prestataire.tel_prestataire,
      specificite: prestataire.specificite,
      type: Number(prestataire.id_type_prestataire),
      services,
    });
  }

  return {
    GetPrestataires,
    GetPrestataireById,
    GetValuesFilter,
    BecomePrestataire,
    UpdatePrestataire,
  };
});
