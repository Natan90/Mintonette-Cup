<template>
  <div>
    <NavView :style="{ top: navbar }" class="navbar" />

    <div class="image">
      <img src="../images/test.png" alt="" />
      <div class="texteImage">
        {{ $t('mintonetteCup.title') }}
      </div>
    </div>



    <Map> </Map>

    <TableauMatchs></TableauMatchs>

    <!--Ca c'est pour le truc de Natan que je n'ai pas compris (quand il veut hover un truc ca agrandi pour mettre plus de texte je ne sais pas quoi la ...)-->
    <div class="hover">
      <p>
        <span id="title">Titre du prestataire</span>
        <br />
        <span id="descri"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </span>
      </p>
    </div>
  </div>
   <router-link to="/PolygoneCreation" class="btnLink"
        >Truc de Mathis pour les polygones</router-link
      >
  <Footer></Footer>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";
import TableauMatchs from "../views/TableauMatchs.vue";

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
</style>
