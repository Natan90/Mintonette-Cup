<template>
  <div>
    <NavBar />
    <h1>Gradin Nord</h1>
<p>Rajouter les prix a coté du siegex</p>
    <section>
      <h2>Réservation de place</h2>

      <div class="seatContainer">
        <button
          class="Seat"
          v-for="(seat, index) in seats"
          :key="index"
          @mouseover="hoverIndex = index"
          @mouseleave="hoverIndex = null"
          @click="SeatReservation(index)">
          <img
            v-if="hoverIndex === index && seat.state === 'available'"
            src="/AvailableSeatHover.svg"
            class="ImgSeat" />
          <img
            v-else-if="seat.state === 'reserved'"
            src="/ReservedSeat.svg"
            class="ImgSeat" />
          <img
            v-else-if="seat.state === 'selected'"
            src="/SelectionnedSeat.svg"
            class="ImgSeat" />
          <img v-else src="/AvailableSeat.svg" class="ImgSeat" />
        </button>
      </div>

      <button @click="resetSelection">Réinitialiser la sélection</button>
      <button @click="AjoutPanier">
        <span class="pointer optionNav">Ajouter au panier</span>
      </button>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavBar from "../NavView.vue";
import Footer from "../Footer.vue";
import axios from "axios";

const seats = ref([]);
const hoverIndex = ref(null);

const selectedSeats = computed(() =>
  seats.value.filter((seat) => seat.state === "selected")
);

const selectedCount = computed(() => selectedSeats.value.length);

const PrixTotal = computed(() => {
  return selectedSeats.value.reduce((sum, seat) => {
    if (["I", "H", "G"].includes(seat.numero_colonne)) return sum + 25;
    if (["F", "E", "D"].includes(seat.numero_colonne)) return sum + 18;
    return sum + 12;
  }, 0);
});

async function fetchGradin() {
  const res = await axios.get("http://localhost:3000/gradin/show");

  seats.value = res.data
    .filter((seat) => seat.zone === "NORD")
    .map((seat) => {
      let state = "available";
      if (seat.est_reserve) state = "reserved";
      return { ...seat, state };
    });
}

function SeatReservation(index) {
  const seat = seats.value[index];
  if (seat.state === "reserved") return;

  seat.state = seat.state === "available" ? "selected" : "available";
}

async function AjoutPanier() {
  for (const seat of selectedSeats.value) {
    await axios.put("http://localhost:3000/gradin/panier", {
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      dans_panier: true,
    });
  }

  await fetchGradin();
}

function resetSelection() {
  seats.value.forEach((seat) => {
    if (seat.state === "selected") seat.state = "available";
  });
}

onMounted(fetchGradin);
</script>

<style scoped>
.seatContainer {
  user-select: none;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(12, 60px);
  gap: 10px;
  margin-top: 16px;
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
</style>
