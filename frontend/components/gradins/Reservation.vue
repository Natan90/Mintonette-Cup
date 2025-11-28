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
            v-if="hoverIndex === index && seat === 'available'"
            src="/AvailableSeatHover.svg"
            alt="Siège disponible"
            class="ImgSeat" />
          <img
            v-else-if="seat === 'reserved'"
            src="/ReservedSeat.svg"
            alt="Siège réservé"
            class="ImgSeat" />
          <img
            v-else-if="seat === 'selected'"
            src="/SelectionnedSeat.svg"
            alt="Siège sélectionné"
            class="ImgSeat" />
          <img
            v-else
            src="/AvailableSeat.svg"
            alt="Siège disponible"
            class="ImgSeat" />
        </button>
      </div>
      <button>Passer à la banque</button>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "../NavView.vue";
import Footer from "../Footer.vue";
import axios from "axios";

const hoverIndex = ref(null);
const seats = ref(Array(100).fill("available"));

async function fetchGradin() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/show");
    seats.value = res.data.map((seat) =>
      seat.est_reserve === true ? "reserved" : "available"
    );
  } catch (err) {
    console.error(err);
  }
}

function SeatReservation(index) {
  if (seats.value[index] === "reserved") {
    alert("Non pas possible");
    return;
  }

  if (seats.value[index] === "available") {
    seats.value[index] = "selected";
  } else if (seats.value[index] === "selected") {
    seats.value[index] = "available";
  }
}

onMounted(() => {
  fetchGradin();
});
</script>

<style scoped>
.seatContainer {
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
