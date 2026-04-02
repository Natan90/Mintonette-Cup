<template>
  <div>
    <NavBar />

    <div class="pageContainer">
      <router-link
        :to="{ name: 'Home', params: { lang: locale } }"
        class="button homeButton">
        ← {{ $t("gradin.retourAccueil") }}
      </router-link>
      <div class="matchHeader">
        <h2>
          Mintonette Cup – {{ $t("gradin.gradin") }} {{ zone.toUpperCase() }}
        </h2>
      </div>

      <section v-if="matches.length">
        <h3 class="sectionTitle">{{ $t("gradin.matchSurTerrain") }}</h3>

        <div class="matchSelector">
          <button
            v-for="match in matches"
            :key="match.id_match"
            @click="selectMatch(match)"
            :class="[
              'matchTitle pointer',
              { active: match.id_match === idMatch },
            ]">
            {{ match.team1_country }} - {{ match.team2_country }}
            <span class="matchTime">{{ getMatchTime(match) }}</span>
          </button>
        </div>
        <div class="legend">
          <img src="/AvailableSeat.svg" alt="" />
          <p>{{ $t("gradin.siegeDispo") }}</p>
          <img src="/ReservedSeat.svg" alt="" />
          <p>{{ $t("gradin.siegeReserv") }}</p>
          <img src="/OwnedSeat.svg" alt="" />
          <p>{{ $t("gradin.siegeproprio") }}</p>
          <img src="/SelectionnedSeat.svg" alt="" />
          <p>{{ $t("gradin.siegeSelec") }}</p>
        </div>
        <div v-if="idMatch" class="matchHeader">
          <h3>{{ $t("gradin.reservation") }}</h3>
        </div>

        <div class="layout" v-if="idMatch">
          <div class="terrainConteneur">
            <div class="seatContainer" :key="idMatch">
              <button
                class="Seat"
                v-for="(seat, index) in seats"
                :key="
                  idMatch +
                  '-' +
                  seat.zone +
                  seat.numero_colonne +
                  seat.numero_ligne
                "
                @mouseover="hoverIndex = index"
                @mouseleave="hoverIndex = null"
                @click="UpdateSeatStatus(index)">
                <img
                  v-if="hoverIndex === index && seat.state === 'available'"
                  src="/AvailableSeatHover.svg"
                  class="ImgSeat" />
                <img
                  v-else-if="seat.state === 'reserved'"
                  src="/ReservedSeat.svg"
                  class="ImgSeat" />
                <img
                  v-else-if="seat.state === 'owned'"
                  src="/OwnedSeat.svg"
                  class="ImgSeat" />
                <img
                  v-else-if="seat.state === 'selected'"
                  src="/SelectionnedSeat.svg"
                  class="ImgSeat" />
                <img v-else src="/AvailableSeat.svg" class="ImgSeat" />
              </button>
            </div>
          </div>

          <div class="SeatInfo" v-if="globalSelectedSeats.length">
            <h3>
              {{ $t("gradin.siegesSelec") }} ({{ globalSelectedSeats.length }})
            </h3>
            <ul>
              <li
                v-for="seat in globalSelectedSeats"
                :key="
                  seat.matchId +
                  seat.zone +
                  seat.numero_colonne +
                  seat.numero_ligne
                ">
                <span class="seatMatch">
                  {{ seat.team1.substring(0, 3) }} vs
                  {{ seat.team2.substring(0, 3) }}
                </span>
                <span class="seatLocation">
                  {{ seat.numero_colonne }}{{ seat.numero_ligne }}
                </span>
                <span class="seatPrice">{{ getSeatPrice(seat) }} €</span>
              </li>
            </ul>

            <p class="totalPrice">
              <b>Total : {{ globalTotalPrice }} €</b>
            </p>
            <div class="buttonContainer">
              <button class="button" @click="AddToCart">
                <b>{{ $t("gradin.ajoutPanier") }} </b>
              </button>

              <router-link :to="{ name: 'Panier' }">
                <button class="button basket">
                  <b>{{ $t("gradin.accederPanier") }}</b>
                </button>
              </router-link>
              <button class="button reset" @click="resetSelection">
                <b>{{ $t("gradin.reinitialiserSelec") }}</b>
              </button>
            </div>
          </div>
        </div>
        <div v-if="globalSelectedSeats.length">
          <div class="buttonContainer" v-if="idMatch">
            <button class="button resetButton" @click="resetAllSelection">
              <b>{{ $t("gradin.reinitialiserSelecTotal") }}</b>
            </button>
          </div>
        </div>
        <div v-if="estAjoute" class="successMessage">
          ✓ {{ $t("gradin.bienAjoute") }}
        </div>
      </section>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavBar from "../components/NavView.vue";
