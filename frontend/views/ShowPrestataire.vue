<template>
  <NavView />

  <section>
    <div class="container">
      <div class="container_cards">
        <p class="title_presta">{{ onePresta.nom_prestataire }}</p>
        <!-- <img src=""> -->
        <div class="description" v-html="onePresta.descri_prestataire">
        </div>
        <p>Capacité : <span>{{ Number(onePresta.nb_participants) }}</span></p>
        <p>Tarif : <span>{{ onePresta.tarif_prestataire }}</span></p>
        <div class="contact_presta">
          <p class="contact_title"><b>Contact</b></p>
          <p>{{ onePresta.mail_prestataire }}</p>
          <p>{{ onePresta.tel_prestataire }}</p>
        </div>
        <p>{{ onePresta.prenom_utilisateur }} {{ onePresta.nom_utilisateur }}
        </p>
      </div>
    </div>
  </section>


  <!-- <div class="routeurLink">
    <router-link to="/" class="btnLink">Home</router-link>
  </div>
  <div class="Titre">
    <h1>{{ $t("burgerStand.title") }}</h1>
  </div>
  <div class="route">
    <div class="ConteneurTexte">
      <p style="white-space: pre-line">
        {{ $t("burgerStand.description") }}
      </p>
    </div>
    <div class="ConteneurImageBurger">
      <div class="imageBurger">
        <img src="../images/burgerImage.png" alt="Burger" />
      </div>
    </div>
  </div>
  <div class="SuiteTexte">
    <h2>{{ $t("services.title") }}</h2>
    <div class="cards-section">
      <router-link v-for="(elt, index) in photo" :key="index" :to="elt.link" class="card">
        <img :src="elt.chemin" :alt="`Photo ${index}`" />
        <h3>{{ $t(`services.actions.${index}`) }}</h3>
      </router-link>
    </div>
  </div>
  <br> -->
  <Footer></Footer>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router';


const route = useRoute();

import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";


const onePresta = ref({
  nom_prestataire: "",
  descri_prestataire: "",
  nb_participants: 0,
  tarif_prestataire: "",
  mail_prestataire: "",
  tel_prestataire: "",
  prenom_utilisateur: "",
  nom_utilisateur: ""
});

const idPresta = route.params.id;

onMounted(async () => {
  try {
    await getValuesPrestataire(idPresta);
  } catch (err) {
    console.error(err);
  }
});



//==========================
//= Async functions presta =
//==========================
async function getValuesPrestataire() {
  try {
    const res = await axios.get(`http://localhost:3000/prestataire/show/${idPresta}`);
    onePresta.value = res.data;

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

</script>

<style>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}

.container_cards {
  background-color: yellow;
}

/* body::-webkit-scrollbar {
  display: none;
}

.Service {
  display: flex;
  text-align: center;
  gap: 15px;
  border: solid black 1px;
}

[id^="servicePrestataire"] {
  padding: 25px;
  font-size: 25px;
}

.link {
  text-decoration: none;
  color: black;
}

.Service :hover {
  -webkit-transition: all 1s ease;
  -webkit-transform: scale(1.05);
}

.servicePrestataire1,
.servicePrestataire2 {
  border: solid 1px black;
  border-radius: 15px;
}

.SuiteTexte {
  margin-left: 35px;
}

.routeurLink {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  border-radius: 20px;
}

.btnLink {
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #333;
  background: #f8e16c;
  color: black;
  font-weight: bold;
  transition: 0.3s;
}

.btnLink:hover {
  background: var(--primary-color);
  color: white;
}

.Titre {
  margin-left: 35px;
}

.route {
  display: flex;
  align-items: center;
  gap: 40px;
}

.ConteneurTexte {
  max-width: 800px;
  margin-left: 35px;
  line-height: 1.5;
  text-align: justify;
}

.ConteneurImageBurger {
  max-width: 500px;
  align-items: end;
}

.imageBurger {
  width: 350px;
}

.cards-section {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  background: #f8e16c;
  border-radius: 15px;
  padding: 20px;
  width: 250px;
  transition: transform 0.3s, box-shadow 0.3s;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card img {
  width: 200px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
}

.card h3 {
  margin: 0;
  font-size: 1.2rem;
  text-align: center;
}

.card:hover {
  transform: translateY(-5px) scale(1.05);
} */
</style>
