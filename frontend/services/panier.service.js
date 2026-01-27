import { defineStore } from "pinia";
import { getRequest, postRequest, deleteRequest, handleError } from "./axios.service";

export const usePanierStore = defineStore("panier", () => {
  // Mettre des tableaux avec des refs quand on récupère les valeurs depuis les fonctions,
  // Créer un store en créant des fonctions qui appellent des fonctions qui récupèrent les valeurs depuis l'API

  async function GetPanierByUser(id_user) {
    if (!id_user) handleError("L'id de l'utilisateur est obligatoire");
    const res = null;

    try {
      res = await getRequest(`/panier/show/${id_user}`);
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function AddToPanier(type, addValue, id_user) {
    if (!id_user) handleError("L'id de l'utilisateur est obligatoire");
    const res = null;

    try {
      res = await postRequest("/panier/add", {
        type: type,
        id_user: id_user,
        ...addValue
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function RemoveFromPanier(type, id_user) {
    if (!id_user) handleError("L'id de l'utilisateur est obligatoire");
    const res = null;

    try {
      res = await deleteRequest("/panier/delete", {
        type: type,
        id_user: id_user,
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }
  return {
    GetPanierByUser,
    AddToPanier,
    RemoveFromPanier,
  };
});
