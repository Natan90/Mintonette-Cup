<template>
  <div>
    <NavBar />
    <h1>Gradin {{ zone }}</h1>
    <strong
      >Ici, il faut que je recupère tous les matchs sur ce terrain ( nord :
      idTerrain = 1, est : 2 ...) ensuite afficher en haut les pays avec
      l'heure,</strong
    >
    quand je clique sur un match 100 nouveau siège arrive ( car pas le meme
    match ) Dans les siège sélectionnés, il faut marquer genre FR vs CA pour
    savoir c'est quel match et il est possible d'avoir deux fois le meme siège
    si c'est pas le même match et du coup la même chose dans panier


    legende des siège
    <section>
      <h2 v-if="matches.length">Matchs sur ce terrain</h2>

      <div v-for="match in matches" :key="match.id_match">
        <button
          class="pointer"
          :class="{ active: match.id_match === idMatch }"
          @click="selectMatch(match)">
          {{ match.team1_country }} vs {{ match.team2_country }} –
          {{ getMatchTime(match) }}
        </button>
      </div>

      <h2 v-if="idMatch">Réservation de place</h2>
      {{ idMatch }}

      <div class="layout" v-if="idMatch">
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

        <div class="SeatInfo" v-if="globalSelectedSeats.length">
          <h3>Sièges sélectionnés</h3>
          <ul>
            <li
              v-for="seat in globalSelectedSeats"
              :key="
                seat.matchId +
                seat.zone +
                seat.numero_colonne +
                seat.numero_ligne
              ">
              {{ seat.team1.substring(0, 3) }} vs
              {{ seat.team2.substring(0, 3) }} – {{ seat.numero_colonne
              }}{{ seat.numero_ligne }} – {{ getSeatPrice(seat) }} €
            </li>
          </ul>

          <p>
            <b>Total : {{ globalTotalPrice }} €</b>
          </p>

          <button class="pointer" @click="AddToCart">
            <b>Ajouter au panier</b>
          </button>

          <router-link :to="{ name: 'Panier' }">
            <button class="pointer"><b>Accéder à votre panier</b></button>
          </router-link>

          <button class="pointer" @click="resetAllSelection">
            <b>Réinitialiser la sélection</b>
          </button>
        </div>
      </div>

      <button v-if="idMatch" @click="resetSelection">
        Réinitialiser la sélection pour ce match
      </button>

      <span v-if="estAjoute">
        Vous avez bien ajouté ces articles dans votre panier
      </span>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import NavBar from "../components/NavView.vue";
import Footer from "../components/Footer.vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";

const route = useRoute();
const zone = route.params.zone;
const userStore = useUserStore();

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

const selectedSeats = computed(() =>
  seats.value.filter((seat) => seat.state === "selected")
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

const globalSelectedSeats = ref(
  JSON.parse(localStorage.getItem("selectedSeats") || "[]")
);

function saveGlobalSelections(list) {
  localStorage.setItem("selectedSeats", JSON.stringify(list));
}

function restoreSelection() {
  const saved = getGlobalSelections();

  seats.value.forEach((seat) => {
    const found = saved.find(
      (s) =>
        s.matchId === idMatch.value &&
        s.zone === seat.zone &&
        s.numero_colonne === seat.numero_colonne &&
        s.numero_ligne === seat.numero_ligne
    );

    seat.state = found
      ? "selected"
      : seat.state === "reserved"
      ? "reserved"
      : "available";
  });
}

async function fetchGradin() {
  const res = await axios.get("http://localhost:3000/gradin/show", {
    params: { matchId: idMatch.value },
  });

  // Filtrer par zone
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

async function fetchMatches() {
  const res = await axios.get(
    `http://localhost:3000/equipes/match/terrain/${terrainId}`
  );
  matches.value = res.data;
}

async function selectMatch(match) {
  idMatch.value = match.id_match;
  hoverIndex.value = null;

  if (!seatsByMatch.value[idMatch.value]) {
    await fetchGradin();
  } else {
    seats.value = seatsByMatch.value[idMatch.value];
  }
}


function UpdateSeatStatus(index) {
  const seat = seats.value[index];
  if (seat.state === "reserved") return;

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

async function AddToCart() {
  if (!globalSelectedSeats.value.length) return;

  for (const seat of globalSelectedSeats.value) {
    await axios.put("http://localhost:3000/gradin/panier", {
      matchId: seat.matchId,
      zone: seat.zone,
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      dans_panier: true,
      id_utilisateur: userStore.userId,
    });
  }

  estAjoute.value = true;
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
  localStorage.setItem(
    "selectedSeats",
    JSON.stringify(globalSelectedSeats.value)
  );
}

onMounted(async () => {
  await fetchMatches();
});
</script>

<style scoped>
.layout {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
}

.seatContainer {
  user-select: none;
  display: grid;
  grid-template-columns: repeat(12, 60px);
  gap: 10px;
}

.Seat {
  width: 60px;
  height: 70px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.ImgSeat {
  width: 70px;
  height: 70px;
  pointer-events: none;
}

.SeatInfo {
  width: 220px;
  padding: 16px;
  border: 1px solid black;
  border-radius: 8px;
}

.SeatInfo a {
  text-decoration: none;
  color: black;
}
.SeatInfo button {
  width: 100%;
  padding: 8px;
  text-decoration: none;
}
</style>
