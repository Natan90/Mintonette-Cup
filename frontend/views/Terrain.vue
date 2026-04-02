<template>
  <NavView />

  <div class="pageContainer" v-if="selectedMatch">
    <router-link
      :to="{ name: 'Home', params: { lang: locale } }"
      class="button homeButton">
      ← {{ $t("terrain.retourAccueil") }}
    </router-link>
    <div class="navMatch">
      <router-link
        :to="{
          name: 'Terrain',
          params: { lang, id: terrainId - 1 || 4 },
        }"
        class="button">
        ⬅ {{ $t("terrain.terrainPrecedent") }}
      </router-link>

      <router-link
        :to="{
          name: 'Terrain',
          params: { lang, id: (terrainId % 4) + 1 },
        }"
        class="button">
        {{ $t("terrain.terrainSuivant") }} ➡
      </router-link>
    </div>

    <div class="matchHeader">
      <h2>Mintonette Cup – {{ $t("terrain.terrain") }} {{ terrainId }}</h2>
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
      <p class="matchTime">{{ $t("terrain.heure") }} : {{ matchTime }}</p>
    </div>

    <div class="terrainConteneur">
      <div class="terrainLayout">
        <div
          class="image"
          :style="{ backgroundImage: `url(${terrainImage})` }"
          @click="selectedPlayer = null">
          <div class="rightTeam pointer">
            <div
              v-for="player in getMajorPlayers(selectedMatch.team2_id, 'right')"
              :key="player.id_joueur"
              class="player"
              :class="[
                player.terrainPosition,
                player.poste === 'Libero' ? 'libero' : '',
              ]">
              <img
                :src="
                  player.photo
                    ? `/Joueurs/${player.pays}/${player.photo}`
                    : logoPersonne
                "
                @click.stop="moreInfo(player, 'right')" />

              <span class="name">
                {{ player.prenom_joueur }} {{ player.nom_joueur }} 
              </span>
            </div>
          </div>

          <div class="leftTeam pointer">
            <div
              v-for="player in getMajorPlayers(selectedMatch.team1_id, 'left')"
              :key="player.id_joueur"
              class="player"
              :class="[
                player.terrainPosition,
                player.poste === 'Libero' ? 'libero' : '',
              ]">
              <img
                :src="
                  player.photo
                    ? `/Joueurs/${player.pays}/${player.photo}`
                    : logoPersonne
                "
                @click.stop="moreInfo(player, 'left')" />
              <span class="name">
                {{ player.prenom_joueur }} {{ player.nom_joueur }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="selectedPlayer" class="playerCard" :class="cardSide">
          <h4>
            {{ selectedPlayer.prenom_joueur }}
            {{ selectedPlayer.nom_joueur }} ({{(selectedPlayer.pays)}})
          </h4>
          <p>
            <strong>{{ $t("terrain.poste") }}:</strong>
            {{ selectedPlayer.poste }}
          </p>
          <p>
            <strong>{{ $t("terrain.age") }} :</strong>
            {{ getAge(selectedPlayer) }} {{ $t("terrain.ans") }}
          </p>
          <p>
            <strong>{{ $t("terrain.taille") }} :</strong>
            {{ selectedPlayer.taille * 100 }} cm
          </p>
        </div>
      </div>

      <br />

      <div class="subsContainer">
        <div class="subPlayer">
          <h3>{{ selectedMatch.team1_country }}</h3>
          <p>
            {{ $t("terrain.coach") }} :
            <b>{{ selectedMatch.team1_coach }}</b>
          </p>
          <h4>{{ $t("terrain.remplacants") }}</h4>
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
          <h4>{{ $t("terrain.remplacants") }}</h4>
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
    :to="
      user.isConnected
        ? {
            name: 'Gradin',
            params: {
              lang: lang,
              zone: terrainToZone[terrainId],
            },
          }
        : {
            name: 'Inscription_utilisateur',
            params: {
              lang: lang,
            },
          }
    "
    class="button">
    {{ $t("terrain.reserverBillet") }}
  </router-link>

  <Footer></Footer>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import logoPersonne from "@/images/LogoPersonne.png";
import terrainImage from "@/images/TerrainSans.png";
import Footer from "@/components/Footer.vue";
import { useEquipeStore } from "@/services/equipe.service";
import logPage from "@/components/LogPage.vue";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
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
const selectedItem = ref(1);
const selectedPlayer = ref(null);
const cardSide = ref("right");
const equipeStore = useEquipeStore();
const user = useUserStore();
//La langue
const lang = computed(() => route.params.lang);

const selectedMatch = computed(() => matches.value[selectedItem.value]);

const matchTime = computed(() => {
  if (!selectedMatch.value) return "";
  const date = new Date(selectedMatch.value.date_match);
  //padStart force à avoir deux valeurs et comble avec un 0: "5" -> "05"
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
});

onMounted(() => {
  fetchPlayers();
  fetchMatches();
});

watch(terrainId, () => {
  fetchMatches();
});

/**
 * Récupère la liste des joueurs pour tous les matchs du terrain sélectionné.
 */
async function fetchPlayers() {
  const res = await equipeStore.GetPlayer();

  players.value = res.data;
}
/**
 * Récupère les matchs associés au terrain courant.
 * Réinitialise également l’index du match sélectionné.
 */
async function fetchMatches() {
  const res = await equipeStore.GetMatchById(terrainId.value);
  matches.value = res.data;
  selectedItem.value = 0;
}
/**
 * Retourne les joueurs titulaires majeurs d’une équipe avec leur position sur le terrain.
 * La disposition dépend du côté (gauche/droite).
 *
 * @param teamId - Identifiant de l’équipe
 * @param side - Côté du terrain ("left" ou "right")
 */
function getMajorPlayers(teamId, side) {
  const teamPlayers = players.value.filter((p) => p.id_equipe === teamId);

  const findPlayerByPoste = (poste) => {
    const joueurs = teamPlayers.filter((p) => p.poste === poste);
    const avecPhoto = joueurs.find(
      (p) => p.photo !== null && p.photo !== undefined,
    );
    if (avecPhoto) return avecPhoto;
    return joueurs[0];
  };

  const passeur = findPlayerByPoste("Passeur");
  const central = findPlayerByPoste("Central");
  const attaquant = findPlayerByPoste("Attaquant");
  const libero = findPlayerByPoste("Libero");

  const receveursAll = teamPlayers.filter(
    (p) => p.poste === "Receveur-Attaquant",
  );
  const receveursAvecPhoto = receveursAll.filter(
    (p) => p.photo !== null && p.photo !== undefined,
  );
  const receveursSansPhoto = receveursAll.filter((p) => !p.photo);

  const receveurs = [...receveursAvecPhoto, ...receveursSansPhoto];

  const positions =
    side === "right"
      ? {
          passeur: "poste3",
          recep1: "poste4",
          central: "poste2",
          libero: "libero",
          attaquant: "poste1",
          recep2: "poste5",
        }
      : {
          passeur: "poste1",
          recep1: "poste4",
          central: "poste2",
          libero: "libero",
          attaquant: "poste3",
          recep2: "poste5",
        };

  return [
    passeur && { ...passeur, terrainPosition: positions.passeur },
    receveurs[0] && { ...receveurs[0], terrainPosition: positions.recep1 },
    central && { ...central, terrainPosition: positions.central },
    libero && { ...libero, terrainPosition: positions.libero },
    attaquant && { ...attaquant, terrainPosition: positions.attaquant },
    receveurs[1] && { ...receveurs[1], terrainPosition: positions.recep2 },
  ].filter(Boolean);
}
/**
 * Retourne la liste des joueurs remplaçants d’une équipe.
 *
 * @param teamId - Identifiant de l’équipe
 */
function getSubstitutes(teamId) {
  return players.value.filter((p) => p.id_equipe === teamId).slice(6);
}
/**
 * Définit le joueur sélectionné pour afficher sa fiche détaillée,
 * ainsi que le côté d’affichage de la carte.
 *
 * @param player - Joueur sélectionné
 * @param side - Côté d’affichage ("left" ou "right")
 */
function moreInfo(player, side) {
  selectedPlayer.value = player;
  cardSide.value = side;
}
/**
 * Calcule l’âge d’un joueur à partir de sa date de naissance.
 *
 * @param player - Objet joueur contenant `date_naissance_joueur`
 */
function getAge(player) {
  return (
    new Date().getFullYear() -
    new Date(player.date_naissance_joueur).getFullYear()
  );
}
</script>

<style scoped>
.pageContainer {
  max-width: 1200px;
  margin: auto;
  position: relative;
  padding-top: 52px;
}

.terrainConteneur {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.terrainLayout {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.navMatch {
  display: flex;
  justify-content: space-between;
}

.button {
  background: var(--primary-color);
  color: white;
  margin-top: 15px;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  transition: 0.2s ease-in-out;
}

.button:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(42, 82, 50, 0.18);
}

.homeButton {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15px;
  padding: 8px 12px;
  font-size: 0.92rem;
  border-radius: 5px;
  white-space: nowrap;
  margin-left: -155px;
}

.matchSelector {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.matchTitle {
  width: min(250px, calc(50% - 5px));
  padding: 8px 14px;
  border-radius: 16px;
  background-color: var(--rose-pale);
  color: var(--primary-dark);
  font-weight: 600;
  transition: 0.2s ease-in-out;
  box-sizing: border-box;
}
.matchTitle.active,
.matchTitle:hover {
  background-color: var(--rose-hover);
  color: white;
}

.matchHeader {
  text-align: center;
  margin-bottom: 20px;
}

.matchHeader span {
  margin: 0 10px;
  color: var(--rose-hover);
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
  width: 6vw;
  height: 6vw;
  max-width: 100px;
  max-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.player img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.leftTeam .poste4 {
  grid-column: 1;
  grid-row: 1;
}

.leftTeam .poste3 {
  grid-column: 2;
  grid-row: 1;
}

.leftTeam .poste2 {
  grid-column: 2;
  grid-row: 2;
}
.leftTeam .poste5 {
  grid-column: 1;
  grid-row: 3;
}

.leftTeam .poste1 {
  grid-column: 2;
  grid-row: 3;
}
.leftTeam .libero {
  grid-column: 1;
  grid-row: 2;
}
.rightTeam .poste4 {
  grid-column: 2;
  grid-row: 1;
}

.rightTeam .poste3 {
  grid-column: 1;
  grid-row: 1;
}

.rightTeam .poste2 {
  grid-column: 1;
  grid-row: 2;
}

.rightTeam .poste5 {
  grid-column: 2;
  grid-row: 3;
}

.rightTeam .poste1 {
  grid-column: 1;
  grid-row: 3;
}
.rightTeam .libero {
  grid-column: 2;
  grid-row: 2;
}

.player .name {
  font-size: 12px;
  color: white;
  margin-top: 4px;
  text-align: center;
}

.playerCard {
  position: static;
  width: 100%;
  background: transparent;
  margin-top: 6px;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.playerCard.right {
  left: auto;
  right: auto;
}

.playerCard.left {
  left: auto;
  right: auto;
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
  color: var(--primary-color);
  text-align: center;
}

.subPlayer li {
  list-style: none;
  margin-bottom: 6px;
}
.subPlayer li:hover {
  font-weight: 500;
}

@media (max-width: 1100px) {
  .homeButton {
    margin-left: 0;
  }

  .matchSelector {
    flex-wrap: wrap;
  }

  .matchTitle {
    width: min(250px, calc(50% - 5px));
  }

  .rightTeam,
  .leftTeam {
    column-gap: 72px;
    row-gap: 24px;
  }

  .rightTeam {
    right: 12%;
  }

  .leftTeam {
    left: 12%;
  }

  .playerCard {
    box-sizing: border-box;
  }
}

@media (max-width: 780px) {
  .pageContainer {
    width: min(100%, calc(100% - 1rem));
    padding-top: 44px;
  }

  .navMatch {
    gap: 10px;
    flex-direction: column;
  }

  .button {
    width: 100%;
    text-align: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .matchHeader h2,
  .matchHeader h3 {
    font-size: 1.2rem;
  }

  .matchSelector {
    gap: 8px;
  }

  .matchTitle {
    width: calc(50% - 4px);
    min-width: 0;
    padding: 8px 10px;
    font-size: 0.88rem;
    border-radius: 14px;
  }

  .image {
    aspect-ratio: auto;
    min-height: 520px;
    background-size: cover;
  }

  .rightTeam,
  .leftTeam {
    top: 50%;
    transform: translateY(-50%) scale(0.82);
    column-gap: 42px;
    row-gap: 18px;
  }

  .rightTeam {
    right: 2%;
  }

  .leftTeam {
    left: 2%;
  }

  .player {
    width: 72px;
    height: auto;
  }

  .player img {
    width: 72px;
    height: 72px;
  }

  .player .name {
    font-size: 10px;
    line-height: 1.1;
  }

  .playerCard {
    box-sizing: border-box;
  }

  .subsContainer {
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .pageContainer {
    width: min(100%, calc(100% - 0.75rem));
    padding-top: 38px;
  }

  .matchSelector {
    gap: 6px;
  }

  .matchTitle {
    width: 100%;
    font-size: 0.86rem;
    padding: 8px 10px;
  }

  .button {
    padding: 9px 12px;
    font-size: 0.92rem;
  }

  .image {
    min-height: 420px;
  }

  .rightTeam,
  .leftTeam {
    column-gap: 24px;
    row-gap: 14px;
    transform: translateY(-50%) scale(0.68);
  }

  .player {
    width: 64px;
  }

  .player img {
    width: 64px;
    height: 64px;
  }

  .player .name {
    font-size: 9px;
  }

  .subPlayer {
    padding: 14px;
  }

  .subPlayer h3,
  .subPlayer h4 {
    margin: 0.25rem 0;
  }
}
</style>
