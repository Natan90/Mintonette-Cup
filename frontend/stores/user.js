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


export const useCartStore = defineStore("cart", () => {
  const cartSeats = ref([]);

  const cartTotal = computed(() =>
    cartSeats.value.reduce((sum, seat) => {
      if (["I","H","G"].includes(seat.numero_colonne)) return sum + 25;
      if (["F","E","D"].includes(seat.numero_colonne)) return sum + 18;
      return sum + 12;
    }, 0)
  );

  async function fetchCart() {
    try {
      const res = await axios.get("http://localhost:3000/gradin/panier/show");
      cartSeats.value = res.data;
    } catch (err) {
      console.error(err);
    }
  }

  return { cartSeats, cartTotal, fetchCart };
});
