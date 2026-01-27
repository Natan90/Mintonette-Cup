import { defineStore } from "pinia";
import { getRequest, patchRequest } from "./axios.service";

export const useServiceStore = defineStore("service", () => {

    async function GetServices() {
        try {
            const res = await getRequest("/prestataire/service/show");

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetServiceById(id_service) {
        if (!id_service) handleError("L'id du service est obligatoire");

        try {
            const res = await getRequest(`/prestataire/service/show/${id_service}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function ActivateService(id_service) {
        if (!id_service) handleError("L'id du service est obligatoire");

        try {
            const res = await patchRequest(`/prestataire/service/activate/${id_service}`)

        } catch (error) {
            handleError(error);
        }
    }

})

export default {
    GetServices,
    GetServiceById,
    ActivateService
}