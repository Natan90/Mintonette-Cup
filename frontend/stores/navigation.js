import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useNavigationStore = defineStore("previousRoute", () => {
  const previousRoute = ref(localStorage.getItem("previousRoute") || null);

  const isPageInforPrestaReload = () => {
    const wasHere = sessionStorage.getItem("wasOnPrestataireInfo");
    sessionStorage.setItem("wasOnPrestataireInfo", "true");
    return !!wasHere;
  };

  watch(previousRoute, (v) => {
    if (v) localStorage.setItem("previousRoute", v);
    else localStorage.removeItem("previousRoute");
  });

  return { previousRoute, isPageInforPrestaReload };
});