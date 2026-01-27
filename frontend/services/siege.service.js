import { defineStore } from "pinia";
import { getRequest, handleError } from "./axios.service";

export const useSiegeStore = defineStore("siege", () => {
  async function GetSieges() {
    const res = null;
    try {
      res = await getRequest("/siege/show");
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function GetEveryType() {
    const res = null;
    try {
      res = await getRequest("/siege/panier/show");
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  return {
    GetTypePrestataire,
    GetEveryType,
  };
});
