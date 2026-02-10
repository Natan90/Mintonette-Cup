import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useNavigationStore = defineStore("previousRoute", () => {
  const previousRoute = ref(String(localStorage.getItem("previousRoute")));

  watch(previousRoute, (v) => localStorage.setItem("previousRoute", v));

  return { previousRoute };
});