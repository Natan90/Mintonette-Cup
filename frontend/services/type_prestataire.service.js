import { defineStore } from "pinia";
import apiAxios from "./axios.service";

export const useTypePrestataireStore = defineStore("type_pestataire", () => {

    async function GetTypePrestataires() {
        try {
            const res = await apiAxios.get("/prestataire/type_prestataire/showTypePrestataire");

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetEveryType() {
        try {
            const res = await apiAxios.get("/prestataire/type_prestataire/showEveryType");

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

})

export default {
    GetTypePrestataires,
    GetEveryType
}