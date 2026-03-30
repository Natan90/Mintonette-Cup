<template>
  <NavView />
  <div class="container">
    <div class="panier">
      <h2>{{ $t("Panier.votrePanier") }}</h2>
      <div v-if="panier.length === 0">{{ $t("Panier.panierVide") }}</div>
      <div v-else>
        <h3>Sièges</h3>
        <div v-if="sieges.length === 0">Aucun siège</div>
        <div
          v-for="(seat, index) in sieges"
          :key="'seat-' + index"
          class="item">
          <p>
            {{ $t("Panier.siegeMatch") }} : {{ seat.numero_colonne
            }}{{ seat.numero_ligne }}
            <span v-if="seat.equipe1_nom && seat.equipe2_nom">
              {{ seat.equipe1_nom.substring(0, 3) }} -
              {{ seat.equipe2_nom.substring(0, 3) }}
            </span>
            <span>
              | {{ $t("Panier.zoneLabel", { zone: translateZone(seat.zone) }) }}
            </span>
            <span v-if="seat.date_match">
              | {{ $t("Panier.dateMatch") }} :
              {{ formatMatchDate(seat.date_match) }}
              | {{ $t("Panier.heureMatch") }} :
              {{ formatMatchTime(seat.date_match) }}
            </span>
          </p>
          <p style="color: red; font-weight: 700">
            {{ getItemPrice(seat, false) }} €
          </p>
        </div>

        <hr />

        <h3>Services</h3>
        <div v-if="services.length === 0">{{ $t("Panier.aucunService") }}</div>

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
      <h2>{{ $t("Panier.prixTotal") }}</h2>
      <div class="montant">{{ total }} €</div>
    </div>
  </div>
  <div class="button-group">
    <!-- <button @click="goToCheckout" class="btn btn-checkout">
      Procéder au paiement
    </button> -->
    <div v-if="panier.length >= 1">
      <router-link to="Checkout" class="btn btn-checkout">
        {{ $t("Panier.procederPayement") }}
      </router-link>
      <button @click="reset" class="btn btn-danger">
        {{ $t("Panier.viderPanier") }}
      </button>
    </div>
    <div v-else></div>
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
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { usePanierStore } from "@/services/panier.service";
import { useGradinStore } from "@/services/gradin.service";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { t, te, locale } = useI18n();
const panierStore = usePanierStore();
const gradinStore = useGradinStore();

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


onMounted(() => {
  fetchPanier();
});

