<template>
  <NavView />
  <div class="container">
    <div class="panier">
      <h2>Votre panier</h2>
      <div v-if="panier.length === 0" class="emptyCart">
        Aucun article dans le panier
      </div>
      <div v-else>
        <div v-for="(item, index) in panier" :key="index" class="item">
          <div class="item-info">
            <span v-if="item.team1 && item.team2">
              {{ item.team1.substring(0, 3) }} vs
              {{ item.team2.substring(0, 3) }} –
            </span>
            <span class="seatLocation">
              {{ item.numero_colonne }}{{ item.numero_ligne }} (Zone
              {{ item.zone }})
            </span>
          </div>
          <div class="itemPrice">{{ getPrice(item) }} €</div>
        </div>
      </div>
    </div>

    <div class="total">
      <h2>Prix total</h2>
      <div class="montant">{{ total }} €</div>

      <button class="button pay" @click="pay" :disabled="panier.length === 0">
        Payer
      </button>
      <button
        class="button empty"
        @click="reset"
        :disabled="panier.length === 0">
        Vider le panier
      </button>
      <button class="button back" @click="router.back()">
        Retour au gradin
      </button>
    </div>
  </div>
  <button @click="pay">payer</button>
  <button @click="reset">Vider le panier</button>
  <button @click="goBack">Retour au gradin</button>
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { useNavigationStore } from "@/stores/navigation";

const router = useRouter();
const userStore = useUserStore();
const navStore = useNavigationStore();
const panier = ref([]);

const total = computed(() => {
  return panier.value.reduce((sum, seat) => sum + getPrice(seat), 0);
});

function goBack() {
  if (navStore.previousRoute) {
    router.push(navStore.previousRoute);
  }
}

function getPrice(seat) {
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}

async function fetchCart() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/panier/show", {
      params: { id_utilisateur: userStore.userId },
    });
    panier.value = res.data.map((seat) => ({
      ...seat,
      team1: seat.team1_country,
      team2: seat.team2_country,
    }));
  } catch (err) {
    console.error("Erreur lors de la récupération du panier:", err);
  }
}

async function pay() {
  if (panier.value.length === 0) {
    alert("Aucun siège dans le panier.");
    return;
  }

  const confirmPay = confirm(`Voulez-vous payer ${total.value} euros ?`);
  if (!confirmPay) return;

  try {
    for (const seat of panier.value) {
      await axios.put("http://localhost:3000/gradin/update", {
        matchId: seat.match_id,
        numero_colonne: seat.numero_colonne,
        numero_ligne: seat.numero_ligne,
        zone: seat.zone,
        est_reserve: true,
        dans_panier: false,
        id_utilisateur: userStore.userId,
      });
    }

    localStorage.removeItem("selectedSeats");
    alert("Paiement effectué avec succès !");
    await fetchCart();
  } catch (err) {
    console.error("Erreur lors du paiement:", err);
    alert("Une erreur est survenue lors du paiement");
  }
}

async function reset() {
  if (panier.value.length === 0) {
    alert("Le panier est déjà vide");
    return;
  }

  const confirmReset = confirm("Voulez-vous vraiment vider le panier ?");
  if (!confirmReset) return;

  try {
    for (const seat of panier.value) {
      await axios.put("http://localhost:3000/gradin/update", {
        matchId: seat.match_id,
        numero_colonne: seat.numero_colonne,
        numero_ligne: seat.numero_ligne,
        zone: seat.zone,
        est_reserve: false,
        dans_panier: false,
        id_utilisateur: null,
      });
    }

    alert("Panier vidé avec succès");
    await fetchCart();
  } catch (err) {
    console.error("Erreur lors du vidage du panier:", err);
    alert("Une erreur est survenue");
  }
}

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
.container {
  display: flex;
  gap: 40px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.panier,
.total {
  width: 50%;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

.emptyCart {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.seatLocation {
  color: #666;
  font-size: 15px;
}

.itemPrice {
  font-weight: bold;
}

.montant {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}

.button {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pay {
  background-color: #27ae60;
  color: white;
}

.pay:hover {
  background-color: #229954;
}

.empty {
  background-color: #e74c3c;
  color: white;
}

.empty:hover {
  background-color: #c0392b;
}

.back {
  background-color: #95a5a6;
  color: white;
}

.back:hover {
  background-color: #7f8c8d;
}
</style>
