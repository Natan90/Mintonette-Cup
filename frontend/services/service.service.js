import { defineStore } from "pinia";
import { getRequest, patchRequest, postRequest } from "./axios.service";

export const useServiceStore = defineStore("service", () => {

  async function GetServices() {
    return getRequest("/prestataire/service/show");
  }

  async function GetServiceById(id_service) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return getRequest(`/prestataire/service/show/${id_service}`);
  }

  async function ActivateService(id_service) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return patchRequest(`/prestataire/service/activate/${id_service}`);
  }

  async function CreateService(id_prestataire, data) {
    if (!id_prestataire) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return postRequest(`/prestataire/service/add/${id_prestataire}`, {
      ...data
    });
  }

  async function AddArticles(id_service, data) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return postRequest(`/prestataire/service/${id_service}/articles/add`, {
      ...data
    });
  }  

  async function AddActivites(id_service, data) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return postRequest(`/prestataire/service/${id_service}/activites/add`, {
      ...data
    });
  }

  return {
    GetServices,
    GetServiceById,
    ActivateService,
    CreateService,
    AddArticles,
    AddActivites,
  };
});
