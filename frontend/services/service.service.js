import { defineStore } from "pinia";
import apiAxios from "./axios.service";

export const useServiceStore = defineStore("service", () => {

    async function GetServices() {
        try {
            const res = await apiAxios.get("/prestataire/service/show");

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetServiceById(id_service) {
        if (!id_service) handleError("L'id du service est obligatoire");

        try {
            const res = await apiAxios.get(`/prestataire/service/show/${id_service}`);

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function ActivateService(id_service) {
        if (!id_service) handleError("L'id du service est obligatoire");

        try {
            const res = await apiAxios.patch(`/prestataire/service/activate/${id_service}`)

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