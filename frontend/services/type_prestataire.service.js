import { defineStore } from "pinia";
import { getRequest } from "./axios.service";

export const useTypePrestataireStore = defineStore("type_prestataire", () => {

  async function GetTypePrestataires() {
    return getRequest("/prestataire/type_prestataire/show");
  }

  return {
    GetTypePrestataires,
  };
});