import Footer from "../components/Footer.vue";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { useNavigationStore } from "@/stores/navigation";
import { useGradinStore } from "@/services/gradin.service";
import { usePanierStore } from "@/services/panier.service";
import { useEquipeStore } from "@/services/equipe.service";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const zone = route.params.zone;
const userStore = useUserStore();
const navStore = useNavigationStore();
const gradinStore = useGradinStore();
const panierStore = usePanierStore();
const equipeStore = useEquipeStore();

const matches = ref([]);
const seats = ref([]);
const hoverIndex = ref(null);
const estAjoute = ref(false);
const idMatch = ref(null);
const seatsByMatch = ref({});

const zoneToTerrain = {
  nord: 1,
  est: 2,
  sud: 3,
  ouest: 4,
};
const terrainId = zoneToTerrain[zone];

const globalSelectedSeats = ref(
  JSON.parse(localStorage.getItem("selectedSeats") || "[]"),
);

const globalTotalPrice = computed(() =>
  globalSelectedSeats.value.reduce((sum, seat) => sum + getSeatPrice(seat), 0),
);

onMounted(async () => {
  await fetchMatches();
  if (matches.value.length > 0) {
    await selectMatch(matches.value[0]);
  }
});

/**
 * Formate l’heure d’un match en HH:MM (UTC)
 *
 * @function getMatchTime
 * @param {Object} match - Objet match contenant la date
 */
function getMatchTime(match) {
  const date = new Date(match.date_match);
  return `${date.getUTCHours().toString().padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}`;
}
/**
 * Calcule le prix d’un siège en fonction de sa colonne :
 * - I, H, G → 25€
 * - F, E, D → 18€
 * - autres → 12€
 *
 * @function getSeatPrice
 * @param {Object} seat - Objet siège
 */
function getSeatPrice(seat) {
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}
/**
 * Récupère les sièges pour un match donné et met à jour leur état :
 * - available : libre
 * - reserved : réservé
 * - owned : réservé par l’utilisateur
 * - selected : sélectionné localement
 *
 * @async
 * @function fetchGradin
 */
async function fetchGradin() {
  const res = await gradinStore.GetGradinByMatchId(idMatch.value);

  const seatsForZone = res.data
    .filter((seat) => seat.zone === zone.toUpperCase())
    .map((seat) => {
      let state = "available";

      if (seat.est_reserve && seat.id_utilisateur === userStore.userId) {
        state = "owned";
      } else if (seat.est_reserve) {
        state = "reserved";
      } else if (
        globalSelectedSeats.value.some(
          (s) =>
            s.matchId === idMatch.value &&
            s.zone === seat.zone &&
            s.numero_colonne === seat.numero_colonne &&
            s.numero_ligne === seat.numero_ligne,
        )
      ) {
        state = "selected";
      }

      return { ...seat, state };
    });

  seatsByMatch.value[idMatch.value] = seatsForZone;
  seats.value = seatsByMatch.value[idMatch.value];
}
/**
 * Récupère les matchs disponibles pour un terrain donné.
 * Met à jour la liste des matchs (matches)
 *
 * @async
 * @function fetchMatches
 */
