<template>
  <div>
    <NavBar />

    <div class="pageContainer">
      <div class="matchHeader">
        <h2>Mintonette Cup – Gradin {{ zone.toUpperCase() }}</h2>
      </div>

      <section v-if="matches.length">
        <h3 class="sectionTitle">Matchs sur ce terrain</h3>

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
          <img src="/AvailableSeat.svg" alt=""><p>{{ $t('gradin.siegeDispo')}}</p>
          <img src="/ReservedSeat.svg" alt=""><p>{{ $t('gradin.siegeReserv')}} </p>
          <img src="/OwnedSeat.svg" alt=""><p>{{ $t('gradin.siegeproprio')}} </p>
          <img src="/SelectionnedSeat.svg" alt=""><p>{{ $t('gradin.siegeDispo')}}</p>
        </div>
        <div v-if="idMatch" class="matchHeader">
          <h3>Réservation de place</h3>
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
            <h3>Sièges sélectionnés ({{ globalSelectedSeats.length }})</h3>
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
                <b>Ajouter au panier </b>
              </button>

              <router-link :to="{ name: 'Panier' }">
                <button class="button basket">
                  <b>Accéder à votre panier</b>
                </button>
              </router-link>
              <button class="button reset" @click="resetSelection">
                <b>Réinitialiser la sélection pour ce match</b>
              </button>
            </div>
          </div>
        </div>

        <div class="buttonContainer" v-if="idMatch">
          <button class="button resetButton" @click="resetAllSelection">
            <b>Réinitialiser la sélection totale </b>
          </button>
        </div>
        <div v-if="estAjoute" class="successMessage">
          ✓ Vous avez bien ajouté ces articles dans votre panier
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

// import axios from "axios";
import matchesData from "../../backend/database/jsonData/Match.json";
import siegesData from "../../backend/database/jsonData/Siege.json";
import equipesData from "../../backend/database/jsonData/Equipe.json";
import paysData from "../../backend/database/jsonData/Pays.json";

const route = useRoute();
const router = useRouter();
const zone = route.params.zone;
const userStore = useUserStore();
const navStore = useNavigationStore();

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
  JSON.parse(localStorage.getItem("selectedSeats") || "[]")
);

const globalTotalPrice = computed(() =>
  globalSelectedSeats.value.reduce((sum, seat) => sum + getSeatPrice(seat), 0)
);


function getMatchTime(match) {
  const date = new Date(match.date_match);
  return `${date.getUTCHours().toString().padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function getSeatPrice(seat) {
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}

/*Avec la BDD ( axios )*/
// ################################################################################################################### fetchGradin
// async function fetchGradin() {
//   const res = await axios.get("http://localhost:3000/gradin/show", {
//     params: { matchId: idMatch.value },
//   });

//   const seatsForZone = res.data
//     .filter((seat) => seat.zone === zone.toUpperCase())
//     .map((seat) => {
//       let state = "available";

//       if (seat.est_reserve && seat.id_utilisateur === userStore.userId) {
//         state = "owned";
//       } else if (seat.est_reserve) {
//         state = "reserved";
//       } else if (
//         globalSelectedSeats.value.some(
//           (s) =>
//             s.matchId === idMatch.value &&
//             s.zone === seat.zone &&
//             s.numero_colonne === seat.numero_colonne &&
//             s.numero_ligne === seat.numero_ligne
//         )
//       ) {
//         state = "selected";
//       }

//       return { ...seat, state };
//     });

//   seatsByMatch.value[idMatch.value] = seatsForZone;
//   seats.value = seatsByMatch.value[idMatch.value];
// }

// ################################################################################################################### fetchMatch
// async function fetchMatches() {
//   const res = await axios.get(
//     `http://localhost:3000/equipes/match/terrain/${terrainId}`
//   );
//   matches.value = res.data;
// }

// ################################################################################################################### selectMatch

// async function selectMatch(match) {
//   idMatch.value = match.id_match;
//   hoverIndex.value = null;
//   estAjoute.value = false;

//   if (!seatsByMatch.value[idMatch.value]) {
//     await fetchGradin();
//   } else {
//     seats.value = seatsByMatch.value[idMatch.value];
//   }
// }

// ################################################################################################################### AddToCart

// async function AddToCart() {
//   if (!globalSelectedSeats.value.length) return;

//   try {
//     for (const seat of globalSelectedSeats.value) {
//       await axios.post("http://localhost:3000/gradin/panier/add", {
//         utilisateur_id: userStore.userId,
//         matchId: seat.matchId,
//         numero_colonne: seat.numero_colonne,
//         numero_ligne: seat.numero_ligne,
//         zone: seat.zone
//       });
//     }

//     estAjoute.value = true;
//     setTimeout(() => {
//       estAjoute.value = false;
//     }, 3000);
//   } catch (error) {
//     console.error("Erreur lors de l'ajout au panier:", error);
//   }
// }
// ################################################################################################################### resetSelection

// function resetSelection() {
//   globalSelectedSeats.value = globalSelectedSeats.value.filter(
//     (s) => s.matchId !== idMatch.value
//   );

//   localStorage.setItem(
//     "selectedSeats",
//     JSON.stringify(globalSelectedSeats.value)
//   );

//   seats.value.forEach((seat) => {
//     if (seat.state === "selected") {
//       seat.state = seat.est_reserve ? "reserved" : "available";
//     }
//   });
// }
// ################################################################################################################### resetAllSelection

// function resetAllSelection() {
//   globalSelectedSeats.value = [];
//   seats.value.forEach((seat) => {
//     if (seat.state === "selected") seat.state = "available";
//   });
//   localStorage.setItem("selectedSeats", "[]");
// }

// onMounted(async () => {
//   await fetchMatches();
//   if (matches.value.length > 0) {
//     await selectMatch(matches.value[0]);
//   }
// });
function fetchGradin() {
  const seatsForZone = siegesData
    .filter(
      (seat) =>
        seat.match_id === idMatch.value && seat.zone === zone.toUpperCase()
    )
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
            s.numero_ligne === seat.numero_ligne
        )
      ) {
        state = "selected";
      }

      return { ...seat, state };
    });

  seatsByMatch.value[idMatch.value] = seatsForZone;
  seats.value = seatsByMatch.value[idMatch.value];
}



