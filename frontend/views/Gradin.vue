<template>
  <div>
    <NavBar />
    <h1>Gradin {{ zone }}</h1>

    <section>
      <h2>Réservation de place</h2>

      <div class="layout">
        <div class="seatContainer">
          <button
            class="Seat"
            v-for="(seat, index) in seats"
            :key="index"
            @mouseover="hoverIndex = index"
            @mouseleave="hoverIndex = null"
            @click="UpdateSiegeStatus(index)">
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
              v-else-if="
                seat.dans_panier &&
                Number(seat.id_utilisateur) === Number(userStore.userId)
              "
              src="/SelectionnedSeat.svg"
              class="ImgSeat" />
            <img
              v-else-if="seat.state === 'selected'"
              src="/SelectionnedSeat.svg"
              class="ImgSeat" />
            <img v-else src="/AvailableSeat.svg" class="ImgSeat" />
          </button>
        </div>

        <div v-if="selectedSeats.length" class="SeatInfo">
          <h3>Sièges sélectionnés</h3>

          <ul>
            <li
              v-for="seat in selectedSeats"
              :key="seat.numero_colonne + seat.numero_ligne">
              {{ seat.numero_colonne }}{{ seat.numero_ligne }} –
              {{ getSeatPrice(seat) }} €
            </li>
          </ul>

          <p>
            <b>Total : {{ PrixTotal }} €</b>
          </p>

          <button @click="AddToCart" class="pointer">Ajouter au panier</button>
        </div>
      </div>

      <button @click="resetSelection">Réinitialiser la sélection</button>

      <span v-if="estAjoute">
        Vous avez bien ajouté ces articles dans votre panier
      </span>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavBar from "../components/NavView.vue";
import Footer from "../components/Footer.vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";

const route = useRoute();
const zone = route.params.zone;

const userStore = useUserStore();

const seats = ref([]);
const hoverIndex = ref(null);
const estAjoute = ref(false);

const selectedSeats = computed(() =>
  seats.value.filter((seat) => seat.state === "selected")
);

function getSeatPrice(seat) {
  if (!seat) return 0;
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}
//C'est moche de doubler il faudra changer ca
const PrixTotal = computed(() => {
  return selectedSeats.value.reduce((sum, seat) => {
    if (["I", "H", "G"].includes(seat.numero_colonne)) return sum + 25;
    if (["F", "E", "D"].includes(seat.numero_colonne)) return sum + 18;
    return sum + 12;
  }, 0);
});

function saveSelection() {
  const saved = seats.value
    .filter((seat) => seat.state === "selected")
    .map((seat) => ({
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
    }));

  localStorage.setItem("selectedSeats", JSON.stringify(saved));
}

function restoreSelection() {
  const saved = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

  seats.value.forEach((seat) => {
    const found = saved.find(
      (s) =>
        s.numero_colonne === seat.numero_colonne &&
        s.numero_ligne === seat.numero_ligne &&
        s.zone === seat.zone
    );

    if (found && seat.state === "available") {
      seat.state = "selected";
    }
  });
}

async function fetchGradin() {
  const res = await axios.get("http://localhost:3000/gradin/show");

  seats.value = res.data
    .filter((seat) => seat.zone === zone.toUpperCase())
    .map((seat) => {
      let state = "available";

      if (
        seat.est_reserve &&
        Number(seat.id_utilisateur) === Number(userStore.userId)
      ) {
        state = "owned";
      } else if (seat.est_reserve) {
        state = "reserved";
      } else if (
        seat.dans_panier &&
        Number(seat.id_utilisateur) === Number(userStore.userId)
      ) {
        state = "selected";
      }

      return { ...seat, state };
    });

  restoreSelection();
}

function UpdateSiegeStatus(index) {
  const seat = seats.value[index];

  if (seat.state === "reserved" || seat.state === "owned") return;

  seat.state = seat.state === "available" ? "selected" : "available";
  saveSelection();
}

async function AddToCart() {
  if (!selectedSeats.value.length) return;

  estAjoute.value = true;

  for (const seat of selectedSeats.value) {
    await axios.put("http://localhost:3000/gradin/panier", {
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      dans_panier: true,
      id_utilisateur: userStore.userId,
    });
  }

  await fetchGradin();
}

function resetSelection() {
  seats.value.forEach((seat) => {
    if (seat.state === "selected" && !seat.dans_panier) {
      seat.state = "available";
    }
  });

  localStorage.removeItem("selectedSeats");
}

onMounted(fetchGradin);
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
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.SeatInfo h3 {
  margin-top: 0;
}

.SeatInfo button {
  width: 100%;
  padding: 8px;
  font-weight: bold;
}
</style>
