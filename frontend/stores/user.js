import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userId = ref(localStorage.getItem("userId") || 0);
  const isConnected = ref(localStorage.getItem("isConnected") === "true");
  const isPresta = ref(localStorage.getItem("isPresta") === "true");

  function setUser(id) {
    userId.value = id;
    isConnected.value = true;
  }

  function setPresta() {
    isPresta.value = true;
  }

  function logout() {
    userId.value = 0;
    isConnected.value = false;
    isPresta.value = false;
    localStorage.clear();
  }

  watch(userId, v => localStorage.setItem("userId", v))
  watch(isConnected, v => localStorage.setItem("isConnected", v))
  watch(isPresta, v => localStorage.setItem("isPresta", v))

  return { userId, isConnected, isPresta, setUser, setPresta, logout };
});


