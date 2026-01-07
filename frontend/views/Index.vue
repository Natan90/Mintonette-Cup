<template>
  <div>
    <NavView :style="{ top: navbar }" class="navbar" />

    <div class="all">
      <div class="image">
        <img :src="imagePreview || '../images/photo_fond.png'" alt="" />
        <div
          class="texteImage"
          :style="{ color: colorTitle, fontFamily: selectedFont }">
          {{ title_evenement }}
          <!-- {{ $t("mintonetteCup.title") }} -->
        </div>
      </div>
      <PresentationMintonette></PresentationMintonette>
      <section id="Carte" class="section"></section>
      <Map> </Map>

      <!-- <TableauMatchs></TableauMatchs> -->

      <section class="infos">
        <!--Ca c'est pour le truc de Natan que je n'ai pas compris (quand il veut hover un truc ca agrandi pour mettre plus de texte je ne sais pas quoi la ...)-->

        <!-- #############################################SI C'EST POSSIBLE, FAUDRAIT QUE CA COMMENCE A AUGMENTER LORSQU'ON VOIT LES NOMBRES ##########################################################################-->

        <section class="infos" id="Info">
          <div class="bloc" v-for="(item, index) in informationArray" :key="index">
            <img class="illustration" :src="item.image" />
            <span class="title">
              <countUp
                :from="0"
                :to="item.countUp"
                :duration="2"
                class="count-up-text"
                v-if="item.countUp" />
              {{ item.title }}
            </span>
            <div class="contenuTexte">
              <!-- <span v-if="index === 0">C'est trop vieillot ! (ça fait 2008)</span> -->
              <span class="descri" v-html="item.descri"></span>
              <router-link
                :to="{ name: 'Information', params: { id: userStore.userId } }"
                class="voirPlus pointer">
                <span class="pointer">{{ $t("information.voirPlus") }}</span>
              </router-link>
            </div>
          </div>
        </section>

        <!-- <BounceCard
          class="custom-bounceCards"
          :images="informationArray.map((b) => b.image)"
          :containerWidth="500"
          :containerHeight="250"
          :animationDelay="1"
          :animationStagger="0.08"
          easeType="elastic.out(1, 0.5)"
          :transformStyles="transformStyles"
          :enableHover="false" /> -->
      </section>
    </div>
    <!-- <router-link to="/PolygoneCreation" class="btnLink"
    >Truc pour les polygones</router-link
  >
  <br /><br /> -->
    <section
      v-if="
        userStore.isConnected &&
        !utilisateur.ispresta &&
        !utilisateur.waitingforadmin
      ">
      <div class="teams_texte">
        <div
          v-html="$t('mintonetteCup.prestataire.devenir')"
          class="team_content"></div>

        <router-link
          :to="{ name: 'AddPrestataire', params: { id: userStore.userId } }"
          class="btn_teams">
          {{ $t("mintonetteCup.prestataire.boutonDevenir") }}
        </router-link>
      </div>
    </section>

    <section v-if="userStore.isConnected && utilisateur.ispresta">
      <div class="teams_texte">
        <div
          v-html="$t('mintonetteCup.prestataire.estDeja')"
          class="team_content"></div>

        <router-link
          :to="{ name: 'EditPrestataire', params: { id: userStore.prestaId } }"
          class="btn_teams">
          {{ $t("mintonetteCup.prestataire.boutonGerer") }}
        </router-link>
      </div>
    </section>

    <section v-if="userStore.isConnected && utilisateur.waitingforadmin">
      <div class="teams_texte">
        <div
          v-html="$t('mintonetteCup.prestataire.enAttente')"
          class="team_content"></div>
      </div>
    </section>
    <!-- 
    <section>
      <div class="teams_texte">
        <div v-html="$t('mintonetteCup.competition.descri')" class="team_content"></div>

        <router-link to="/Equipes" class="btn_teams">
          {{ $t('mintonetteCup.competition.boutonMatchs') }}
        </router-link>
      </div>
    </section> -->

    <RecherchePrestataire id="liste_prestataires"></RecherchePrestataire>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <Footer></Footer>
  </div>
