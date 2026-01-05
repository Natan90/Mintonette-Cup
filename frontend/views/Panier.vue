<template>
  <NavView />
  <div class="container">
    <div class="panier">
      <h2>Votre panier</h2>
      <div v-if="panier.length === 0">Aucun article dans le panier</div>
      <div v-else>
        <div v-for="(item, index) in panier" :key="index" class="item">
          <div>
            {{ item.numero_colonne }}{{ item.numero_ligne }} (Zone
            {{ item.zone }})
          </div>
          <div>{{ getPrice(item) }} €</div>
        </div>
      </div>
    </div>

    <div class="total">
      <h2>Prix total</h2>
      <div class="montant">{{ total }} €</div>
    </div>
  </div>
  <button @click="pay">payer</button>
  <button @click="reset">Vider le panier</button>
  <button @click="router.back()">Retour au gradin</button>
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const panier = ref([]);

const total = computed(() => {
  return panier.value.reduce((sum, seat) => sum + getPrice(seat), 0);
});

function getPrice(seat) {
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}

async function fetchPanier() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/panier/show");
    panier.value = res.data;
  } catch (err) {
    console.error(err);
  }
}

async function pay() {
  if (panier.value.length === 0) {
    alert("Aucun siège dans le panier.");
    return;
  }

  const confirmPay = confirm(`Voulez-vous payer ${total.value} euros ?`);
  if (!confirmPay) return;

  for (const seat of panier.value) {
    await axios.put("http://localhost:3000/gradin/update", {
      matchId: seat.matchId, 
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      est_reserve: true,
      dans_panier: false,
      id_utilisateur: userStore.userId,
    });
  }

  localStorage.removeItem("selectedSeats");

  await fetchPanier();
}
async function fetchMatches() {
  const res = await axios.get(
    `http://localhost:3000/equipes/match/terrain/${terrainId.value}`
  );
  matches.value = res.data;
  selectedItem.value = 0;
}
async function reset() {
  if (panier.value.length === 0) {
    alert("Le panier est déjà vide");
    return;
  }

  for (const seat of panier.value) {
    await axios.put("http://localhost:3000/gradin/update", {
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      est_reserve: false,
      dans_panier: false,
    });
  }

  await fetchPanier();
}

onMounted(() => {
  fetchPanier();
});
</script>

<style scoped>
.container {
  display: flex;
  gap: 40px;
  padding: 20px;
}
.panier,
.total {
  width: 50%;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.montant {
  font-size: 1.6em;
  font-weight: bold;
}
</style>
