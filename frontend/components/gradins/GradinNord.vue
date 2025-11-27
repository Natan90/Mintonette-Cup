<template>
  <div>
    <NavBar />
    <h1>Gradin Nord</h1>
    <section>
      <p class="legend">Cliquez sur une place pour réserver / annuler</p>

      <div class="seatJsp">
        <button
          class="seat"
          v-for="(placeNumber, index) in 100"
          :key="index"
          @click="toggleSeat(placeNumber)"
          :class="{ reserved: reservedSeats.includes(placeNumber) }">
          <img src="/AvailableSeat.svg" alt="Siège disponible" class/>
        </button>
      </div>

     
    </section>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import NavBar from "../NavView.vue";
import Footer from "../Footer.vue";

const reservedSeats = ref([]);

function toggleSeat(placeNumber) {
  if (reservedSeats.value.includes(placeNumber)) {
    reservedSeats.value = reservedSeats.value.filter((n) => n !== placeNumber);
  } else {
    reservedSeats.value.push(placeNumber);
  }
}
</script>

<style scoped>
.seatJsp {
  display: grid;
  justify-content: center; 
  grid-template-columns: repeat(12, 60px); 
  gap: 10px;
  margin-top: 16px;
}

.seat {
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.seat img.seat-icon {
  width: 70px;
  height: 70px;
  opacity: 0.4; 
  pointer-events: none; 
}

.NumberSeat {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #000; 
  pointer-events: none;
}


</style>
