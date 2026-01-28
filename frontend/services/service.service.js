import { defineStore } from "pinia";
import { getRequest, patchRequest } from "./axios.service";

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

  return {
    GetServices,
    GetServiceById,
    ActivateService,
  };
});
