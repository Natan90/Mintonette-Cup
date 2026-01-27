import { defineStore } from "pinia";
import { getRequest, postRequest, putRequest, handleError } from "./axios.service";

export const usePrestataireStore = defineStore("prestataire", () => {
  async function GetPrestataires() {
    const res = null;
    try {
      res = await getRequest("/prestataire/show");
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function GetPrestataireById(id_presta) {
    if (!id_presta) handleError("L'id du prestataire est obligatoire");
    const res = null;

    try {
      res = await getRequest(`/prestataire/show/${id_presta}`);
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function GetValuesFilter(valueFilter, isServiceView) {
    if (valueFilter.prixMin < 0)
      handleError("Le prix minimum ne peut pas être négatif");
    const res = null;

    try {
      res = await getRequest("/prestataire/showFilter", {
        params: {
          ...valueFilter,
          type: isServiceView ? "services" : "prestataires",
        },
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function BecomePrestataire(prestataire, services) {
    const id_presta = prestataire.id_prestataire;
    if (!id_presta) handleError("L'id du prestataire est obligatoire");
    const res = null;

    try {
      res = await postRequest(
        `/prestataire/becomePrestataire/${id_presta}`,
        {
          nom: prestataire.nom_prestataire,
          descri: prestataire.descri_prestataire,
          mail: prestataire.mail_prestataire,
          tel: prestataire.tel_prestataire,
          specificite: prestataire.specificite,
          type: Number(prestataire.id_type_prestataire),
          services: services,
        },
      );
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function UpdatePrestataire(prestataire, services) {
    const id_presta = prestataire.id_prestataire;
    if (!id_presta) handleError("L'id du prestataire est obligatoire");
    const res = null;

    try {
      res = await putRequest(`/prestataire/updatePresta/${id_presta}`, {
        nom: prestataire.nom_prestataire,
        descri: prestataire.descri_prestataire,
        mail: prestataire.mail_prestataire,
        tel: prestataire.tel_prestataire,
        specificite: prestataire.specificite,
        type: Number(prestataire.id_type_prestataire),
        services: services,
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  return {
    GetPrestataires,
    GetPrestataireById,
    GetValuesFilter,
    BecomePrestataire,
    UpdatePrestataire,
  };
});
