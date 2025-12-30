import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUserStore = defineStore("user", () => {
  const userId = ref(Number(localStorage.getItem("userId")) || null);
  const isConnected = ref(localStorage.getItem("isConnected") === "true");

  function setUser(id) {
    userId.value = id;
    isConnected.value = true;
  }

  function logout() {
    userId.value = 0;
    isConnected.value = false;
    localStorage.clear();
  }

  watch(userId, (v) => localStorage.setItem("userId", v));
  watch(isConnected, (v) => localStorage.setItem("isConnected", v));

  return { userId, isConnected, setUser, logout };
});
