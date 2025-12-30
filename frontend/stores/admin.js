import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAdminStore = defineStore("admin", () => {
  const typeTriUser = ref(String(localStorage.getItem("typeTriUser")) || "az");
  const typeTriPresta = ref(String(localStorage.getItem("typeTriPresta")) || "az");

  function setTypeTriUser(value) {
    typeTriUser.value = value;
  }

  function setTypeTriPresta(value) {
    typeTriPresta.value = value;
  }

  watch(typeTriUser, (v) => localStorage.setItem("typeTriUser", v));
  watch(typeTriPresta, (v) => localStorage.setItem("typeTriPresta", v));

  return { typeTriUser, typeTriPresta, setTypeTriUser, setTypeTriPresta };
});