import { defineStore } from "pinia";
import apiAxios from "./axios.service";

export const useGRadinStore = defineStore("gradin", () => {

    async function GetGradinByMatchId(id_match) {
        if (!id_match) handleError("L'id du match est obligatoire");

        try {
            const res = await apiAxios.get(`/gradin/show/${id_match}`);

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function UpdateGradin(gradin) {
        try {
            const res = await apiAxios.put("/gradin/update", {
                ...gradin
            });

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }


})

export default {
    GetGradinByMatchId,
    UpdateGradin
}