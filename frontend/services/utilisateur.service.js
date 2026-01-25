import { defineStore } from "pinia";
import apiAxios from "./axios.service";

export const useUtilisateurAuthStore = defineStore("utilisateur_auth", () => {

    async function InscriptionUtilisateur(utilisateur) {
        try {
            const res = await apiAxios.post("/utilisateur/auth/inscription", {
                ...utilisateur,
            });

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function ConnexionUtilisateur(utilisateur) {
        try {
            const res = await apiAxios.post("/utilisateur/auth/connexion", {
                ...utilisateur
            });

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function UpdateUtilisateur(id_user, utilisateur) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await apiAxios.post(`/utilisateur/auth/update/${id_user}`, {
                ...utilisateur
            });

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

})

export default {
    inscriptionUtilisateur,
    connexionUtilisateur,
    UpdateUtilisateur
}