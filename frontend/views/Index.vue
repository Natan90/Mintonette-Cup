<template>
  <div>
    <NavView :style="{ top: navbar }" class="navbar" />

    <div class="all">
      <div class="image">
        <img
          src="../images/ballon.png"
          alt="ballon"
          id="img_ballon"
          @click="isBallonStopped && playVideoFullscreen()"
          :style="[
            { transform: `translateY(${ballonY}px)` },
            isBallonStopped ? { cursor: 'pointer' } : {},
          ]" />
        <img
          :src="imagePreview || '../images/photo_fond.png'"
          alt="photo_fond" />
        <div
          class="texteImage"
          :style="{ color: colorTitle, fontFamily: selectedFont }">
          {{ title_evenement }}
        </div>
      </div>
      <!-- <PresentationMintonette class="presentationMint"></PresentationMintonette> -->
      <div
        v-if="isBallonStopped"
        class="message-ballon"
        :style="[
          messageBallonStyle,
          isBallonStopped ? { cursor: 'pointer' } : {},
        ]"
        @click="playVideoFullscreen()">
        {{ $t("mintonetteCup.Ballon") }}
      </div>
      <section class="presentationMint">
        <div ref="ancreBallon" id="ancre-ballon"></div>
        <section class="presentation">
          <span class="question">{{ $t("PresentationMintonette.title") }}</span>

          <span v-html="descri_evenement_texte" class="descri_evenement"></span>
        </section>
      </section>

      <div class="video_with_balloon" v-if="showingBallon">
        <div class="container_video">
          <video ref="videoRef" controls width="400">
            <source src="/vnl_video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <section id="Carte" class="section"></section>
      <Map> </Map>

      <section class="infos">
        <section class="infos-wrapper" id="Info">
          <div
            class="infos-row"
            v-for="(row, rowIndex) in chunkedArray"
            :key="rowIndex">
            <div class="bloc" v-for="(item, index) in row" :key="index">
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
                <span class="descri" v-html="item.descri"></span>
                <router-link
                  :to="{ name: 'Information' }"
                  class="voirPlus pointer">
                  <span class="pointer">{{ $t("information.voirPlus") }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>

    <section
      v-if="
        userStore &&
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

    <section v-else-if="userStore.isConnected && utilisateur.ispresta">
      <div class="teams_texte">
        <div
          v-html="$t('mintonetteCup.prestataire.estDeja')"
          class="team_content"></div>

        <router-link
          :to="{ name: 'EditPrestataire', params: { id: userStore.userId } }"
          class="btn_teams">
          {{ $t("mintonetteCup.prestataire.boutonGerer") }}
        </router-link>
      </div>
    </section>

    <section v-else-if="userStore.isConnected && utilisateur.waitingforadmin">
      <div class="teams_texte">
        <div
          v-html="$t('mintonetteCup.prestataire.enAttente')"
          class="team_content"></div>
      </div>
    </section>

    <section v-else>
      <div class="teams_texte">
        <div
          class="team_content"
          v-html="$t('mintonetteCup.prestataire.nonConnecte')"></div>
        <router-link :to="{ name: 'Connexion_utilisateur' }" class="btn_teams">
          {{ $t("mintonetteCup.prestataire.boutonNonConnecte") }}
        </router-link>
      </div>
    </section>

    <RecherchePrestataire id="liste_prestataires"></RecherchePrestataire>

    <Footer></Footer>
  </div>
</template>

<script setup>
/* ********************
        IMPORTS 
******************** */
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onActivated,
  computed,
  watch,
  nextTick,
} from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
/* ********************
    PAGES IMPORTS 
******************** */
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import Map from "@/views/Map.vue";
import BounceCard from "@/components/BounceCard.vue";
import RecherchePrestataire from "./RecherchePrestataire.vue";
import CountUp from "../components/CountUp.vue";
import PresentationMintonette from "./PresentationMintonette.vue";
import { useAdminAPIStore } from "@/services/admin.service";

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
const adminAPIStore = useAdminAPIStore();

const utilisateur = ref([]);
const { locale } = useI18n();

/* ********************
    Evenement Values
******************** */
const evenement = ref(null);
const title_evenement = ref("");
const colorTitle = ref("");
const imagePreview = ref(null);
const selectedFont = ref(null);
const descri_evenement_title = ref("");
const descri_evenement_texte = ref("");

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

/* ********************
    Ballon Values
******************** */
const ballonY = ref(0);
const ballonVelocity = ref(0);
const ballonHasFallen = ref(false);
const showBalloon = ref(false);
const ancreBallon = ref(null);
const isBallonStopped = ref(false);
const showingBallon = ref(false);

