<template>
  <NavView></NavView>

  <router-link to="/Terrains/terrain_4" class="btnLink">
    terrain précédent
  </router-link>
  <router-link to="/Terrains/terrain_2" class="btnLink">
    terrain suivant
  </router-link>

  <div>
    <span v-for="(elt, index) in article" :key="index">
      <button>
        <div :id="'id' + index" @click="selectArticle(index)">
          {{ elt.nom }}
        </div>
      </button>
    </span>
    <div
      v-if="descriArticle[selectedItem] && descriArticle[selectedItem].descri">
      {{ descriArticle[selectedItem].descri }}
    </div>
  </div>

  <p>Dans la bdd rajouter dans le 6 majeurs ou non</p>
  <div class="terrainConteneur">
    <div class="image">


      <div class="rightTeam">
        <div
          v-for="player in getMajorPlayers(getSelectedTeams().team1)"
          :key="player.id_joueur"
          class="player">
          <img
            :src="'../../images/LogoPersonne.png'"
            :alt="player.nom_joueur" />
        </div>
      </div>

      <div class="leftTeam">
        <div
          v-for="player in getMajorPlayers(getSelectedTeams().team2)"
          :key="player.id_joueur"
          class="player">
          <img
            :src=" '../../images/LogoPersonne.png'"
            :alt="player.nom_joueur" />
        </div>
      </div>

    </div>
    <div>
      <h4>Remplaçants Équipe 1</h4>
      <ul>
        <li v-for="player in getSubstitutes(getSelectedTeams().team1)" :key="player.id_joueur">
          {{ player.prenom_joueur }} {{ player.nom_joueur }}
        </li>
      </ul>
    </div>
    <div>
      <h4>Remplaçants Équipe 2</h4>
      <ul>
        <li v-for="player in getSubstitutes(getSelectedTeams().team2)" :key="player.id_joueur">
          {{ player.prenom_joueur }} {{ player.nom_joueur }}
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
const selectedItem = ref(0);

async function fetchPlayer() {
  try {
    const res = await axios.get("http://localhost:3000/equipe/showPlayer");
    players.value = res.data;
  } catch (err) {
    console.error("Erreur API:", err);
  }
}

//Les 6 premiers sont titulaires
function getMajorPlayers(teamId) {
  return players.value.filter((p) => p.id_equipe === teamId).slice(0, 6);
}

function getSubstitutes(teamId) {
  return players.value.filter((p) => p.id_equipe === teamId).slice(6); // A partir du 7e joueur
}

const article = [
  { nom: "France - Argentine", team1Id: 1, team2Id: 3 },
  { nom: "Espagne - Corée du Sud", team1Id: 20, team2Id: 24 },
  { nom: "Italie - Japon", team1Id: 4, team2Id: 14 },
  { nom: "Allemagne - Canada", team1Id: 2, team2Id: 5 },
];


const descriArticle = [
  { descri: "Match 1" },
  { descri: "Match 2" },
  { descri: "Match 3" },
  { descri: "Match 4" },
];
function selectArticle(id) {
  if (id >= article.length) return;
  selectedItem.value = id;
}

function getSelectedTeams() {
  const match = article[selectedItem.value];
  return { team1: match.team1Id, team2: match.team2Id };
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
