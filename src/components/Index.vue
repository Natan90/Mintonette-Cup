<template>
  <div>
    <!-- Navbar -->
    <NavView :style="{ top: navbar }" class="navbar" />

    <!-- Contenu -->
    <div class="image">
      <img src="../images/PhotoFond.webp" alt="">
      <div class="texteImage">
        Montpellier accueille la Mintonette Cup, le tournoi mondial de volley-ball qui rassemble les meilleurs joueurs !<br>
        changer l'image ( pas les bonnes couleurs )
      </div>
    </div>
<!--PROBLEME CAR IL Y A UNE SORTE DE DEUXIEME BARRE DE NAV QUI RESTE EN DESSOUS FAUT VOIR CA QUAND TU REMONTE TROP VITE -->
    <p>Bonjour</p><p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>
    <p>Bonjour</p>

<!--Ca c'est pour le truc de Natan que je n'ai pas compris (quand il veut hover un truc ca agrandi pour mettre plus de texte je ne sais pas quoi la ...)-->
    <div class="hover">
      <p>Hover moi </p>
      <div class="TuasHover">
        <p> Bravo tu as hover ça Chef ! </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const navbar = ref("0px");

const handleScroll = () => {
  if (window.scrollY > 300) {
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
  margin-top: 1.5em;
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
  max-width: 70px;
}
.hover p:hover {
  max-width: 500px;
}

.TuasHover {
  display: none;
}
.hover:hover .TuasHover {
  display: block;
}
</style>