let animationFrame = null;

const messageBallonTop = ref(0);
const messageBallonLeft = ref(0);

const messageBallonStyle = computed(() => ({
  top: `${messageBallonTop.value}px`,
  left: `${messageBallonLeft.value}px`,
}));

const getMaxDrop = () => {
  if (!ancreBallon.value) return 1300;
  const ballonEl = document.getElementById("img_ballon");
  const ancreRect = ancreBallon.value.getBoundingClientRect();
  const ballonRect = ballonEl.getBoundingClientRect();

  const offset = -50;

  return ancreRect.top - ballonRect.top + window.scrollY + offset;
};

const animateFall = () => {
  const gravity = 1.5;
  const maxDrop = getMaxDrop();
  let velocity = 0;

  const fall = () => {
    velocity += gravity;
    ballonY.value += velocity;

    if (ballonY.value >= maxDrop) {
      ballonY.value = maxDrop;
      animationFrame = null;
      animateBounce();
      return;
    }

    animationFrame = requestAnimationFrame(fall);
  };

  animationFrame = requestAnimationFrame(fall);
};

const animateBounce = () => {
  const gravity = 0.6;
  const damping = 0.55;
  const floor = ballonY.value;

  let bouncePos = 0;

  let bounceVelocity = -20;

  const bounce = () => {
    bounceVelocity += gravity;
    bouncePos += bounceVelocity;

    if (bouncePos >= 0) {
      bouncePos = 0;
      bounceVelocity *= -damping;

      if (Math.abs(bounceVelocity) < 0.5) {
        ballonY.value = floor;
        isBallonStopped.value = true;

        nextTick(() => {
          const ballonEl = document.getElementById("img_ballon");
          if (!ballonEl) return;

          const rect = ballonEl.getBoundingClientRect();
          const parentRect = ballonEl.offsetParent?.getBoundingClientRect() ?? {
            top: 0,
            left: 0,
          };

          messageBallonTop.value = rect.top - parentRect.top + rect.height / 2;
          messageBallonLeft.value =
            rect.left - parentRect.left + rect.width + 10;
        });

        return;
      }
    }

    ballonY.value = floor + bouncePos;
    animationFrame = requestAnimationFrame(bounce);
  };

  animationFrame = requestAnimationFrame(bounce);
};

function hideOrShowBalloon() {
  const elt = document.getElementById("img_ballon");

  if (showBalloon.value) {
    elt.style.display = "block";
  } else {
    elt.style.display = "none";
  }
}

const videoRef = ref(null);

async function playVideoFullscreen() {
  showingBallon.value = true;

  await nextTick();

  const video = videoRef.value;
  if (!video) return;

  try {
    await video.play();
    await video.requestFullscreen();

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        document.removeEventListener("fullscreenchange", onFullscreenChange);
        showingBallon.value = false;
        video.pause();
        video.currentTime = 0;
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    video.addEventListener(
      "ended",
      () => {
        document.exitFullscreen?.();
        showingBallon.value = false;
      },
      { once: true },
    );
  } catch (err) {
    console.error("Erreur fullscreen:", err);
    showingBallon.value = true;
  }
}

const handleScroll = () => {
  const scrollY = window.scrollY;

  if (scrollY > 500) {
    navbar.value = "-100px";
  } else {
    navbar.value = "0px";
  }
  showBalloon.value = true;
  hideOrShowBalloon();

  if (!ballonHasFallen.value && !animationFrame) {
    ballonHasFallen.value = true;
    animateFall();
  }
};

const CARDS_PER_ROW = 3;

const chunkedArray = computed(() => {
  const arr = informationArray.value;
  const rows = [];
  for (let i = 0; i < arr.length; i += CARDS_PER_ROW) {
    rows.push(arr.slice(i, i + CARDS_PER_ROW));
  }
  return rows;
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  hideOrShowBalloon();
  getValuesEvenement();
  getValuesUser();
});