async function fetchMatches() {
  const res = await equipeStore.GetMatchById(terrainId);

  matches.value = res.data;
}
/**
 * Sélectionne un match et initialise les données associées :
 * - met à jour l’identifiant du match courant
 * - reset les états visuels (hover, message succès)
 * - charge les sièges si nécessaire
 *
 * @async
 * @function selectMatch
 * @param {Object} match - Objet match sélectionné
 */
async function selectMatch(match) {
  idMatch.value = match.id_match;
  hoverIndex.value = null;
  estAjoute.value = false;

  if (!seatsByMatch.value[idMatch.value]) {
    await fetchGradin();
  } else {
    seats.value = seatsByMatch.value[idMatch.value];
  }
}
/**
 * Ajoute les sièges sélectionnés au panier utilisateur :
 * - envoie chaque siège à l’API
 * - affiche un message de confirmation
 *
 * @async
 * @function AddToCart
 */
async function AddToCart() {
  if (!globalSelectedSeats.value.length) return;

  try {
    for (const seat of globalSelectedSeats.value) {
      await panierStore.AddToPanier(
        "siege",
        {
          utilisateur_id: userStore.userId,
          matchId: seat.matchId,
          numero_colonne: seat.numero_colonne,
          numero_ligne: seat.numero_ligne,
          zone: seat.zone,
        },
        userStore.userId,
      );
    }

    estAjoute.value = true;
    setTimeout(() => {
      estAjoute.value = false;
    }, 3000);
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
  }
}
/**
 * Réinitialise la sélection des sièges pour le match courant :
 * - supprime les sièges du match courant du stockage global
 * - met à jour le localStorage
 * - restaure l’état visuel des sièges
 *
 * @function resetSelection
 */
function resetSelection() {
  globalSelectedSeats.value = globalSelectedSeats.value.filter(
    (s) => s.matchId !== idMatch.value,
  );

  localStorage.setItem(
    "selectedSeats",
    JSON.stringify(globalSelectedSeats.value),
  );

  seats.value.forEach((seat) => {
    if (seat.state === "selected") {
      seat.state = seat.est_reserve ? "reserved" : "available";
    }
  });
}
/**
 * Réinitialise toutes les sélections de sièges :
 * - vide la sélection globale
 * - remet tous les sièges en état "available"
 * - met à jour le localStorage
 *
 * @function resetAllSelection
 * @returns {void}
 */
function resetAllSelection() {
  globalSelectedSeats.value = [];
  seats.value.forEach((seat) => {
    if (seat.state === "selected") seat.state = "available";
  });
  localStorage.setItem("selectedSeats", "[]");
}
/**
 * Met à jour l’état d’un siège lors d’un clic utilisateur :
 * - sélectionne ou désélectionne le siège
 * - empêche l’interaction si réservé ou possédé
 * - synchronise avec la liste globale et le localStorage
 *
 * @function UpdateSeatStatus
 * @param {number} index - Index du siège dans la liste
 */
function UpdateSeatStatus(index) {
  const seat = seats.value[index];
  if (seat.state === "reserved" || seat.state === "owned") return;

  const match = matches.value.find((m) => m.id_match === idMatch.value);

  const existingIndex = globalSelectedSeats.value.findIndex(
    (s) =>
      s.matchId === idMatch.value &&
      s.zone === seat.zone &&
      s.numero_colonne === seat.numero_colonne &&
      s.numero_ligne === seat.numero_ligne,
  );

  if (seat.state === "available") {
    seat.state = "selected";

    if (existingIndex === -1) {
      globalSelectedSeats.value.push({
        matchId: idMatch.value,
        zone: seat.zone,
        numero_colonne: seat.numero_colonne,
        numero_ligne: seat.numero_ligne,
        team1: match.team1_country,
        team2: match.team2_country,
      });
    }
  } else {
    seat.state = "available";
    if (existingIndex !== -1)
      globalSelectedSeats.value.splice(existingIndex, 1);
  }

  localStorage.setItem(
    "selectedSeats",
    JSON.stringify(globalSelectedSeats.value),
  );
}

