<template>
  <NavView />
  <div class="container">
    <div class="panier">
      <h2>Votre panier</h2>
      <div v-if="panier.length === 0">Aucun article dans le panier</div>
      <div v-else>

        <h3>Sièges</h3>
        <div v-if="sieges.length === 0">Aucun siège</div>

        <div v-for="(seat, index) in sieges" :key="'seat-' + index" class="item">
          <p>Siège : {{ seat.siege_colonne }}{{ seat.siege_ligne }}<span>(Zone {{ seat.siege_zone }})</span></p>
          <p style="color: red; font-weight: 700;">{{ getItemPrice(seat, false) }} €</p>
        </div>

        <hr />

        <!-- SERVICES -->
        <h3>Services</h3>
        <div v-if="services.length === 0">Aucun service</div>

        <div v-for="(service, index) in services" :key="'service-' + index" class="item">
          <p>Service : {{ service.nom_service }}<span style="color: red;"> x{{ service.quantite_service }}</span></p>
          <p style="color: red; font-weight: 700;">{{ getItemPrice(service, true) }} €</p>
        </div>

      </div>
    </div>

    <div class="total">
      <h2>Prix total</h2>
      <div class="montant">{{ total }} €</div>
    </div>
  </div>
  <div class="button-group">
    <button @click="goToCheckout" class="btn btn-checkout">Procéder au paiement</button>
    <button @click="reset" class="btn btn-danger">Vider le panier</button>
    <button @click="addTestSeats" class="btn btn-test" title="Pour développement uniquement">+ Ajouter places
      test</button>
    <button v-if="fromZone" @click="backToBleacher" class="btn btn-secondary">
      Retour au gradin {{ fromZone }}
    </button>
  </div>
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

const fromZone = route.query.fromZone;

const userStore = useUserStore();
const panier = ref([]);

const sieges = computed(() =>
  panier.value.filter(item => item.siege_colonne)
);

const services = computed(() =>
  panier.value.filter(item => item.nom_service)
);

const prix = ref(0);



function getItemPrice(item, isService) {
  // SERVICE EN PREMIER
  if (item.nom_service && isService) {
    return (item.prix_unitaire_service || 0) * (item.quantite_service || 1);
  }

  // SINON C’EST UN SIÈGE
  if (item.siege_colonne && !isService) {
    if (["I", "H", "G"].includes(item.siege_colonne)) return 25;
    if (["F", "E", "D"].includes(item.siege_colonne)) return 18;
    return 12;
  }

  return 0;
}

const total = computed(() => {
  return panier.value.reduce((sum, item) => sum + getItemPrice(item, true) + getItemPrice(item, false), 0);
});


async function fetchPanier() {
  try {
    const res = await axios.get(`http://localhost:3000/panier/show/${userStore.userId}`);
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
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      est_reserve: true,
      id_utilisateur: userStore.userId,
    });
  }

  localStorage.removeItem("selectedSeats");

  await fetchPanier();
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
    });
  }

  await fetchPanier();
}

function backToBleacher() {
  router.push({
    name: "Gradin",
    params: { zone: fromZone.toLowerCase() },
  });
}

function goToCheckout() {
  router.push({
    name: "Checkout",
  });
}

// Fonction pour ajouter des places de test (développement uniquement)
function addTestSeats() {
  const testSeats = [
    { numero_colonne: "A", numero_ligne: 1, zone: "Nord" },
    { numero_colonne: "B", numero_ligne: 2, zone: "Nord" },
    { numero_colonne: "H", numero_ligne: 5, zone: "Est" },
  ];
  panier.value = testSeats;
  alert(`${testSeats.length} places de test ajoutées au panier`);
}

onMounted(() => {
  fetchPanier();

  // Optionnel : Décommenter la ligne suivante pour charger automatiquement des places de test
  // addTestSeats();
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

.item p {
  margin: 0;
  line-height: 1.2;
}


.montant {
  font-size: 1.6em;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
  padding: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-checkout {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  flex: 1;
  min-width: 200px;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.3);
}

.btn-legacy {
  background: #007bff;
  color: white;
}

.btn-legacy:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.3);
}

.btn-test {
  background: #ffc107;
  color: #333;
  font-size: 0.9em;
}

.btn-test:hover {
  background: #ffb300;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
}

@media (max-width: 600px) {
  .container {
    flex-direction: column;
    gap: 20px;
  }

  .panier,
  .total {
    width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
