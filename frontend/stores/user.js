import { defineStore } from 'pinia';
import { ref } from 'vue';

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


  return { userId, isConnected, isPresta, setUser, setPresta };
});