// Recharger l'utilisateur quand on revient sur la page
onActivated(() => {
  getValuesUser();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => locale.value,
  (newLang) => {
    updateDescription();
  },
);

async function getValuesEvenement() {
  try {
    const res = await adminAPIStore.GetEvenement();
    evenement.value = res.data;
    title_evenement.value = res.data.nom_evenement;
    colorTitle.value = res.data.color_title;
    selectedFont.value = res.data.text_font;
    imagePreview.value = res.data.image_evenement;

    updateDescription();
  } catch (err) {
    console.error(err);
  }
}

function updateDescription() {
  if (evenement.value?.descri_evenement?.[locale.value]) {
    descri_evenement_texte.value =
      evenement.value.descri_evenement[locale.value].texte;
    descri_evenement_title.value =
      evenement.value.descri_evenement[locale.value].title;
  } else {
    descri_evenement_texte.value = "";
  }
}

async function getValuesUser() {
  try {
    if (!userStore.userId) {
      console.log("Aucun utilisateur connecté pour récupérer les données");
      return;
    }
    console.log("User ID:", userStore.userId);
    const res = await adminAPIStore.GetUtilisateurById(userStore.userId);
    utilisateur.value = res.data;
  } catch (err) {
    console.error(err);
  }
}
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

.image {
  position: relative;
}

.image::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, transparent, black);
  pointer-events: none;
}

#img_ballon {
  z-index: 999;
  position: absolute;
  top: 0;
  right: 16.5%;
  width: 85px;
  height: auto;
  will-change: transform;
}

.presentation {
  color: var(--rose-logo);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.question {
  font-size: 3em;
  font-weight: bold;
  align-self: center;
}

.descri_evenement {
  font-size: 1.2em;
  text-align: center;
  align-self: center;
}

.texteImage {
  z-index: 2;
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

.presentationMint {
  margin: 0 auto;
  height: 500px;
  background: linear-gradient(to top, transparent, black);
  pointer-events: none;
  background-color: var(--primary-color);
}

.infos {
  background: linear-gradient(to bottom, transparent, var(--rose-logo));
}

.infos-wrapper {
  display: flex;
  flex-direction: column;
  /* gap: 30px; */
  width: 95%;
  margin: 0px 2.5%;
}

.infos-row {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  gap: 40px;
  margin: 30px;
}

.bloc {
  display: flex;
  flex-wrap: wrap;
  background-color: #b3d89c;
  opacity: 0.6;
  padding-bottom: 5px;
  max-width: 60%;
  /* margin: 15px 20px; */
  width: 300px;
  height: 270px;

  border-radius: 10px;

  transition:
    transform 0.4s ease,
    filter 0.4s ease;
}

.infos-row .bloc:hover {
  transform: translateZ(100px);
  filter: brightness(1);
  opacity: 1;
}

.infos-row .bloc:hover + .bloc {
  transform: translateZ(60px) rotateY(10deg);
  /* filter: brightness(0.6); */
  opacity: 0.6;
}

.infos-row .bloc:hover + .bloc + .bloc {
  transform: translateZ(40px) rotateY(5deg);
  /* filter: brightness(0.4); */
  opacity: 0.4;
}

.infos-row .bloc:has(+ .bloc:hover) {
  transform: translateZ(60px) rotateY(-10deg);
  /* filter: brightness(0.6); */
  opacity: 0.6;
}

.infos-row .bloc:has(+ .bloc + .bloc:hover) {
  transform: translateZ(40px) rotateY(-5deg);
  /* filter: brightness(0.4); */
  opacity: 0.4;
}

.infos-row:has(.bloc:hover) + .infos-row .bloc {
  transform: translateZ(-60px) rotateX(-12deg);
  /* filter: brightness(0.5); */
  opacity: 0.3;
  transition:
    transform 0.4s ease,
    filter 0.4s ease,
    opacity 0.4s ease;
}

.infos-row:has(+ .infos-row .bloc:hover) .bloc {
  transform: translateZ(-60px) rotateX(12deg);
  filter: brightness(0.5);
  opacity: 0.3;
  transition:
    transform 0.4s ease,
    filter 0.4s ease,
    opacity 0.4s ease;
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
  height: 3em;
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
  color: var(--primary-color);
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
  background: var(--primary-color);

  background: linear-gradient(to bottom, var(--rose-logo), 60%, #242424cc);
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

  background: var(--rose-logo);
  color: var(--primary-color);

  font-weight: bold;
  font-size: 1.3em;
  border-radius: 50px;
  text-decoration: none;

  box-shadow: 0 6px 14px var(--rose-logo);
  transition: 0.25s ease;
}

.btn_teams:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 6px 12px color-mix(in srgb, var(--rose-logo) 50%, transparent);
}

.video_with_balloon {
  display: flex;
  justify-content: center;
}

.message-ballon {
  position: absolute;
  z-index: 1000;
  background: white;
  color: var(--primary-color);
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.4s ease;
  transform: translateY(-50%);
}

#liste_prestataires {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}
</style>
