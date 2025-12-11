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

      <p>Panier : {{ cartSeats.length }} sièges – {{ cartTotal }} €</p>

      <button @click="resetCart">Réinitialiser les places</button>
       <button @click="forceUpdate()">
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

const cartSeats = ref([]);
const hoverIndex = ref(null);
const seats = ref([]);

const cartTotal = computed(() => {
  return cartSeats.value.reduce((sum, seat) => {
    if (["I", "H", "G"].includes(seat.numero_colonne)) return sum + 25;
    if (["F", "E", "D"].includes(seat.numero_colonne)) return sum + 18;
    return sum + 12;
  }, 0);
});

async function fetchCart() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/panier/show");
    cartSeats.value = res.data;
  } catch (err) {
    console.error(err);
  }
}

async function fetchGradin() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/show");

    await fetchCart();

    seats.value = res.data
      .filter((seat) => seat.zone === "NORD")
      .map((seat) => {
        let state = "available";
        if (seat.est_reserve) state = "reserved";
        else if (seat.dans_panier) state = "selected";
        return { ...seat, state };
      });
  } catch (err) {
    console.error(err);
  }
}

async function SeatReservation(index) {
  const seat = seats.value[index];
  if (seat.state === "reserved") return;

  if (seat.state === "available") {
    seat.state = "selected";
    await axios.put("http://localhost:3000/gradin/panier", {
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      dans_panier: true,
    });
  } else if (seat.state === "selected") {
    seat.state = "available";
    await axios.put("http://localhost:3000/gradin/panier", {
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      dans_panier: false,
    });
  }

  await fetchCart();
}

async function resetCart() {
  for (const seat of cartSeats.value) {
    await axios.put("http://localhost:3000/gradin/panier", {
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      dans_panier: false,
    });
  }
  await fetchGradin();
  await fetchCart();
}

onMounted(() => {
  try {
    fetchGradin();
  } catch (err) {
    console.log(err);
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
