import { defineStore } from "pinia";
import { getRequest, postRequest, putRequest, patchRequest, deleteRequest, handleError } from "./axios.service";

export const useAdminAPIStore = defineStore("admin_API", () => {
    
    /* ==========
     UTILISATEUR
    ========== */

    async function GetUtilisateurs() {
        const res = null;
        try {
            res = await getRequest("/admin/utilisateur/show");
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    async function GetUtilisateurById(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");
        const res = null;

        try {
            res = await getRequest(`/admin/utilisateur/show/${id_user}`);
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    async function ChangePrestaUtilisateur(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");
        const res = null;

        try {
            res = await patchRequest(`/admin/utilisateur/changePresta/${id_user}`);
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    async function DeleteUtilisateur(id_user) {
        if (!id_user) handleError("L'id de l'utilisateur est obligatoire");
        const res = null;

        try {
            res = await deleteRequest(`/admin/utilisateur/delete/${id_user}`);
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    /* ==========
      EVENEMENT
    ========== */

    async function GetEvenement() {
        const res = null;
        try {
            res = await getRequest("/admin/evenement/show");
        } catch (error) {
            res = handleError(error);
        }
        return res;
    }

    async function UpdateEvenement(evenement) {
        const res = null;
        try {
            res = await putRequest("/admin/evenement/update", {
                ...evenement
            });
        } catch (error) {
            res = handleError(error);
        }
        return res;
    }

    /* ==========
     STATISTIQUE
    ========== */

    async function GetStatistiques() {
        const res = null;
        try {
            res = await getRequest("/admin/dashboard/stats");
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    /* ==========
     PRESTATAIRE
    ========== */

    async function ValidePrestataire(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");
        const res = null;

        try {
            res = await patchRequest(`/admin/prestataire/validate/${id_presta}`);
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    async function RefuserPrestataire(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");
        const res = null;

        try {
            res = await patchRequest(`/admin/prestataire/refuser/${id_presta}`);
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    async function DeletePrestataire(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");
        const res = null;

        try {
            res = await deleteRequest(`/admin/prestataire/delete/${id_presta}`);
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    async function GetZones() {
        const res = null;
        try {
            res = await getRequest("/admin/prestataire/zones");
        } catch (error) {
            handleError(error);
        }
    }

    async function AssignPrestataireZone(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");
        const res = null;

        try {
            res = await patchRequest(`/admin/prestataire/assignZone/${id_presta}`);
        } catch (error) {
            handleError(error);
        }
        return res;
    }

    async function UnassignPrestataireZone(id_presta) {
        if (!id_presta) handleError("L'id du prestataire est obligatoire");
        const res = null;

        try {
            res = await patchRequest(`/admin/prestataire/unassignZone/${id_presta}`);
        } catch (error) {
            handleError(error);
        }
        return res;
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