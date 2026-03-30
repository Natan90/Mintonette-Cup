import { defineStore } from "pinia";
import { getRequest } from "./axios.service";

export const useCommentaire = defineStore("commentaire", () => {
  async function getCommentaire() {
    return getRequest(`/commentaire/showCommentaire/`);
  }

  return {
    getCommentaire,
  };
});
