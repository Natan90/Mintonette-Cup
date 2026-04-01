import { defineStore } from "pinia";
import { getRequest } from "./axios.service";

export const useEquipeStore = defineStore("equipe", () => {
  async function GetMatchById(id_terrain) {
    if (!id_terrain) {
      throw new Error("L'id du terrain est obligatoire");
    }

    return getRequest(`/equipes/showMatchByTerrain/${id_terrain}`);
  }

  async function GetPlayer() {
    return getRequest(`/equipes/showPlayer`);
  }
  return {
    GetMatchById,
    GetPlayer,
  };
});
