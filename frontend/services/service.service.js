import { defineStore } from "pinia";
import { getRequest, patchRequest, handleError } from "./axios.service";

export const useServiceStore = defineStore("service", () => {
  async function GetServices() {
    const res = null;
    try {
      res = await getRequest("/prestataire/service/show");
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function GetServiceById(id_service) {
    if (!id_service) handleError("L'id du service est obligatoire");
    const res = null;

    try {
      res = await getRequest(`/prestataire/service/show/${id_service}`);

    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function ActivateService(id_service) {
    if (!id_service) handleError("L'id du service est obligatoire");
    const res = null;

    try {
      res = await patchRequest(
        `/prestataire/service/activate/${id_service}`,
      );
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  return {
    GetServices,
    GetServiceById,
    ActivateService,
  };
});
