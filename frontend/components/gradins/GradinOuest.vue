<template>
  <div>
    <NavBar />
    <h1>Gradin Ouest</h1>

    <section>
      <p class="legend">Cliquez sur une place pour réserver / annuler</p>
      Il faut que cette page soit accessible seulement si on est connecté
      <router-link to="/gradins/GradinSud" class="">
        Gradin précédent
      </router-link>
      <router-link to="/gradins/GradinNord" class="">
        Gradin suivant
      </router-link>
      <div class="seatContainer">
        <button
          class="Seat"
          v-for="(seat, index) in seats"
          :key="index"
          @mouseover="hoverIndex = index"
          @mouseleave="hoverIndex = null">
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
      <router-link to="/gradins/ReservationOuest" class=""
        >Réservation d'un billet</router-link
      >
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
const seats = ref(Array(100));

async function fetchGradin() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/show");

    seats.value = res.data
      .filter((seat) => seat.zone === "OUEST")
      .map((seat) => (seat.est_reserve ? "reserved" : "available"));
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