function fetchMatches() {
  const matchesForTerrain = matchesData.filter(
    (match) => match.id_terrain === terrainId
  );

  matches.value = matchesForTerrain.map((match) => {
    const equipe1 = equipesData.find((e) => e.id_equipe === match.id_equipe1);
    const equipe2 = equipesData.find((e) => e.id_equipe === match.id_equipe2);

    const pays1 = paysData.find((p) => p.id_pays === equipe1?.id_pays);
    const pays2 = paysData.find((p) => p.id_pays === equipe2?.id_pays);

    return {
      ...match,
      team1_country: pays1?.nom_pays || "Équipe 1",
      team2_country: pays2?.nom_pays || "Équipe 2",
    };
  });
}

function selectMatch(match) {
  idMatch.value = match.id_match;
  hoverIndex.value = null;
  estAjoute.value = false;

  if (!seatsByMatch.value[idMatch.value]) {
    fetchGradin();
  } else {
    seats.value = seatsByMatch.value[idMatch.value];
  }
}

function UpdateSeatStatus(index) {
  const seat = seats.value[index];
  if (seat.state === "reserved" || seat.state === "owned") return;

  const match = matches.value.find((m) => m.id_match === idMatch.value);

  const existingIndex = globalSelectedSeats.value.findIndex(
    (s) =>
      s.matchId === idMatch.value &&
      s.zone === seat.zone &&
      s.numero_colonne === seat.numero_colonne &&
      s.numero_ligne === seat.numero_ligne
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
    JSON.stringify(globalSelectedSeats.value)
  );
}




function AddToCart() {
  if (!globalSelectedSeats.value.length) return;
  const panier = JSON.parse(localStorage.getItem("panier") || "[]");

  globalSelectedSeats.value.forEach((seat) => {
    const existe = panier.some(
      (item) =>
        item.matchId === seat.matchId &&
        item.zone === seat.zone &&
        item.numero_colonne === seat.numero_colonne &&
        item.numero_ligne === seat.numero_ligne
    );

    if (!existe) {
      panier.push({
        utilisateur_id: userStore.userId,
        matchId: seat.matchId,
        numero_colonne: seat.numero_colonne,
        numero_ligne: seat.numero_ligne,
        zone: seat.zone,
        team1: seat.team1,
        team2: seat.team2,
        prix: getSeatPrice(seat),
      });
    }
  });

  localStorage.setItem("panier", JSON.stringify(panier));

  estAjoute.value = true;
  setTimeout(() => {
    estAjoute.value = false;
  }, 3000);
}
function resetSelection() {
  globalSelectedSeats.value = globalSelectedSeats.value.filter(
    (s) => s.matchId !== idMatch.value
  );

  localStorage.setItem(
    "selectedSeats",
    JSON.stringify(globalSelectedSeats.value)
  );

  seats.value.forEach((seat) => {
    if (seat.state === "selected") {
      seat.state = seat.est_reserve ? "reserved" : "available";
    }
  });
}

function resetAllSelection() {
  globalSelectedSeats.value = [];
  seats.value.forEach((seat) => {
    if (seat.state === "selected") seat.state = "available";
  });
  localStorage.setItem("selectedSeats", "[]");
}

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
}

.matchHeader {
  text-align: center;
  margin-bottom: 30px;
}

.matchHeader h2 {
  color: #00167a;
  font-size: 2em;
  margin-bottom: 10px;
}

.matchHeader h3 {
  color: #00167a;
  font-size: 1.5em;
  margin: 20px 0;
}
.legend{
  display: flex;
  gap: 10px;
}
.legend img{
  width: 40px;
}
.sectionTitle {
  text-align: center;
  color: #00167a;
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
  color: #00167a;
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
  color: #4a5568;
}

.matchTitle.active,
.matchTitle:hover {
  background-color: #00167a;
  color: white;
}

.matchTitle.active .matchTime,
.matchTitle:hover .matchTime {
  color: #cbd5e0;
}
.buttonContainer {
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
  background: #f6f7fb;
  padding: 30px;
  border-radius: 12px;
  justify-content: center;
}

.Seat {
  width: 60px;
  height: 70px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s;
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
  color: #00167a;
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
  color: #00167a;
  min-width: 60px;
}

.seatLocation {
  color: #4a5568;
  flex: 1;
}

.seatPrice {
  font-weight: bold;
  color: #2c5282;
}

.totalPrice {
  text-align: center;
  font-size: 1.3em;
  color: #00167a;
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.button {
  background: #00167a;
  color: white;
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
  background: #001a99;
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
