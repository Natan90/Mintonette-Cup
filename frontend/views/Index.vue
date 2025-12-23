<template>
  <div>
    <NavView :style="{ top: navbar }" class="navbar" />
    <div class="all">
      <div class="image">
        <img src="../images/photo_fond.png" alt="" />
        <div class="texteImage">
          Mintonette Cup
          <!-- {{ $t("mintonetteCup.title") }} -->
        </div>
      </div>
      <PresentationMintonette></PresentationMintonette>
      <Map> </Map>

      <!-- <TableauMatchs></TableauMatchs> -->

      <section class="infos">
        <!--Ca c'est pour le truc de Natan que je n'ai pas compris (quand il veut hover un truc ca agrandi pour mettre plus de texte je ne sais pas quoi la ...)-->

        <!-- #############################################SI C'EST POSSIBLE, FAUDRAIT QUE CA COMMENCE A AUGMENTER LORSQU'ON VOIT LES NOMBRES ##########################################################################-->

        <section class="infos">
          <div class="bloc" v-for="(item, index) in blocInfoArray" :key="index">
            <img class="illustration" :src="item.image" />
            <span class="title">
              <countUp :from="0" :to="item.countUp" :duration="2" class="count-up-text" v-if="item.countUp" />
              {{ item.title }}
            </span>
            <div class="contenuTexte">
              <!-- <span v-if="index === 0">C'est trop vieillot ! (ça fait 2008)</span> -->
              <span class="descri" v-html="item.descri"></span>
                <router-link to="/Informations" class="voirPlus pointer">
                  <span class="pointer">{{ $t("blocInfo.voirPlus") }}</span>
                </router-link>
            </div>
          </div>
        </section>

        <!-- <BounceCard
          class="custom-bounceCards"
          :images="blocInfoArray.map((b) => b.image)"
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
    <section v-if="userStore.isConnected && !userStore.isPresta">
      <div class="presta_texte">
        <h2>Envie de faire partie de l’aventure ?</h2>
        <p>
          Que vous proposiez une animation, une boutique ou de la restauration,<br>
          <strong>devenez prestataire officiel de la Mintonette Cup !</strong>
        </p>
        <p>
          Rejoignez l'équipe et apportez votre savoir-faire à l’événement :
        </p>

        <router-link :to="{ name: 'AddPrestataire', params: { id: userStore.userId } }"
        class="btn_presta">
          Je deviens prestataire
        </router-link>
      </div>

    </section>

    <section v-if="userStore.isPresta">
      <div class="presta_texte">
        <h2>Bienvenue parmi nos prestataires !</h2>
        <p>
          Merci de contribuer à la Mintonette Cup avec votre savoir-faire.<br>
          Vous pouvez gérer vos prestations et mettre à jour vos informations ci-dessous :
        </p>

        <router-link :to="{ name: 'EditPrestataire', params: { id: userStore.userId } }"
        class="btn_presta">
          Gérer mes prestations
        </router-link>
      </div>
    </section>

    <section>
      <div class="teams_texte">

        <h2>Plongez dans la compétition !</h2>

        <p>
          Plongez au cœur de la compétition et explorez les pays engagés dans la
          Mintonette Cup.<br>
          <strong>Compositions, photos et infos essentielles : tout est là !</strong>
        </p>

        <p>
          Que vous soyez joueur, supporter ou simple curieux, découvrez tous les
          pays du tournoi :
        </p>

        <router-link to="/Equipes" class="btn_teams">
          Voir les pays
        </router-link>
      </div>
    </section>


    <!-- <div class="presta_formulaire">
      <ListPresta></ListPresta>
      <Formulaire></Formulaire>
    </div> -->

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
import { useUserStore } from '@/stores/user';


/* ********************
    PAGES IMPORTS 
******************** */
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";
import BounceCard from "@/components/BounceCard.vue";
import TableauMatchs from "../views/TableauMatchs.vue";
import ListPresta from "./ListPresta.vue";
import Formulaire from "./Formulaire.vue";
import CountUp from "../components/CountUp.vue";
import PresentationMintonette from "./PresentationMintonette.vue";

/* ********************
    IMAGES IMPORTS 
******************** */
import logoCouleur from "../images/logo-couleur.png";
import photoFond from "../images/photo_fond.png";
import photoFoule from "./../images/foule.jpg";
import photoStade from "./../images/stade.jpg";
import photoReseaux from "./../images/reseaux.jpg";

const navbar = ref("0px");

const userStore = useUserStore();

const { t } = useI18n();
const blocInfoArray = computed(() => [
  {
    title: t("blocInfo.titleEdition"),
    descri: t("blocInfo.descriEdition"),
    image: logoCouleur,
  },
  {
    title: t("blocInfo.titleMillions"),
    descri: t("blocInfo.descriPratiquants"),
    image: photoFond,
    countUp: 760,
  },
  {
    title: t("blocInfo.titlePays"),
    descri: t("blocInfo.descriPays"),
    image: photoFoule,
    countUp: 200,
  },
  {
    title: t("blocInfo.titleMillions"),
    descri: t("blocInfo.descriAudience"),
    image: photoStade,
    countUp: 24,
  },
  {
    title: t("blocInfo.titleReseauxSociaux"),
    descri: t("blocInfo.descriReseauxSociaux"),
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
  color: white;
  border-radius: 10px;
  padding: 5px 10px;
  font-family: "Meie Script";
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

.presta_formulaire {
  background: linear-gradient(135deg,
      var(--colorGradientBlue),
      var(--colorGradientGreen));
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
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

.presta_texte h2 {
  font-size: 2.6em;
  font-weight: 800;
  color: #0a1d42;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.presta_texte p {
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

.teams_texte h2 {
  font-size: 2.6em;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.teams_texte p {
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
