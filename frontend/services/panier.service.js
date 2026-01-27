import { defineStore } from "pinia";
import { getRequest, postRequest, deleteRequest } from "./axios.service";

export const usePanierStore = defineStore("panier", () => {

    // Mettre des tableaux avec des refs quand on récupère les valeurs depuis les fonctions, 
    // Créer un store en créant des fonctions qui appellent des fonctions qui récupèrent les valeurs depuis l'API


    async function GetPanierByUser(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await getRequest(`/panier/show/${id_user}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function AddToPanier(type, id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await postRequest("/panier/add", {
                type: type,
                id_user: id_user
            });

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function RemoveFromPanier(type, id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await deleteRequest("/panier/delete", {
                type: type,
                id_user: id_user
            });

            return res;
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