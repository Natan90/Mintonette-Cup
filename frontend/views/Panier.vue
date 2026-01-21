<template>
  <NavView />
  <div class="container">
    <div class="panier">
      <h2>Votre panier</h2>
      <div v-if="panier.length === 0">Aucun article dans le panier</div>
      <div v-else>
        <h3>Sièges</h3>
        <div v-if="sieges.length === 0">Aucun siège</div>

        <div
          v-for="(seat, index) in sieges"
          :key="'seat-' + index"
          class="item">
          <p>
            Siège : {{ seat.numero_colonne }}{{ seat.numero_ligne }}
            <span v-if="seat.team1 && seat.team2">
              {{ seat.team1.substring(0, 3) }} -
              {{ seat.team2.substring(0, 3) }}
            </span>
            <span> (Zone {{ seat.zone }})</span>
          </p>
          <p style="color: red; font-weight: 700">
            {{ getItemPrice(seat, false) }} €
          </p>
        </div>

        <hr />

        <!-- SERVICES -->
        <h3>Services</h3>
        <div v-if="services.length === 0">Aucun service</div>

        <div
          v-for="(service, index) in services"
          :key="'service-' + index"
          class="item">
          <p>
            Service : {{ service.nom_service
            }}<span style="color: red"> x{{ service.quantite_service }}</span>
          </p>
          <p style="color: red; font-weight: 700">
            {{ getItemPrice(service, true) }} €
          </p>
        </div>
      </div>
    </div>

    <div class="total">
      <h2>Prix total</h2>
      <div class="montant">{{ total }} €</div>
    </div>
  </div>
  <div class="button-group">
    <button @click="goToCheckout" class="btn btn-checkout">
      Procéder au paiement
    </button>
    <button @click="reset" class="btn btn-danger">Vider le panier</button>
    <!-- <button
      @click="addTestSeats"
      class="btn btn-test"
      title="Pour développement uniquement">
      + Ajouter places test
    </button> -->
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
// import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import matchesData from "../../backend/database/jsonData/Match.json";
import equipesData from "../../backend/database/jsonData/Equipe.json";
import paysData from "../../backend/database/jsonData/Pays.json";
import servicesData from "../../backend/database/jsonData/Services.json";
import localData from "../../backend/database/localData.js";

const route = useRoute();
const router = useRouter();

const fromZone = route.query.fromZone;

const userStore = useUserStore();
const panier = ref([]);

const sieges = computed(() => {
  const filtered = panier.value.filter((item) => item.numero_colonne);

  const uniqueMap = new Map();
  filtered.forEach((siege) => {
    const key = `${siege.numero_colonne}-${siege.numero_ligne}-${siege.zone}-${
      siege.matchId || ""
    }`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, siege);
    }
  });

  const uniqueSieges = Array.from(uniqueMap.values());
  return uniqueSieges;
});

const services = computed(() => {
  const filtered = panier.value.filter((item) => item.nom_service);

  // Dédupliquer les services par service_id
  const uniqueMap = new Map();
  filtered.forEach((service) => {
    const key = service.service_id || service.nom_service;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, service);
    }
  });

  const uniqueServices = Array.from(uniqueMap.values());
  return uniqueServices;
});

const prix = ref(0);

function getItemPrice(item, isService) {
  if (item.nom_service && isService) {
    return item.prix_unitaire_service || 0;
  }

  if (item.numero_colonne && !isService) {
    if (["I", "H", "G"].includes(item.numero_colonne)) return 25;
    if (["F", "E", "D"].includes(item.numero_colonne)) return 18;
    return 12;
  }

  return 0;
}

const total = computed(() => {
  const totalSieges = sieges.value.reduce(
    (sum, seat) => sum + getItemPrice(seat, false),
    0
  );
  const totalServices = services.value.reduce(
    (sum, service) =>
      sum + getItemPrice(service, true) * (service.quantite_service || 1),
    0
  );
  return totalSieges + totalServices;
});

