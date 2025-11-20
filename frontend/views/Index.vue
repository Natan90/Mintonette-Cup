<template>
  <div>
    <NavView :style="{ top: navbar }" class="navbar" />

    <div class="image">
      <img src="../images/test.png" alt="" />
      <div class="texteImage">
      Mintonette Cup
        <!-- {{ $t("mintonetteCup.title") }} -->
      </div>
    </div>

    <Map> </Map>

    <!-- <TableauMatchs></TableauMatchs> -->

    <section class="infos">
      <!--Ca c'est pour le truc de Natan que je n'ai pas compris (quand il veut hover un truc ca agrandi pour mettre plus de texte je ne sais pas quoi la ...)-->

<!-- #########################################################################SI C'EST POSSIBLE, FAUDRAIT QUE CA COMMENCE A AUGMENTER LORSQU'ON VOIT LES NOMBRES ##########################################################################-->

      <div class="bloc">
          <span class="title">3ème édition</span>
          <img class="illustration" src="./../images/logo-couleur.png" />
          <span class="descri">
              La Mintonette Cup, désormais accueillie à
              <strong>Montpellier</strong>, connaît un essor remarquable et
              s’impose comme l’un des rendez-vous majeurs du volley amateur dans
              le Sud de la France. 
            
              L’édition précédente a rassemblé près de
              <strong>15 000 spectateurs sur trois jours</strong>, portée par
              l’attractivité des installations montpelliéraines et la forte
              culture volley de la ville, notamment grâce à la présence du
              <strong>Montpellier Hérault Sport Club Volley-Ball</strong>.
          </span>
          <div class="voirPlus">
              <span class="pointer">Voir plus</span>
          </div>
      </div>

      <div class="bloc">
          <span class="title"><countUp :from="0" :to="760" :duration="2" class="count-up-text" /> millions</span>
          <img class="illustration" src="./../images/test.png" />
          <span class="descri">
            C'est le nombre  de personnes pratiquants le volley-ball, qu’il s’agisse de
            loisirs, de pratique scolaire ou à haut niveau. Ce chiffre fait du
            volley-ball l’un des sports collectifs <strong>les plus populaires au monde</strong>,
            juste derrière le football.
          </span>
          <div class="voirPlus">
              <span class="pointer">Voir plus</span>
          </div>
      </div>
      
      <div class="bloc">
          <span class="title"><countUp :from="0" :to="200" :duration="2" class="count-up-text" /> pays</span>
          <img class="illustration" src="./../images/logo-couleur.png" />
          <span class="descri">
            C'est le nombre de pays oû le volley-ball est aujourd’hui représenté
             à travers divers clubs,
            compétitions et fédérations nationales. La Fédération Internationale
            de Volley-ball (FIVB) regroupe
            <strong>plus de 220 fédérations membres</strong>, montrant l’ampleur
            mondiale du sport et son implantation dans toutes les régions du
            globe.
          </span>
          <div class="voirPlus">
              <span class="pointer">Voir plus</span>
          </div>
      </div>

      <div class="bloc">
          <span class="title"><countUp :from="0" :to="24" :duration="2" class="count-up-text" /> millions</span>
          <img class="illustration" src="./../images/logo-couleur.png" />
          <span class="descri">
            C’est le pic d’audience enregistré pour un match de volley-ball en
            2024, preuve de l’intérêt croissant du public pour ce sport. Les
            compétitions internationales, en particulier, attirent
            <strong>des millions de téléspectateurs</strong> et contribuent à
            renforcer la visibilité du volley sur la
            <strong>scène sportive mondiale</strong>.
          </span>
          <div class="voirPlus">
              <span class="pointer">Voir plus</span>
          </div>
      </div>

      <div class="bloc">
          <span class="title">Les réseaux sociaux n’ont pas été en reste</span>
          <img class="illustration" src="./../images/logo-couleur.png" />
          <span class="descri">
            La couverture numérique de la Mintonette Cup a généré
            <strong>1,2 million d’impressions</strong> et plus de
            <strong>150 000 interactions</strong>, alimentées par des vidéos
            courtes, des moments forts des matchs et des interviews exclusives.
            Forts de cette dynamique, les organisateurs visent pour la prochaine
            édition de dépasser les
            <strong>300 000 visionnages en ligne</strong>, consolidant ainsi la
            réputation de la Mintonette Cup comme un événement incontournable à
            Montpellier.
          </span>
          <div class="voirPlus">
              <span class="pointer">Voir plus</span>
          </div>
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
import CountUp from "./../components/countUp.vue";

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

.pointer{    
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
    border: solid black 1px;
    padding: 5px 10px;
    max-width: 60%;
    width: 300px;

    transition: var(--transition-fast);
}

.bloc:hover {
    background-color: var(--jaune-logo);
    opacity: 0.9;
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.bloc .title {
    font-weight: bold;
    font-size: 1.3em;
    transition: font-size 0.3s ease;
}

.illustration {
    width: 90%;
    margin: 20px 5%;
    background-color: white;
}

.descri {
    font-size: 0.7em;
}

.voirPlus {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    text-align: end;
    color: var(--bleu-logo);
    font-weight: bold;
    text-decoration: underline;
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
