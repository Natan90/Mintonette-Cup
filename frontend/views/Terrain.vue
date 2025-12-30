<template>
  <NavView />

  <div class="pageContainer">
    <div class="navMatch">
      <router-link
        :to="{ name: 'Terrain', params: { id: terrainId - 1 } }"
        class="button">
        ⬅ Terrain précédent
      </router-link>

      <router-link
        :to="{ name: 'Terrain', params: { id: terrainId - 1 } }"
        class="button">
        Terrain suivant ➡
      </router-link>
    </div>

    <div class="matchHeader">
      <h2>Mintonette Cup – Terrain {{ terrainId }}</h2>
    </div>

    <div class="matchSelector">
      <button
        v-for="(elt, index) in article"
        :key="index"
        @click="selectArticle(index)"
        :class="['matchTitle pointer', { active: index === selectedItem }]">
        {{ getCountry(elt.team1Id) }} - {{ getCountry(elt.team2Id) }}
      </button>
    </div>

    <div class="matchHeader" v-if="article[selectedItem]">
      <h3>
        {{ getCountry(article[selectedItem].team1Id) }}
        <span>VS</span>
        {{ getCountry(article[selectedItem].team2Id) }}
      </h3>
    </div>

    <div class="terrainConteneur">
      <div class="terrainLayout">
        <div class="image" @click="selectedPlayer = null">
          <div class="rightTeam pointer">
            <div
              v-for="player in getMajorPlayers(getSelectedTeams().team1)"
              :key="player.id_joueur"
              class="player">
              <img
                :src="logoPersonne"
                @click.stop="moreInfo(player, 'right')" />
              <span class="name">
                {{ player.prenom_joueur }} {{ player.nom_joueur }}
              </span>
            </div>
          </div>

          <div class="leftTeam pointer">
            <div
              v-for="player in getMajorPlayers(getSelectedTeams().team2)"
              :key="player.id_joueur"
              class="player">
              <img :src="logoPersonne" @click.stop="moreInfo(player, 'left')" />
              <span class="name">
                {{ player.prenom_joueur }} {{ player.nom_joueur }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="selectedPlayer" class="playerCard" :class="cardSide">
          <h4>
            {{ selectedPlayer.prenom_joueur }} {{ selectedPlayer.nom_joueur }}
          </h4>
          <p><strong>Poste :</strong> {{ selectedPlayer.poste }}</p>
          <p><strong>Âge :</strong> {{ getAge(selectedPlayer) }} ans</p>
          <p><strong>Taille :</strong> {{ selectedPlayer.taille }} cm</p>
        </div>
      </div>

      <br />

      <div class="subsContainer">
        <div class="subPlayer">
          <h3>{{ getCountry(getSelectedTeams().team1) }}</h3>
          <p>
            Coach :
            <b>{{ getCoach(getSelectedTeams().team1) }}</b>
          </p>
          <h4>Remplaçants</h4>
          <ul>
            <li
              v-for="player in getSubstitutes(getSelectedTeams().team1)"
              :key="player.id_joueur">
              {{ player.prenom_joueur }} {{ player.nom_joueur }}
            </li>
          </ul>
        </div>

        <div class="subPlayer">
          <h3>{{ getCountry(getSelectedTeams().team2) }}</h3>
          <p>
            Coach :
            <b>{{ getCoach(getSelectedTeams().team2) }}</b>
          </p>
          <h4>Remplaçants</h4>
          <ul>
            <li
              v-for="player in getSubstitutes(getSelectedTeams().team2)"
              :key="player.id_joueur">
              {{ player.prenom_joueur }} {{ player.nom_joueur }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import logoPersonne from "@/images/LogoPersonne.png";

const route = useRoute();
const terrainId = computed(() => Number(route.params.id));
const maxTerrain = 4;

const players = ref([]);
const team = ref([]);
const selectedItem = ref(0);
const selectedPlayer = ref(null);
const cardSide = ref("right");

async function fetchPlayer() {
  const res = await axios.get("http://localhost:3000/equipe/showPlayer");
  players.value = res.data;
}

async function fetchTeam() {
  const res = await axios.get("http://localhost:3000/equipe/showTeam");
  team.value = res.data;
}

const article = [
  { team1Id: 1, team2Id: 3 },
  { team1Id: 20, team2Id: 24 },
  { team1Id: 4, team2Id: 14 },
  { team1Id: 2, team2Id: 5 },
];

function selectArticle(id) {
  selectedItem.value = id;
}

function getSelectedTeams() {
  return article[selectedItem.value];
}

function getMajorPlayers(teamId) {
  return players.value.filter((p) => p.id_equipe === teamId).slice(0, 6);
}

function getSubstitutes(teamId) {
  return players.value.filter((p) => p.id_equipe === teamId).slice(6);
}

function getCoach(teamId) {
  const found = team.value.find((t) => t.id_equipe === teamId);
  return found ? found.entraineur : "Inconnu";
}

function getCountry(teamId) {
  const p = players.value.find((p) => p.id_equipe === teamId);
  return p ? p.pays : "Inconnu";
}

function moreInfo(player, side) {
  selectedPlayer.value = player;
  cardSide.value = side;
}

function getAge(player) {
  return (
    new Date().getFullYear() -
    new Date(player.date_naissance_joueur).getFullYear()
  );
}

onMounted(() => {
  fetchPlayer();
  fetchTeam();
});
</script>

<style scoped>
.pageContainer {
  max-width: 1200px;
  margin: auto;
}

.navMatch {
  display: flex;
  justify-content: space-between;
}

.button {
  background: #00167a;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  transition: 0.2s ease-in-out;
}
.matchSelector {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.matchTitle {
  padding: 10px 18px;
  border-radius: 20px;
  background-color: #e6e9f5;
  color: #00167a;
  font-weight: 600;
  transition: 0.2s ease-in-out;
}

.matchTitle.active,
.matchTitle:hover {
  background-color: #00167a;
  color: white;
}

.matchHeader {
  text-align: center;
  margin-bottom: 20px;
}

.matchHeader span {
  margin: 0 10px;
  color: #00167a;
}

.image {
  width: 100%;
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
  right: 22%;
}

.leftTeam {
  left: 22%;
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

.playerCard {
  position: absolute;
  top: 70%;
  width: 230px;
  background: transparent;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.playerCard.right {
  right: 0%;
}

.playerCard.left {
  left: 2%;
}

.subsContainer {
  display: flex;
  gap: 20px;
}

.subPlayer {
  flex: 1;
  background: #f6f7fb;
  border-radius: 12px;
  padding: 16px;
}

.subPlayer h3 {
  color: #00167a;
  text-align: center;
}

.subPlayer li {
  list-style: none;
  margin-bottom: 6px;
}
.subPlayer li:hover {
  font-weight: 500;
}
</style>
