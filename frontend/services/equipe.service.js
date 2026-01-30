import { defineStore } from "pinia";
import {
  getRequest,
} from "./axios.service";

export const useEquipeStore = defineStore("equipe", () => {

  async function GetMatchById(id_match) {
    if (!id_match) {
      throw new Error("L'id du match est obligatoire");
    }
    return getRequest(`/equipes/showMatchByTerrain/${id_match}`);
  } 

  return {
    GetMatchById,
  };
});