/**
 * Traduit le nom d'une zone en fonction de la langue active.
 * Nettoie la valeur brute (ex: "Zone A" → "a") puis cherche la traduction.
 * 
 * @param {string} rawZone - Nom brut de la zone
 * @returns {string} Zone traduite ou valeur originale si non trouvée
*/
function translateZone(rawZone) {
  const normalized = String(rawZone || "")
    .replace(/^zone\s+/i, "")
    .trim()
    .toLowerCase();

  const key = `zones.${normalized}`;
  return te(key) ? t(key) : rawZone;
}
/**
 * Retourne la locale adaptée pour Intl selon la langue active.
 * 
 * @returns {string} Code locale (ex: "fr-FR" ou "en-GB")
*/
function getCurrentIntlLocale() {
  return locale.value === "en" ? "en-GB" : "fr-FR";
}
/**
 * Formate une date de match en texte lisible.
 * 
 * @param {string|Date} matchDate - Date du match
 * @returns {string} Date formatée (ex: "12 mars 2026")
*/
function formatMatchDate(matchDate) {
  return new Date(matchDate).toLocaleDateString(getCurrentIntlLocale(), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
/**
 * Formate l'heure d'un match.
 * 
 * @param {string|Date} matchDate - Date du match
 * @returns {string} Heure formatée (ex: "18:30")
*/
function formatMatchTime(matchDate) {
  return new Date(matchDate).toLocaleTimeString(getCurrentIntlLocale(), {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
/**
 * Calcule le prix d'un élément du panier.
 * 
 * - Si service → retourne prix unitaire
 * - Si siège → calcule selon la colonne (zone tarifaire)
 * 
 * @param {Object} item - Élément (siège ou service)
 * @param {boolean} isService - Indique si c'est un service
 * @returns {number} Prix de l'élément
*/
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
    0,
  );
  const totalServices = services.value.reduce(
    (sum, service) =>
      sum + getItemPrice(service, true) * (service.quantite_service || 1),
    0,
  );
  return totalSieges + totalServices;
});
/**
 * Récupère le panier de l'utilisateur connecté depuis l'API.
 * 
 * Met à jour la variable réactive `panier`.
 * 
 * @async
*/
async function fetchPanier() {
  try {
    const res = await panierStore.GetPanierByUser(userStore.userId);
    panier.value = res.data;
  } catch (err) {
    console.error(err);
  }
}
/**
 * Vide complètement le panier utilisateur.
 * 
 * - Demande confirmation
 * - Libère les sièges côté backend
 * - Supprime les éléments du panier
 * - Recharge les données
 * 
 * @async
*/
async function reset() {
  if (panier.value.length === 0) {
    alert("Le panier est déjà vide");
    return;
  }

  const confirmClear = confirm("Êtes-vous sûr de vouloir vider le panier ?");
  if (!confirmClear) return;

  try {
    for (const seat of sieges.value) {
      await gradinStore.UpdateGradin({
        matchId: seat.matchId || seat.match_id,
        numero_colonne: seat.numero_colonne,
        numero_ligne: seat.numero_ligne,
        zone: seat.zone,
        est_reserve: false,
        id_utilisateur: null,
      });
    }

    await panierStore.ClearPanier(userStore.userId);

    await fetchPanier();

    alert("Panier vidé avec succès !");
  } catch (err) {
    console.error("Erreur reset panier:", err);
    alert("Erreur lors du vidage du panier");
  }
}
/**
 * Redirige vers le gradin d'origine.
 * 
 * Utilise le paramètre `fromZone` passé dans l'URL.
*/
function backToBleacher() {
  router.push({
    name: "Gradin",
    params: { zone: fromZone.toLowerCase() },
  });
}
/**
 * Lance le processus de paiement du panier.
 * 
 * - Vérifie si le panier est vide
 * - Demande confirmation
 * - Envoie les données au backend
 * - Redirige vers la page "Mes billets"
 * 
 * @async
*/
async function goToCheckout() {
  if (panier.value.length === 0) {
    alert("Aucun article dans le panier.");
    return;
  }

  const confirmPay = confirm(`Voulez-vous payer ${total.value} euros ?`);
  if (!confirmPay) return;

  await panierStore.PayPanier(
    userStore.userId,
    sieges.value,
    services.value,
    total.value,
  );

  // Rediriger vers "Mes Billets"
  router.push({ name: "MesBillets" });

  // try {
  //   // === Gérer les sièges ===
  //   const siegesLocal = JSON.parse(localStorage.getItem("sieges") || "[]");

  //   sieges.value.forEach((seat) => {
  //     const seatIndex = siegesLocal.findIndex(
  //       (s) =>
  //         s.numero_colonne === seat.numero_colonne &&
  //         s.numero_ligne === seat.numero_ligne &&
  //         s.zone === seat.zone &&
  //         s.match_id === seat.matchId
  //     );

  //     if (seatIndex !== -1) {
  //       siegesLocal[seatIndex].est_reserve = true;
  //       siegesLocal[seatIndex].id_utilisateur = userStore.userId;
  //     } else {
  //       siegesLocal.push({
  //         match_id: seat.matchId,
  //         numero_colonne: seat.numero_colonne,
  //         numero_ligne: seat.numero_ligne,
  //         zone: seat.zone,
  //         est_reserve: true,
  //         id_utilisateur: userStore.userId,
  //       });
  //     }
  //   });

  //   localStorage.setItem("sieges", JSON.stringify(siegesLocal));

  //   // === Gérer les services (inscriptions) ===
  //   // Créer une collection pour les inscriptions aux services si elle n'existe pas
  //   const inscriptionsServices = JSON.parse(
  //     localStorage.getItem("panier_service") || "[]"
  //   );

  //   services.value.forEach((service) => {
  //     // Générer un nouvel ID pour l'inscription
  //     const newId =
  //       inscriptionsServices.length > 0
  //         ? Math.max(...inscriptionsServices.map((i) => i.id || 0)) + 1
  //         : 1;

  //     // Ajouter l'inscription au service
  //     inscriptionsServices.push({
  //       id: newId,
  //       id_utilisateur: userStore.userId,
  //       id_service: service.service_id,
  //       quantite: service.quantite_service || 1,
  //       date_inscription: new Date().toISOString(),
  //     });
  //   });

  //   localStorage.setItem(
  //     "panier_service",
  //     JSON.stringify(inscriptionsServices)
  //   );

  //   // Vider le panier
  //   localStorage.setItem("panier", "[]");
  //   panier.value = [];

  //   alert(
  //     "Paiement effectué avec succès ! Vos réservations ont été enregistrées."
  //   );

  // } catch (err) {
  //   console.error("Erreur lors du paiement:", err);
  //   alert("Une erreur est survenue lors du paiement.");
  // }
}
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
  font-size: 1.2em;
  text-align: center;
  text-decoration: none;
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