// function resetAllSelection() {
//   globalSelectedSeats.value = [];
//   seats.value.forEach((seat) => {
//     if (seat.state === "selected") seat.state = "available";
//   });
//   localStorage.setItem("selectedSeats", "[]");
// }

onMounted(() => {
  fetchMatches();
  if (matches.value.length > 0) {
    selectMatch(matches.value[0]);
  }
});
</script>

<style scoped>
.pageContainer {
  max-width: 1400px;
  margin: auto;
  padding: 20px;
  position: relative;
  padding-top: 52px;
}

.matchHeader {
  text-align: center;
  margin-bottom: 30px;
}

.matchHeader h2 {
  color: var(--primary-color);
  font-size: 2em;
  margin-bottom: 10px;
}

.matchHeader h3 {
  color: var(--primary-color);
  font-size: 1.5em;
  margin: 20px 0;
}
.legend {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.legend img {
  width: 40px;
}
.sectionTitle {
  text-align: center;
  color: var(--primary-color);
  font-size: 1.3em;
  margin-bottom: 20px;
}

.matchSelector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.matchTitle {
  min-width: 250px;
  padding: 12px 18px;
  border: none;
  border-radius: 20px;
  background-color: #e6e9f5;
  color: var(--primary-color);
  font-weight: 600;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.matchTitle .matchTime {
  font-size: 0.85em;
  color: var(--primary-color);
}

.matchTitle.active,
.matchTitle:hover {
  background-color: var(--primary-color);
  color: white;
}

.matchTitle.active .matchTime,
.matchTitle:hover .matchTime {
  color: #cbd5e0;
}
.buttonContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.layout {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.terrainConteneur {
  flex: 1;
  max-width: 900px;
}

.seatContainer {
  user-select: none;
  display: grid;
  grid-template-columns: repeat(12, 60px);
  gap: 10px;
  background: #f0f0f0;
  padding: 30px;
  border-radius: 12px;
}

.Seat {
  width: 60px;
  height: 70px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s;
  justify-content: center;
}

.Seat:hover {
  transform: scale(1.05);
}

.ImgSeat {
  width: 70px;
  height: 70px;
  pointer-events: none;
}

.SeatInfo {
  width: 320px;
  padding: 20px;
  background: #f6f7fb;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.SeatInfo h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
  text-align: center;
}

.SeatInfo ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.SeatInfo li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  font-size: 0.9em;
  gap: 8px;
}

.SeatInfo li:hover {
  background: #e6e9f5;
}

.seatMatch {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 60px;
}

.seatLocation {
  color: var(--primary-color);
  flex: 1;
}

.seatPrice {
  font-weight: bold;
  color: var(--primary-color);
}

.totalPrice {
  text-align: center;
  font-size: 1.3em;
  color: var(--primary-color);
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.button {
  background: var(--primary-color);
  color: var(--couleur-fond);
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  display: inline-block;
  text-align: center;
}

.button:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.actionButton.basket {
  background: #4a5568;
}

.actionButton.basket:hover {
  background: #2d3748;
}

.buttonContainer {
  text-align: center;
  margin-top: 20px;
}

.resetButton {
  background: #ef2828;
}

.resetButton:hover {
  background: #c92424;
}

.successMessage {
  background: #48bb78;
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
  font-weight: 600;
  animation: slideIn 0.3s ease-out;
}

.homeButton {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15px;
  padding: 8px 12px;
  font-size: 0.92rem;
  border-radius: 5px;
  white-space: nowrap;
  margin-left: -45px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pointer {
  cursor: pointer;
}

/* @media (max-width: 1200px) {
  .layout {
    flex-direction: column;
    align-items: center;
  }

  .SeatInfo {
    width: 100%;
    max-width: 500px;
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .seatContainer {
    grid-template-columns: repeat(6, 50px);
    gap: 8px;
    padding: 20px;
  }

  .Seat {
    width: 50px;
    height: 60px;
  }

  .ImgSeat {
    width: 50px;
    height: 50px;
  }

  .matchTitle {
    min-width: 200px;
    font-size: 0.9em;
  }
} */
</style>
