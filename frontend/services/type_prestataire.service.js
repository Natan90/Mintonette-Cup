import { defineStore } from "pinia";
import { getRequest, handleError } from "./axios.service";

export const useTypePrestataireStore = defineStore("type_pestataire", () => {
  async function GetTypePrestataires() {
    const res = null;
    try {
      res = await getRequest(
        "/prestataire/type_prestataire/showTypePrestataire",
      );
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function GetEveryType() {
    const res = null;
    try {
      res = await getRequest(
        "/prestataire/type_prestataire/showEveryType",
      );
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  return {
    GetTypePrestataires,
    GetEveryType,
  };
});