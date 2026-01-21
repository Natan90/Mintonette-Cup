<template>
  <div class="mes-billets-page">
    <NavView />
    <div class="content">
      <h1>Mes billets</h1>

      <div v-if="!userStore.isConnected" class="empty">
        <p>Veuillez vous connecter pour consulter vos billets.</p>
      </div>

      <div v-else>
        <div v-if="loading">Chargement...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
          <div v-if="billets.length === 0" class="empty">
            <p>Vous n'avez aucun billet réservé.</p>
          </div>

          <table v-else class="billets-table">
            <thead>
              <tr>
                <th>Match</th>
                <th>Zone</th>
                <th>Place</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, index) in billets" :key="index">
                <td>{{ b.match_id || "—" }}</td>
                <td>{{ b.zone }}</td>
                <td>{{ b.numero_colonne }}{{ b.numero_ligne }}</td>
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
import siegesData from "../../backend/database/jsonData/Siege.json";
// import axios from 'axios';
import { useUserStore } from "@/stores/user";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const userStore = useUserStore();
const billets = ref([]);
const loading = ref(false);
const error = ref(null);

function getPrice(seat) {
  // same pricing logic as Checkout
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}

function fetchBillets() {
  if (!userStore.userId) return;
  loading.value = true;
  error.value = null;

  try {
    const siegesLocal = JSON.parse(localStorage.getItem("sieges") || "[]");
    billets.value = siegesLocal.filter(
      (seat) =>
        seat.est_reserve === true && seat.id_utilisateur === userStore.userId,
    );
  } catch (err) {
    console.error("Erreur en récupérant les billets :", err);
    error.value = "Impossible de récupérer vos billets pour le moment.";
  } finally {
    loading.value = false;
  }
}

// async function fetchBillets() {
//   if (!userStore.userId) return;
//   loading.value = true;
//   error.value = null;
//   try {
//   const res = await axios.get(`http://localhost:3000/gradin/user/${userStore.userId}`);
//     billets.value = res.data;
//   } catch (err) {
//     console.error('Erreur en récupérant les billets :', err);
//     error.value = 'Impossible de récupérer vos billets pour le moment.';
//   } finally {
//     loading.value = false;
//   }
// }

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
