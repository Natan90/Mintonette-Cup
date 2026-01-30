import { defineStore } from "pinia";
import { getRequest, putRequest } from "./axios.service";

export const useGradinStore = defineStore("gradin", () => {
  async function GetGradinByMatchId(id_match) {
    if (!id_match) {
      throw new Error("L'id du match est obligatoire");
    }
    
    return getRequest(`/gradin/show/${id_match}`);
  }

  async function UpdateGradin(gradin) {
    if (!gradin) {
      throw new Error("Les valeurs du gradin sont obligatoires");
    }

    return putRequest("/gradin/update", {
        ...gradin,
      });
  }

  return {
    GetGradinByMatchId,
    UpdateGradin,
  };
});
