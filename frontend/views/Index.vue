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

    <section class="infos">
      <!--Ca c'est pour le truc de Natan que je n'ai pas compris (quand il veut hover un truc ca agrandi pour mettre plus de texte je ne sais pas quoi la ...)-->

      <countUp :from="0" :to="50" :duration="6" class="count-up-text" />

      <div class="hover">
        <p>
          <span class="title">Nombre de pratiquants</span>
          <br />
          <span class="descri"
            >Dans le monde, on estime à environ <strong>760 millions</strong> le
            nombre de personnes pratiquant le volley-ball, qu’il s’agisse de
            loisirs, de pratique scolaire ou de haut niveau. Ce chiffre fait du
            volley-ball l’un des sports collectifs les plus populaires au monde,
            juste derrière le football.
          </span>
        </p>
      </div>
      <div class="hover">
        <p>
          <span class="title">Présence internationale</span>
          <br />
          <span class="descri"
            >Le volley-ball est aujourd’hui représenté dans
            <strong>plus de 200 pays</strong> à travers divers clubs,
            compétitions et fédérations nationales. La Fédération Internationale
            de Volley-ball (FIVB) regroupe
            <strong>plus de 220 fédérations membres</strong>, montrant l’ampleur
            mondiale du sport et son implantation dans toutes les régions du
            globe.
          </span>
        </p>
      </div>

      <div class="hover">
        <p>
          <span class="title">23,6 millions</span>
          <br />
          <span class="descri"
            >C’est le pic d’audience enregistré pour un match de volley-ball en
            2024, preuve de l’intérêt croissant du public pour ce sport. Les
            compétitions internationales, en particulier, attirent
            <strong>des millions de téléspectateurs</strong> et contribuent à
            renforcer la visibilité du volley sur la
            <strong>scène sportive mondiale</strong>.</span
          >
        </p>
      </div>

      <div class="hover">
        <p>
          <span class="title">La Mintonette Cup</span>
          <br />
          <span class="descri"
            >La Mintonette Cup, désormais accueillie à
            <strong>Montpellier</strong>, connaît un essor remarquable et
            s’impose comme l’un des rendez-vous majeurs du volley amateur dans
            le Sud de la France. L’édition précédente a rassemblé près de
            <strong>15 000 spectateurs sur trois jours</strong>, portée par
            l’attractivité des installations montpelliéraines et la forte
            culture volley de la ville, notamment grâce à la présence du
            <strong>Montpellier Hérault Sport Club Volley-Ball</strong>.</span
          >
        </p>
      </div>

      <div class="hover">
        <p>
          <span class="title">Les réseaux sociaux n’ont pas été en reste</span>
          <br />
          <span class="descri">
            La couverture numérique de la Mintonette Cup a généré
            <strong>1,2 million d’impressions</strong> et plus de
            <strong>150 000 interactions</strong>, alimentées par des vidéos
            courtes, des moments forts des matchs et des interviews exclusives.
            Forts de cette dynamique, les organisateurs visent pour la prochaine
            édition de dépasser les
            <strong>300 000 visionnages en ligne</strong>, consolidant ainsi la
            réputation de la Mintonette Cup comme un événement incontournable à
            Montpellier.</span
          >
        </p>
      </div>
    </section>
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
import CountUp from "./countUp.vue";

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
  /* background: rgba(255, 255, 255, 0.4); */
  background-color: rgb(0, 0, 0, 0.8);
}

.infos {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  width: 95%;
  margin-left: 2.5%;
  margin-bottom: 50px;
  gap: 25px;
}

.hover p {
  background-color: grey;
  border: solid black 1px;
  border-radius: 10px;
  padding: 5px 10px;
  max-width: 60%;
  margin: 15px 20%;
  cursor: pointer;
  width: 300px;

  transition: transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.title {
  font-weight: bold;
}

.hover p:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.hover p:hover .title {
  font-size: 1.3em;
  transition: font-size 0.3s ease;
}

.descri {
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
