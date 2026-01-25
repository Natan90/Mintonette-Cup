import { defineStore } from "pinia";
import apiAxios from "./axios.service";

export const userPanierStore = defineStore("panier", () => {

    async function GetPanierByUser(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await apiAxios.get(`/panier/show/${id_user}`);

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function AddToPanier(type, id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await apiAxios.get("/panier/add", {
                type: type,
                id_user: id_user
            });

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function RemoveFromPanier(type, id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await apiAxios.get("/panier/delete", {
                type: type,
                id_user: id_user
            });

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

})

export default {
    GetPanierByUser,
    AddToPanier,
    RemoveFromPanier
}