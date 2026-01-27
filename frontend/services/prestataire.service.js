import { defineStore } from "pinia";
import { getRequest, postRequest, putRequest } from "./axios.service";

export const usePrestataireStore = defineStore("prestataire", () => {
  async function GetPrestataires() {
    try {
      const res = await getRequest("/prestataire/show");

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async function GetPrestataireById(id_presta) {
    if (!id_presta) handleError("L'id du prestataire est obligatoire");

    try {
      const res = await getRequest(`/prestataire/show/${id_presta}`);

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async function GetValuesFilter(valueFilter, isServiceView) {
    if (valueFilter.prixMin < 0)
      handleError("Le prix minimum ne peut pas être négatif");

    try {
      const res = await getRequest("/prestataire/showFilter", {
        params: {
          ...valueFilter,
          type: isServiceView ? "services" : "prestataires",
        },
      });

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async function BecomePrestataire(prestataire, services) {
    const id_presta = prestataire.id_prestataire;
    if (!id_presta) handleError("L'id du prestataire est obligatoire");

    try {
      const res = await postRequest(
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

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async function UpdatePrestataire(prestataire, services) {
    const id_presta = prestataire.id_prestataire;
    if (!id_presta) handleError("L'id du prestataire est obligatoire");

    try {
      const res = await putRequest(`/prestataire/updatePresta/${id_presta}`, {
        nom: prestataire.nom_prestataire,
        descri: prestataire.descri_prestataire,
        mail: prestataire.mail_prestataire,
        tel: prestataire.tel_prestataire,
        specificite: prestataire.specificite,
        type: Number(prestataire.id_type_prestataire),
        services: services,
      });

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  return {
    GetPrestataires,
    GetPrestataireById,
    GetValuesFilter,
    BecomePrestataire,
    UpdatePrestataire,
  };
});
