import { defineStore } from "pinia";
import { getRequest, putRequest, handleError } from "./axios.service";

export const useGradinStore = defineStore("gradin", () => {
  async function GetGradinByMatchId(id_match) {
    if (!id_match) handleError("L'id du match est obligatoire");
    const res = null;

    try {
      res = await getRequest(`/gradin/show/${id_match}`);
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  async function UpdateGradin(gradin) {
    const res = null;
    try {
      res = await putRequest("/gradin/update", {
        ...gradin,
      });
    } catch (error) {
      res = handleError(error);
    }
    return res;
  }

  return {
    GetGradinByMatchId,
    UpdateGradin,
  };
});
