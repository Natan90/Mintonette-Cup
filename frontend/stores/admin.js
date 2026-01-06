import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAdminStore = defineStore("admin", () => {
  const typeTriUser = ref(String(localStorage.getItem("typeTriUser")) || "az");
  const typeTriPresta = ref(String(localStorage.getItem("typeTriPresta")) || "az");
  const services = ref(String(localStorage.getItem("services")) || "az");

  function setTypeTriUser(value) {
    typeTriUser.value = value;
  }

  function setTypeTriPresta(value) {
    typeTriPresta.value = value;
  }

  function setServices(value) {
    services.value = value;
  }

  watch(typeTriUser, (v) => localStorage.setItem("typeTriUser", v));
  watch(typeTriPresta, (v) => localStorage.setItem("typeTriPresta", v));
  watch(services, (v) => localStorage.setItem("services", v));

  return { typeTriUser, typeTriPresta, services, setTypeTriUser, setTypeTriPresta, setServices };
});