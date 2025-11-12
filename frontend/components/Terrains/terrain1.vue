<template>
  <NavView></NavView>

  <router-link to="/Terrains/terrain_4" class="btnLink"
    >terrain précedent</router-link
  >
  <router-link to="/Terrains/terrain_2" class="btnLink"
    >terrain suivant</router-link
  >
  <br /><br /><br /><br />
  <div class="terrainConteneur">
    <div class="image">
      <img src="../../images/TerrainUnique.png" alt="Image terrain Unique " />
    </div>
    <div class="LogoPersonne">
      <img
        v-for="index in nombreDeJoueur"
        :key="index"
        src="../../images/LogoPersonne.png"
        alt="personne" />
    </div>
    <div class="LogoPersonne2">
      <img
        v-for="index in nombreDeJoueur"
        :key="index"
        src="../../images/LogoPersonne.png"
        alt="personne" />
    </div>
  </div>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref } from "vue";
const nombreDeJoueur = ref(6);
</script>

<style></style>

<style scoped>
.image {
  width: 75%;
  margin: auto;
}
.LogoPersonne {
  max-width: 210px;
  transform: rotate(-90deg);
  margin-left: 650px;
}
.LogoPersonne2 {
  max-width: 210px;
  transform: rotate(90deg);
}
.LogoPersonne,
.LogoPersonne2 img {
  width: 55px;
}
</style>
