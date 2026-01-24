import { defineStore } from "pinia";
import apiAxios from "./axios.service";

export const usePrestataireStore = defineStore("prestataire", () => {

    async function GetPrestataires() {
        try {
            const res = await apiAxios.get("/prestataire/show");

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetPrestataireById(idPresta) {
        if (!idPresta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await apiAxios.get(`/prestataire/show/${idPresta}`);

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function GetValuesFilter(valueFilter, isServiceView) {
        if (valueFilter.prixMin < 0) handleError("Le prix minimum ne peut pas être négatif");

        try {
            const res = await apiAxios.get("/prestataire/showFilter", {
                params: {
                    ...valueFilter,
                    type: isServiceView ? 'services' : 'prestataires'
                }
            });

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function BecomePrestataire(idPresta) {
        if (!idPresta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await apiAxios.post(`/prestataire/becomePrestataire/${idPresta}`);

            return res.data;
        } catch (error) {
            handleError(error);
        }
    }

    async function UpdatePrestataire(idPresta, prestataire, services) {
        if (!idPresta) handleError("L'id du prestataire est obligatoire");

        try {
            const res = await apiAxios.put(`/prestataire/updatePresta/${idPresta}`, {
                nom: prestataire.nom_prestataire,
                descri: prestataire.descri_prestataire,
                mail: prestataire.mail_prestataire,
                tel: prestataire.tel_prestataire,
                specificite: prestataire.specificite,
                type: Number(prestataire.id_type_prestataire),
                services: services
            })
        } catch (error) {
            handleError(error);
        }
    } 


})

export default {
    GetPrestataires,
    GetPrestataireById,
    GetValuesFilter,
    BecomePrestataire,
    UpdatePrestataire
}