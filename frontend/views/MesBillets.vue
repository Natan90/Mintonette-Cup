<template>
  <div class="mes-billets-page">
    <NavView />
    <div class="content">
      <h1>Mes billets</h1>

      <div v-if="!userStore.isConnected" class="empty">
        <p>Veuillez vous connecter pour consulter vos billets.</p>
      </div>

      <div v-else>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else>
          <div v-if="billets.length === 0" class="empty">
            <p>Vous n'avez aucun billet réservé.</p>
          </div>

          <table v-else class="billets-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Place</th>
                <th>Heure</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, index) in billets" :key="index">
                <td>{{ b.zone }}</td>
                <td>{{ b.numero_colonne }}{{ b.numero_ligne }}</td>
                <td>
                  <span v-if="b.date_match">
                    {{ new Date(b.date_match).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }}
                  </span>
                  <span v-else>—</span>
                </td>
                <td>{{ getPrice(b) }} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { usePanierStore } from "@/services/panier.service";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const userStore = useUserStore();
const panierStore = usePanierStore();
const billets = ref([]);
const loading = ref(false);
const error = ref(null);

function getPrice(seat) {
  // same pricing logic as Checkout
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}


async function fetchBillets() {
  if (!userStore.userId) return;
  error.value = null;
  try {
    const res = await panierStore.GetBilletsByUser(userStore.userId);
    billets.value = res.data;
  } catch (err) {
    console.error('Erreur en récupérant les billets :', err);
    error.value = 'Impossible de récupérer vos billets pour le moment.';
  } 
}

onMounted(() => {
  if (userStore.isConnected) fetchBillets();
});
</script>

<style scoped>
.mes-billets-page {
  min-height: calc(100vh - 200px);
}

.content {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
}

.billets-table {
  width: 100%;
  border-collapse: collapse;
}

.billets-table th,
.billets-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.empty {
  padding: 1rem;
  background: #fff6e6;
  border-radius: 8px;
}

.error {
  color: red;
}
</style>
