import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from "axios";

export const useUserStore = defineStore('user', () => {
  const userId = ref(0);
  const isConnected = ref(false);
  const isPresta = ref(false);

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
  }


  return { userId, isConnected, isPresta, setUser, setPresta, logout };
});


