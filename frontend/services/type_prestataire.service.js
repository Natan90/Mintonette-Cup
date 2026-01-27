import { defineStore } from "pinia";
import { getRequest } from "./axios.service";

export const useTypePrestataireStore = defineStore("type_pestataire", () => {

    async function GetTypePrestataires() {
        try {
            const res = await getRequest("/prestataire/type_prestataire/showTypePrestataire");

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetEveryType() {
        try {
            const res = await getRequest("/prestataire/type_prestataire/showEveryType");

            return res;
        } catch (error) {
            handleError(error);
        }
    }

})

export default {
    GetTypePrestataires,
    GetEveryType
}