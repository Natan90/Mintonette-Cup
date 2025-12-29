<template>
  <NavView />

  <router-link to="/Terrains/terrain_4" class="btnLink">
    terrain précédent
  </router-link>
  <router-link to="/Terrains/terrain_2" class="btnLink">
    terrain suivant
  </router-link>

  <div>
    <button
      v-for="(elt, index) in article"
      :key="index"
      @click="selectArticle(index)"
      class="matchTitle">
      {{ elt.nom }}
    </button>
  </div>
  <div v-if="descriArticle[selectedItem]">
    {{ descriArticle[selectedItem].descri }}
  </div>

  <p>Dans la bdd rajouter dans le 6 majeurs ou non</p>

  <div class="terrainConteneur">
    <div class="terrainLayout">
      <div class="image" @click="selectedPlayer = null">
        <div class="rightTeam , pointer">
          <div
            v-for="player in getMajorPlayers(getSelectedTeams().team1)"
            :key="player.id_joueur"
            class="player">
            <img :src="logoPersonne" @click.stop="moreInfo(player)" />
            <span class="name">
              {{ player.prenom_joueur }} {{ player.nom_joueur }}
            </span>
          </div>
        </div>

        <div class="leftTeam , pointer">
          <div
            v-for="player in getMajorPlayers(getSelectedTeams().team2)"
            :key="player.id_joueur"
            class="player">
            <img :src="logoPersonne" @click.stop="moreInfo(player)" />
            <span class="name">
              {{ player.prenom_joueur }} {{ player.nom_joueur }}
            </span>
          </div>
        </div>
      </div>

      <div class="sideCard">
        <div v-if="selectedPlayer" class="playerCard">
          <h4>
            {{ selectedPlayer.prenom_joueur }}
            {{ selectedPlayer.nom_joueur }}
          </h4>
          <p><strong>Poste :</strong> {{ selectedPlayer.poste }}</p>
          <p><strong>Âge :</strong> {{ getAge(selectedPlayer) }} ans</p>
          <p><strong>Taille :</strong> {{ selectedPlayer.taille }} cm</p>
        </div>
      </div>
    </div>

    <div>
      <h4>Remplaçants Équipe 1</h4>
      <ul>
        <li
          v-for="player in getSubstitutes(getSelectedTeams().team1)"
          :key="player.id_joueur">
          {{ player.prenom_joueur }} {{ player.nom_joueur }}
        </li>
      </ul>
    </div>

    <div>
      <h4>Remplaçants Équipe 2</h4>
      <ul>
        <li
          v-for="player in getSubstitutes(getSelectedTeams().team2)"
          :key="player.id_joueur">
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

import logoPersonne from "@/images/LogoPersonne.png";

const players = ref([]);
const selectedItem = ref(0);
const selectedPlayer = ref(null);

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
  return players.value.filter((p) => p.id_equipe === teamId).slice(6); // A partir du 7e joueur (id 6)
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
function moreInfo(player) {
  selectedPlayer.value = player;
}

function getAge(player) {
  if (!player || !player.date_naissance_joueur) return null;

  const birthDate = new Date(player.date_naissance_joueur);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  return age;
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
.rightTeam,
.leftTeam {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  column-gap: 120px;
  row-gap: 30px;
}

.rightTeam {
  right: 20%;
}

.leftTeam {
  left: 20%;
}

.player {
  width: 90px;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.player .name {
  font-size: 12px;
  color: white;
  margin-top: 4px;
  text-align: center;
}
.matchTitle {
  width: auto;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

/* A faire  ###################################################################### */
.playerCard {
  position: absolute;
  top: 52%;
  left: 10%;
  transform: translateX(-50%);
  width: 220px;
  padding: 12px;
  border-radius: 10px;
  z-index: 10;
  box-shadow: 5px 5px 5px rgb(103, 103, 103);
}
.playerCard p {
  margin: 4px 0;
  font-size: 12px;
}
</style>
