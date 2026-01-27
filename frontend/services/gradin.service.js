import { defineStore } from "pinia";
import { getRequest, putRequest } from "./axios.service";

export const useGradinStore = defineStore("gradin", () => {

    async function GetGradinByMatchId(id_match) {
        if (!id_match) handleError("L'id du match est obligatoire");

        try {
            const res = await getRequest(`/gradin/show/${id_match}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function UpdateGradin(gradin) {
        try {
            const res = await putRequest("/gradin/update", {
                ...gradin
            });

            return res;
        } catch (error) {
            handleError(error);
        }
    }


})

export default {
    GetGradinByMatchId,
    UpdateGradin
}