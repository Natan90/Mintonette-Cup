import { defineStore } from "pinia";
import { getRequest } from "./axios.service";

export const useSiegeStore = defineStore("siege", () => {

    async function GetSieges() {
        try {
            const res = await getRequest("/siege/show");

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetEveryType() {
        try {
            const res = await getRequest("/siege/panier/show");

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

})

export default {
    GetTypePrestataire,
    GetEveryType
}