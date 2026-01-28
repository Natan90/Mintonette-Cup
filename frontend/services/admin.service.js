import { defineStore } from "pinia";
import {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
} from "./axios.service";

export const useAdminAPIStore = defineStore("admin_API", () => {

  /* ==========
     UTILISATEUR
  ========== */

  async function GetUtilisateurs() {
    return getRequest("/admin/utilisateur/show");
  }

  async function GetUtilisateurById(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }
    return getRequest(`/admin/utilisateur/show/${id_user}`);
  }

  async function ChangePrestaUtilisateur(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }
    return patchRequest(`/admin/utilisateur/changePresta/${id_user}`);
  }

  async function DeleteUtilisateur(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }
    return deleteRequest(`/admin/utilisateur/delete/${id_user}`);
  }

  /* ==========
     EVENEMENT
  ========== */

  async function GetEvenement() {
    return getRequest("/admin/evenement/show");
  }

  async function UpdateEvenement(evenement) {
    return putRequest("/admin/evenement/update", {
      ...evenement,
    });
  }

  /* ==========
     STATISTIQUE
  ========== */

  async function GetStatistiques() {
    return getRequest("/admin/dashboard/stats");
  }

  /* ==========
     PRESTATAIRE
  ========== */

  async function ValidePrestataire(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return patchRequest(`/admin/prestataire/validate/${id_presta}`);
  }

  async function RefuserPrestataire(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return patchRequest(`/admin/prestataire/refuser/${id_presta}`);
  }

  async function DeletePrestataire(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return deleteRequest(`/admin/prestataire/delete/${id_presta}`);
  }

  async function GetZones() {
    return getRequest("/admin/prestataire/zones");
  }

  async function AssignPrestataireZone(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return patchRequest(`/admin/prestataire/assignZone/${id_presta}`);
  }

  async function UnassignPrestataireZone(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return patchRequest(`/admin/prestataire/unassignZone/${id_presta}`);
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
  };
});
