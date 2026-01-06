import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUserStore = defineStore("user", () => {
  const userId = ref(Number(localStorage.getItem("userId")) || null);
  const prestaId = ref(Number(localStorage.getItem("prestaId")) || null);
  const isConnected = ref(localStorage.getItem("isConnected") === "true");
  const role = ref(localStorage.getItem("userRole") || null);

  function setUser(id) {
    userId.value = id;
    isConnected.value = true;
  }

  function setRole(r) {
    role.value = r;
  }

  function logout() {
    userId.value = 0;
    isConnected.value = false;
    localStorage.clear();
  }

  watch(userId, (v) => localStorage.setItem("userId", v));
  watch(isConnected, (v) => localStorage.setItem("isConnected", v));
  watch(prestaId, (v) => localStorage.setItem("prestaId", v));
  watch(role, (v) => localStorage.setItem("userRole", v));

  return { userId, isConnected, prestaId, role, setUser, setRole, logout };
});
