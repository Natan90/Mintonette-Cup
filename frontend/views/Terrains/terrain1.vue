<template>
  <NavView></NavView>

  <router-link to="/Terrains/terrain_4" class="btnLink">
    terrain précédent
  </router-link>
  <router-link to="/Terrains/terrain_2" class="btnLink">
    terrain suivant
  </router-link>
  <p>Dans la bdd rajouter dans le 6 majeurs ou non</p>
  <div class="terrainConteneur">
    <div class="image">
      <div class="terrain">
        <div class="equipe gauche">
          <img
            v-for="i in 6"
            :key="'g' + i"
            src="../../images/LogoPersonne.png"
            alt="personne" />
        </div>

        <div class="equipe droite">
          <img
            v-for="i in 6"
            :key="'d' + i"
            src="../../images/LogoPersonne.png"
            alt="personne" />
        </div>
      </div>
      <ul>
        <li v-for="player in players" :key="player.id_joueur">
          {{ player.nom_joueur }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const players = ref([]);

async function fetchPlayer() {
  try {
    const res = await axios.get("http://localhost:3000/equipe/showPlayer");
    console.log("PLAYERS:", res.data); // 👈 DEBUG
    players.value = res.data;
  } catch (err) {
    console.error("Erreur API:", err);
  }
}

onMounted(fetchPlayer);
</script>

<style scoped>
.image {
  width: 75%;
  aspect-ratio: 16/9;
  margin: auto;
  background-image: url("../../images/TerrainSans.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: relative;
}

.terrain {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.equipe {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  align-items: center;
}

.equipe img {
  width: 80px;
  height: 80px;
}
</style>
