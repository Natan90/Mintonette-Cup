import { defineStore } from "pinia";
import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from "./axios.service";

export const useAdminAPIStore = defineStore("admin_API", () => {
    
    /* ==========
     UTILISATEUR
    ========== */

    async function GetUtilisateurs() {
        try {
            const res = await getRequest("/admin/utilisateur/show");

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetUtilisateurById(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await getRequest(`/admin/utilisateur/show/${id_user}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function ChangePrestaUtilisateur(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await patchRequest(`/admin/utilisateur/changePresta/${id_user}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function DeleteUtilisateur(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");

        try {
            const res = await deleteRequest(`/admin/utilisateur/delete/${id_user}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    /* ==========
      EVENEMENT
    ========== */

    async function GetEvenement() {
        try {
            const res = await getRequest("/admin/evenement/show");

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function UpdateEvenement(evenement) {
        try {
            const res = await putRequest("/admin/evenement/update", {
                ...evenement
            });

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    /* ==========
     STATISTIQUE
    ========== */

    async function GetStatistiques() {
        try {
            const res = await getRequest("/admin/dashboard/stats");

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    /* ==========
     PRESTATAIRE
    ========== */

    async function ValidePrestataire(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await patchRequest(`/admin/prestataire/validate/${id_presta}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function RefuserPrestataire(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await patchRequest(`/admin/prestataire/refuser/${id_presta}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function DeletePrestataire(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await deleteRequest(`/admin/prestataire/delete/${id_presta}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetZones() {
        try {
            const res = await getRequest("/admin/prestataire/zones");

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function AssignPrestataireZone(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await patchRequest(`/admin/prestataire/assignZone/${id_presta}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    async function UnassignPrestataireZone(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await patchRequest(`/admin/prestataire/unassignZone/${id_presta}`);

            return res;
        } catch (error) {
            handleError(error);
        }
    }

    return {
        GetUtilisateurs,
        GetUtilisateurById,
        ChangePrestaUtilisateur,
        DeleteUtilisateur,
        GetEvenement,
        UpdateEvenement,
        GetStatistiques,
        ValidePrestataire,
        RefuserPrestataire,
        DeletePrestataire,
        GetZones,
        AssignPrestataireZone,
        UnassignPrestataireZone,
    }

})