</template>

<script setup>
/* ********************
        IMPORTS 
******************** */
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useI18n } from "vue-i18n";
import evenementData from "../../backend/database/jsonData/Evenement.json";
import utilisateursData from "../../backend/database/jsonData/Utilisateur.json";
// import axios from "axios";
import { useUserStore } from "@/stores/user";
import localData from "../../backend/database/localData.js";

/* ********************
    PAGES IMPORTS 
******************** */
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import Map from "@/views/Map.vue";
import BounceCard from "@/components/BounceCard.vue";
import TableauMatchs from "../views/TableauMatchs.vue";
import RecherchePrestataire from "./RecherchePrestataire.vue";
import CountUp from "../components/CountUp.vue";
import PresentationMintonette from "./PresentationMintonette.vue";

/* ********************
    IMAGES IMPORTS 
******************** */
import logoCouleur from "../images/logo-couleur.png";
import photoFond from "/photo_fond.png";
import photoFoule from "./../images/foule.jpg";
import photoStade from "./../images/stade.jpg";
import photoReseaux from "./../images/reseaux.jpg";

const navbar = ref("0px");

const userStore = useUserStore();

const utilisateur = ref([]);

/* ********************
    Evenement Values
******************** */
const title_evenement = ref("");
const colorTitle = ref("");
const imagePreview = ref(null);
const selectedFont = ref(null);

const { t } = useI18n();
const informationArray = computed(() => [
  {
    title: t("information.titleEdition"),
    descri: t("information.descriEdition"),
    image: logoCouleur,
  },
  {
    title: t("information.titleMillions"),
    descri: t("information.descriPratiquants"),
    image: photoFond,
    countUp: 760,
  },
  {
    title: t("information.titlePays"),
    descri: t("information.descriPays"),
    image: photoFoule,
    countUp: 200,
  },
  {
    title: t("information.titleMillions"),
    descri: t("information.descriAudience"),
    image: photoStade,
    countUp: 24,
  },
  {
    title: t("information.titleReseauxSociaux"),
    descri: t("information.descriReseauxSociaux"),
    image: photoReseaux,
  },
]);

const transformStyles = [
  "rotate(5deg) translate(-250px)",
  "rotate(0deg) translate(-125px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(125px)",
  "rotate(-5deg) translate(250px)",
];

const handleScroll = () => {
  if (window.scrollY > 500) {
    navbar.value = "-100px";
  } else {
    navbar.value = "0px";
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  getValuesEvenement();
  getValuesUser();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

function getValuesEvenement() {
  // Charger depuis localStorage au lieu du JSON statique
  const events = localData.getAll("evenements");
  const evenement = events.length > 0 ? events[0] : evenementData[0];

  console.log("Index.vue - Événement chargé depuis localStorage:", evenement);

  title_evenement.value = evenement.nom_evenement;
  colorTitle.value = evenement.color_title;
  selectedFont.value = evenement.text_font;
  imagePreview.value = evenement.image_evenement;
}

function getValuesUser() {
  const user = utilisateursData.find(
    (u) => u.id_utilisateur === userStore.userId
  );
  if (user) {
    utilisateur.value = user;
  }
}

// async function getValuesEvenement() {
//     try {
//         const res = await axios.get("http://localhost:3000/admin/evenement/show");
//         title_evenement.value = res.data.nom_evenement;
//         colorTitle.value = res.data.color_title;
//         selectedFont.value = res.data.text_font;
//         imagePreview.value = res.data.image_evenement;
//     } catch (err) {
//         console.error(err);
//     }
// }

// async function getValuesUser() {
//   try {
//     const res = await axios.get(`http://localhost:3000/admin/utilisateur/show/${userStore.userId}`)
//     utilisateur.value = res.data;
//   } catch (err) {
//     console.error(err);
//   }
// }
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}
</style>

<style scoped>
.all {
  user-select: none;
}

.navbar {
  position: fixed;
  left: 0;
  right: 0;
  height: 100px;
  transition: top 0.5s ease;
  z-index: 999;
}

.image img {
  width: 100%;
  height: 100%;
  /* margin-top: 1.5em; */
}

.texteImage {
  z-index: 1;
  font-size: 5em;
  text-align: center;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* color: white; */
  border-radius: 10px;
  padding: 5px 10px;
  /* font-family: "Meie Script"; */
}

.infos {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 95%;
  margin: 50px 2.5% 50px 2.5%;
  gap: 50px;
}

.bloc {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--jaune-logo);
  opacity: 0.7;
  padding-bottom: 5px;
  max-width: 60%;
  margin: 15px 20px;
  width: 300px;
  height: 270px;

  border-radius: 10px;

  transition: var(--transition-fast);
}

