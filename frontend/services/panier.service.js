import { defineStore } from "pinia";
import { getRequest, postRequest, deleteRequest } from "./axios.service";

export const usePanierStore = defineStore("panier", () => {

  async function GetPanierByUser(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }
    return getRequest(`/panier/show/${id_user}`);
  }

  async function AddToPanier(type, addValue, id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }

    return postRequest(`/panier/add/${id_user}`, {
      type,
      ...addValue,
    });
  }

  async function RemoveFromPanier(type, id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }

    return deleteRequest(`/panier/delete/${id_user}`, {
      data: {
        type,
      },
    });
  }

  async function GetBillets(id_user) {
    if (!id_user) {
      throw new Error("L'id de l'utilisateur est obligatoire");
    }

    return getRequest(``)
  }

  return {
    GetPanierByUser,
    AddToPanier,
    RemoveFromPanier,
  };
});
