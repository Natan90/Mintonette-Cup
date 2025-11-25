<template>
  <NavView :style="{ top: navbar }" class="navbar" />

  <div class="image">
    <div class="texteImage">
      Mintonette Cup
      <!-- {{ $t("mintonetteCup.title") }} -->
    </div>
  </div>

  <div class="fondBlanc">
    <Map></Map>

    <section class="infos">

      <div class="bloc" v-for="(item, index) in blocInfoArray" :key="index">
        <img class="illustration" :src="item.image" />
        <div class="contenuTexte">
          <span class="title">
            <countUp :from="0" :to="item.countUp" :duration="2" class="count-up-text" v-if="item.countUp"/>
            {{ item.title }}
          </span>
          <span v-if="index === 0">C'est trop vieillot ! (ça fait 2008)</span>
          <span class="descri" v-html="item.descri" v-else></span>
          <div class="voirPlus">
            <span class="pointer">{{ $t('blocInfo.voirPlus') }}</span>
          </div>
        </div>
      </div>

    </section>

    <div class="presta_formulaire">
      <ListPresta></ListPresta>
      <Formulaire></Formulaire>
    </div>

  </div>

  <Footer></Footer>
</template>


<script setup>
/* ********************
        IMPORTS 
******************** */
import NavView from "@/components/NavView.vue";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";
import TableauMatchs from "../views/TableauMatchs.vue";
import ListPresta from "./ListPresta.vue";
import Formulaire from "./Formulaire.vue";
import CountUp from "./../components/countUp.vue";
import { useI18n } from "vue-i18n";

/* ********************
    IMAGES IMPORTS 
******************** */
import logoCouleur from '../images/logo-couleur.png';
import photoFond from '../images/photo_fond.png';


const { t } = useI18n();

const blocInfoArray = computed(() => [
  { title: t("blocInfo.titleEdition"), descri: t("blocInfo.descriEdition"), image: logoCouleur },
  { title: t("blocInfo.titleMillions"), descri: t("blocInfo.descriPratiquants"), image: photoFond, countUp: 760 },
  { title: t("blocInfo.titlePays"), descri: t("blocInfo.descriPays"), image: logoCouleur, countUp: 200 },
  { title: t("blocInfo.titleMillions"), descri: t("blocInfo.descriAudience"), image: logoCouleur, countUp: 24 },
  { title: t("blocInfo.titleReseauxSociaux"), descri: t("blocInfo.descriReseauxSociaux"), image: logoCouleur },
]);


const navbar = ref("0px");

const handleScroll = () => {
  if (window.scrollY > 500) {
    navbar.value = "-100px";
  } else {
    navbar.value = "0px";
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>


<style>
body::-webkit-scrollbar {
  display: none;
}
</style>

<style scoped>
.pointer {
  cursor: pointer;
}

.navbar {
  position: fixed;
  left: 0;
  right: 0;
  height: 100px;
  transition: top 0.5s ease;
  z-index: 999;
}

.image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url("../images/photo_fond.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  filter: brightness(0.7);
  z-index: -1;
}

.fondBlanc {
  width: 90%;
  margin: auto;
  background: white;
  position: relative;
  margin-top: 100vh;
  padding-top: 50px;
  z-index: 10;
  border-radius: 20px;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.2);
  padding-bottom: 10%;
}

.texteImage {
  z-index: 1;
  font-size: 5em;
  text-align: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  border-radius: 10px;
  padding: 5px 10px;
  font-family: 'Meie Script';
}

.infos {
  display: flex;
  flex-direction: column;
  gap: 80px;
  width: 90%;
  margin: 50px auto;
}

.bloc {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;
}

.bloc:nth-child(even) {
  flex-direction: row-reverse;
}

.illustration {
  width: 40%;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contenuTexte {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 600px;
}

.title {
  font-weight: 700;
  font-size: 2em;
  color: var(--bleu-logo);
}

.descri {
  font-size: 1.1em;
  line-height: 1.6;
}

.voirPlus {
  color: var(--bleu-logo);
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

@media (max-width: 900px) {

  .bloc,
  .bloc:nth-child(even) {
    flex-direction: column;
  }

  .illustration {
    width: 100%;
  }

  .contenuTexte {
    text-align: center;
    max-width: 100%;
  }

  .title {
    font-size: 1.7em;
  }

  .descri {
    font-size: 1em;
  }
}

.presta_formulaire {
  background: linear-gradient(135deg,
      var(--colorGradientBlue),
      var(--colorGradientGreen));
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