// async function fetchPanier() {
//   try {
//     const res = await axios.get(
//       `http://localhost:3000/panier/show/${userStore.userId}`
//     );
//     panier.value = res.data;
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function pay() {
//   if (panier.value.length === 0) {
//     alert("Aucun siège dans le panier.");
//     return;
//   }

//   const confirmPay = confirm(`Voulez-vous payer ${total.value} euros ?`);
//   if (!confirmPay) return;

//   for (const seat of panier.value) {
//     await axios.put("http://localhost:3000/gradin/update", {
//       numero_colonne: seat.numero_colonne,
//       numero_ligne: seat.numero_ligne,
//       zone: seat.zone,
//       est_reserve: true,
//       id_utilisateur: userStore.userId,
//     });
//   }

//   localStorage.removeItem("selectedSeats");

//   await fetchPanier();
// }

// async function reset() {
//   if (panier.value.length === 0) {
//     alert("Le panier est déjà vide");
//     return;
//   }

//   for (const seat of panier.value) {
//     await axios.put("http://localhost:3000/gradin/update", {
//       numero_colonne: seat.numero_colonne,
//       numero_ligne: seat.numero_ligne,
//       zone: seat.zone,
//       est_reserve: false,
//     });
//   }

//   await fetchPanier();
// }

function fetchPanier() {
  const panierData = JSON.parse(localStorage.getItem("panier") || "[]");

  // Charger tous les services (localStorage + JSON fusionnés)
  const servicesLocalStorage = localData.getAll("services");
  const localStorageServiceIds = servicesLocalStorage.map((s) => s.id_service);
  const servicesJSONFiltered = servicesData.filter(
    (s) => !localStorageServiceIds.includes(s.id_service)
  );
  const allServices = [...servicesJSONFiltered, ...servicesLocalStorage];

  const enrichedPanier = panierData.map((item) => {
    // Si c'est un service (a un service_id)
    if (item.service_id) {
      const service = allServices.find((s) => s.id_service === item.service_id);
      if (service) {
        return {
          ...item,
          nom_service: service.nom_service,
          prix_unitaire_service: service.prix || service.prix_service || 0,
          quantite_service: item.quantite || 1,
        };
      }
    }

    // Si c'est un siège (a un match_id)
    const match = matchesData.find((m) => m.id_match === item.matchId);

    if (match) {
      const equipe1 = equipesData.find((e) => e.id_equipe === match.id_equipe1);
      const equipe2 = equipesData.find((e) => e.id_equipe === match.id_equipe2);

      const pays1 = paysData.find((p) => p.id_pays === equipe1?.id_pays);
      const pays2 = paysData.find((p) => p.id_pays === equipe2?.id_pays);

      return {
        ...item,
        team1: pays1?.nom_pays || "Équipe 1",
        team2: pays2?.nom_pays || "Équipe 2",
      };
    }

    return item;
  });

  panier.value = enrichedPanier;
}

function reset() {
  if (panier.value.length === 0) {
    alert("Le panier est déjà vide");
    return;
  }

  localStorage.setItem("panier", "[]");
  panier.value = [];
  alert("Le panier a été vidé");
}

function backToBleacher() {
  router.push({
    name: "Gradin",
    params: { zone: fromZone.toLowerCase() },
  });
}

function goToCheckout() {
  if (panier.value.length === 0) {
    alert("Aucun article dans le panier.");
    return;
  }

  const confirmPay = confirm(`Voulez-vous payer ${total.value} euros ?`);
  if (!confirmPay) return;

  try {
    // === Gérer les sièges ===
    const siegesLocal = JSON.parse(localStorage.getItem("sieges") || "[]");

    sieges.value.forEach((seat) => {
      const seatIndex = siegesLocal.findIndex(
        (s) =>
          s.numero_colonne === seat.numero_colonne &&
          s.numero_ligne === seat.numero_ligne &&
          s.zone === seat.zone &&
          s.match_id === seat.matchId
      );

      if (seatIndex !== -1) {
        siegesLocal[seatIndex].est_reserve = true;
        siegesLocal[seatIndex].id_utilisateur = userStore.userId;
      } else {
        siegesLocal.push({
          match_id: seat.matchId,
          numero_colonne: seat.numero_colonne,
          numero_ligne: seat.numero_ligne,
          zone: seat.zone,
          est_reserve: true,
          id_utilisateur: userStore.userId,
        });
      }
    });

    localStorage.setItem("sieges", JSON.stringify(siegesLocal));

    // === Gérer les services (inscriptions) ===
    // Créer une collection pour les inscriptions aux services si elle n'existe pas
    const inscriptionsServices = JSON.parse(
      localStorage.getItem("panier_service") || "[]"
    );

    services.value.forEach((service) => {
      // Générer un nouvel ID pour l'inscription
      const newId =
        inscriptionsServices.length > 0
          ? Math.max(...inscriptionsServices.map((i) => i.id || 0)) + 1
          : 1;

      // Ajouter l'inscription au service
      inscriptionsServices.push({
        id: newId,
        id_utilisateur: userStore.userId,
        id_service: service.service_id,
        quantite: service.quantite_service || 1,
        date_inscription: new Date().toISOString(),
      });
    });

    localStorage.setItem(
      "panier_service",
      JSON.stringify(inscriptionsServices)
    );

    // Vider le panier
    localStorage.setItem("panier", "[]");
    panier.value = [];

    alert(
      "Paiement effectué avec succès ! Vos réservations ont été enregistrées."
    );

    // Rediriger vers "Mes Billets"
    router.push({ name: "MesBillets" });
  } catch (err) {
    console.error("Erreur lors du paiement:", err);
    alert("Une erreur est survenue lors du paiement.");
  }
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