.bloc:hover {
  background-color: var(--jaune-logo);
  opacity: 0.9;
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.bloc .title {
  margin: 0px 10px;
  font-weight: bold;
  font-size: 1.3em;
  transition: font-size 0.3s ease;
}

.illustration {
  width: 100%;
  margin: 0;
  background-color: white;
  height: 150px;
  border-radius: 10px 10px 0 0;

  object-fit: cover;
}

.descri {
  margin: 0px 10px;
  font-size: 0.7em;
  height: 2.5em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* limite à 2 lignes */
  -webkit-box-orient: vertical;
}

.voirPlus {
  width: calc(100% - 5px);
  margin-right: 5px;
  display: flex;
  justify-content: flex-end;
  text-align: end;
  color: var(--bleu-logo);
  font-weight: bold;
  text-decoration: underline;
}

.presta_texte {
  text-align: center;
  margin: auto;
  padding: 60px 40px;
  width: calc(100% - 80px);

  background: linear-gradient(135deg, #f7c325cc, #ffe37fcc);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.presta_content :deep(h2) {
  font-size: 2.6em;
  font-weight: 800;
  color: #0a1d42;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.presta_content :deep(p) {
  font-size: 1.2em;
  color: #0a1d42;
  margin-bottom: 12px;
  line-height: 1.5em;
}

.btn_presta {
  display: inline-block;
  margin-top: 25px;
  padding: 16px 35px;

  background: #0a3a75;
  color: white;

  font-weight: bold;
  font-size: 1.3em;
  border-radius: 50px;
  text-decoration: none;

  box-shadow: 0 6px 14px rgba(10, 58, 117, 0.35);
  transition: 0.25s ease;
}

.btn_presta:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 25px rgba(10, 58, 117, 0.5);
}

.teams_texte {
  text-align: center;
  margin: 0 auto;
  padding: 60px 40px;
  width: calc(100% - 80px);
  background: #0a3a75;

  /* background: linear-gradient(135deg, #0a3a75cc, #4fa3ffcc); */
  backdrop-filter: blur(8px);
  /* box-shadow: 0 10px 30px rgba(0,0,0,0.15); */
}

.team_content :deep(h2) {
  font-size: 2.6em;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.team_content :deep(p) {
  font-size: 1.2em;
  color: white;
  margin-bottom: 12px;
  line-height: 1.5em;
}

.btn_teams {
  display: inline-block;
  margin-top: 25px;
  padding: 16px 35px;

  background: #f7c325;
  color: #0a1d42;

  font-weight: bold;
  font-size: 1.3em;
  border-radius: 50px;
  text-decoration: none;

  box-shadow: 0 6px 14px rgba(247, 195, 37, 0.35);
  transition: 0.25s ease;
}

.btn_teams:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 25px rgba(247, 195, 37, 0.55);
}
</style>
