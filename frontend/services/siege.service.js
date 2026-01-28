import { defineStore } from "pinia";
import { getRequest } from "./axios.service";

export const useSiegeStore = defineStore("siege", () => {

  async function GetSieges() {
    return getRequest("/siege/show");
  }

  async function GetEveryType() {
    return getRequest("/siege/panier/show");
  }

  return {
    GetSieges,
    GetEveryType,
  };
});
