<template>
  <div>
    <NavBar />
    <h1>Gradin Nord</h1>

    <section>
      <p class="legend">Cliquez sur une place pour réserver / annuler</p>
      Il faut que cette page soit accessible seulement si on est connecté

      <div class="seatContainer">
        <button
          class="Seat"
          v-for="(placeNumber, index) in 100"
          :key="index"
          @mouseover="hoverIndex = index"
          @mouseleave="hoverIndex = null"
          @click="isAvailable(index)">
          <img
            v-if="hoverIndex === index && seats[index] === 'available'"
            src="/AvailableSeatHover.svg"
            alt="Siège disponible"
            class="ImgSeat" />
          <img
            v-else-if="seats[index] === 'reserved'"
            src="/ReservedSeat.svg"
            alt="Siège réservé"
            class="ImgSeat" />
          <img
            v-else
            src="/AvailableSeat.svg"
            alt="Siège disponible"
            class="ImgSeat" />
        </button>
      </div>
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

    seats.value = res.data.map((seat) => {
      if (seat.est_reserve === true) {
        return "reserved";
      } else {
        return "available";
      }
    });
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  try {
    fetchGradin();
  } catch (err) {
    console.error(err);
  }
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
