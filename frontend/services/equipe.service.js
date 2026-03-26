import { defineStore } from "pinia";
import { getRequest } from "./axios.service";

export const useEquipeStore = defineStore("equipe", () => {
  async function getCommentaire() {
    return getRequest(`/commentaire/showMatchByTerrain/${id_match}`);
  }

  async function GetPlayer() {
    return getRequest(`/equipes/showPlayer`);
  }
  return {
    GetMatchById,
    GetPlayer,
  };
});
