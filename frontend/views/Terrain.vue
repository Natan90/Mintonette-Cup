<template>
  <NavView />

  <div class="pageContainer" v-if="selectedMatch">
    <div class="navMatch">
      <router-link
        :to="{
          name: 'Terrain',
          params: { lang: lang.value, id: terrainId - 1 || 4 },
        }"
        class="button">
        ⬅ Terrain précédent
      </router-link>

      <router-link
        :to="{
          name: 'Terrain',
          params: { lang: lang.value, id: (terrainId % 4) + 1 },
        }"
        class="button">
        Terrain suivant ➡
      </router-link>
    </div>

    <div class="matchHeader">
      <h2>Mintonette Cup – Terrain {{ terrainId }}</h2>
    </div>

    <div class="matchSelector">
      <button
        v-for="(match, index) in matches"
        :key="match.id_match"
        @click="selectedItem = index"
        :class="['matchTitle pointer', { active: index === selectedItem }]">
        {{ match.team1_country }} - {{ match.team2_country }}
      </button>
    </div>

    <div class="matchHeader">
      <h3>
        {{ selectedMatch.team1_country }}
        <span>VS</span>
        {{ selectedMatch.team2_country }}
      </h3>
      <p class="matchTime">Heure : {{ matchTime }}</p>
    </div>

    <div class="terrainConteneur">
      <div class="terrainLayout">
        <div
          class="image"
          :style="{ backgroundImage: `url(${terrainImage})` }"
          @click="selectedPlayer = null">
          <div class="rightTeam pointer">
            <div
              v-for="player in getMajorPlayers(selectedMatch.team2_id)"
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
              v-for="player in getMajorPlayers(selectedMatch.team1_id)"
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
            {{ selectedPlayer.prenom_joueur }}
            {{ selectedPlayer.nom_joueur }}
          </h4>
          <p><strong>Poste :</strong> {{ selectedPlayer.poste }}</p>
          <p><strong>Âge :</strong> {{ getAge(selectedPlayer) }} ans</p>
          <p><strong>Taille :</strong> {{ selectedPlayer.taille }} cm</p>
        </div>
      </div>

      <br />

      <div class="subsContainer">
        <div class="subPlayer">
          <h3>{{ selectedMatch.team1_country }}</h3>
          <p>
            Coach :
            <b>{{ selectedMatch.team1_coach }}</b>
          </p>
          <h4>Remplaçants</h4>
          <ul>
            <li
              v-for="player in getSubstitutes(selectedMatch.team1_id)"
              :key="player.id_joueur">
              {{ player.prenom_joueur }} {{ player.nom_joueur }}
            </li>
          </ul>
        </div>

        <div class="subPlayer">
          <h3>{{ selectedMatch.team2_country }}</h3>
          <p>
            Coach :
            <b>{{ selectedMatch.team2_coach }}</b>
          </p>
          <h4>Remplaçants</h4>
          <ul>
            <li
              v-for="player in getSubstitutes(selectedMatch.team2_id)"
              :key="player.id_joueur">
              {{ player.prenom_joueur }} {{ player.nom_joueur }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <router-link
    :to="{
      name: 'Gradin',
      params: {
        lang: lang.value,
        zone: terrainToZone[terrainId],
      },
    }"
    class="button">
    Réserver votre billet dès à présent
  </router-link>
  >
  <Footer></Footer>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import logoPersonne from "@/images/LogoPersonne.png";
import terrainImage from "@/images/TerrainSans.png";
import Footer from "@/components/Footer.vue";

const terrainToZone = {
  1: "nord",
  2: "est",
  3: "sud",
  4: "ouest",
};

const route = useRoute();
const terrainId = computed(() => Number(route.params.id));

const players = ref([]);
const matches = ref([]);
const selectedItem = ref(0);
const selectedPlayer = ref(null);
const cardSide = ref("right");

//La langue
const lang = computed(() => route.params.lang);

const selectedMatch = computed(() => matches.value[selectedItem.value]);

const matchTime = computed(() => {
  if (!selectedMatch.value) return "";
  const date = new Date(selectedMatch.value.date_match);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
});

async function fetchPlayers() {
  const res = await axios.get("http://localhost:3000/equipes/players");
  players.value = res.data;
}

async function fetchMatches() {
  const res = await axios.get(
    `http://localhost:3000/equipes/match/terrain/${terrainId.value}`
  );
  matches.value = res.data;
  selectedItem.value = 0;
}

function getMajorPlayers(teamId) {
  return players.value.filter((p) => p.id_equipe === teamId).slice(0, 6);
}

function getSubstitutes(teamId) {
  return players.value.filter((p) => p.id_equipe === teamId).slice(6);
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
  fetchPlayers();
  fetchMatches();
});

watch(terrainId, () => {
  fetchMatches();
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
  width: 250px;
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
  aspect-ratio: 16/9;
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
