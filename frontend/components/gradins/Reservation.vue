<template>
  <div>
    <NavBar />
    <h1>Gradin Nord</h1>

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

      <p>Sièges sélectionnés :</p>
      <p v-if="selectedSeats.length === 0">Aucun siège sélectionné</p>
      <p v-else>{{ selectedSeatsLabel }}</p>

      <button>Passer à la banque</button>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavBar from "../NavView.vue";
import Footer from "../Footer.vue";
import axios from "axios";

const hoverIndex = ref(null);
const seats = ref([]);

async function fetchGradin() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/show");

    seats.value = res.data.map((seat) => ({
      ...seat,
      state: seat.est_reserve ? "reserved" : "available",
    }));
  } catch (err) {
    console.error(err);
  }
}

function SeatReservation(index) {
  const seat = seats.value[index];

  if (seat.state === "reserved") return;

  if (seat.state === "available") {
    seat.state = "selected";
  } else if (seat.state === "selected") {
    seat.state = "available";
  }
}

const selectedSeats = computed(() =>
  seats.value.filter((s) => s.state === "selected")
);

const selectedSeatsLabel = computed(() =>
  selectedSeats.value
    .map((s) => `${s.numero_colonne}${s.numero_ligne}`)
    .join(", ")
);

function reset() {}
onMounted(() => {
  fetchGradin();
});
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
