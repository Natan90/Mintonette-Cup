import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAdminStore = defineStore("admin", () => {
  const typeTri = ref(String(localStorage.getItem("typeTri")) || "az");

  function setTypeTri(value) {
    typeTri.value = value;
  }

  watch(typeTri, (v) => localStorage.setItem("typeTri", v));

  return { typeTri, setTypeTri };
});