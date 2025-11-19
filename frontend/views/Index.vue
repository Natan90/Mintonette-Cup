<template>
  <div>
    <NavView :style="{ top: navbar }" class="navbar" />

    <div class="image">
      <img src="../images/test.png" alt="" />
      <div class="texteImage">
        {{ $t("mintonetteCup.title") }}
      </div>
    </div>

    <Map> </Map>

    <!-- <TableauMatchs></TableauMatchs> -->

    <!--Ca c'est pour le truc de Natan que je n'ai pas compris (quand il veut hover un truc ca agrandi pour mettre plus de texte je ne sais pas quoi la ...)-->
    <div class="hover">
      <p>
        <span id="title">Nombre de pratiquants</span>
        <br />
        <span id="descri"
          >Dans le monde, on estime à environ 760 millions le nombre de
          personnes pratiquant le volley-ball, qu’il s’agisse de loisirs, de
          pratique scolaire ou de haut niveau. Ce chiffre fait du volley-ball
          l’un des sports collectifs les plus populaires au monde, juste
          derrière le football.
        </span>
      </p>
    </div>
    <div class="hover">
      <p>
        <span id="title">Présence internationale</span>
        <br />
        <span id="descri"
          >Le volley-ball est aujourd’hui représenté dans plus de 200 pays à
          travers divers clubs, compétitions et fédérations nationales. La
          Fédération Internationale de Volley-ball (FIVB) regroupe plus de 220
          fédérations membres, montrant l’ampleur mondiale du sport et son
          implantation dans toutes les régions du globe.
        </span>
      </p>
    </div>
    <div class="hover">
      <p>
        <span id="title">23,6 millions</span>
        <br />
        <span id="descri"
          >C’est le pic d’audience enregistré pour un match de volley-ball en
          2024, preuve de l’intérêt croissant du public pour ce sport. Les
          compétitions internationales, en particulier, attirent des millions de
          téléspectateurs et contribuent à renforcer la visibilité du volley sur
          la scène sportive mondiale.</span
        >
      </p>
    </div>
  </div>
  <router-link to="/PolygoneCreation" class="btnLink"
    >Truc de Mathis pour les polygones</router-link
  >
  <br /><br />

  <div class="presta_formulaire">
    <ListPresta></ListPresta>
    <Formulaire></Formulaire>
  </div>

  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

  <Footer></Footer>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";
import TableauMatchs from "../views/TableauMatchs.vue";
import ListPresta from "./ListPresta.vue";
import Formulaire from "./Formulaire.vue";

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

:root {
  /* Couleurs */
  --primary-color: #00167a;
  --baniere-color-food: #b71c1c;

  /* Transitions */
  --transition-fast: 0.3s ease;
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
  font-size: 25px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  border: solid black 1px;
  border-radius: 10px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.4);
}

.hover p {
  border: solid black 1px;
  border-radius: 10px;
  padding: 5px 10px;
  max-width: 60%;
  margin: 50px;
  cursor: pointer;

  transition: transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.hover p:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.hover p:hover #title {
  font-size: 1.3em;
  font-weight: bold;
  transition: font-size 0.3s ease;
}

#descri {
  font-size: 0.7em;
}

.presta_formulaire {
  background: linear-gradient(
    135deg,
    var(--colorGradientBlue),
    var(--colorGradientGreen)
  );
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
