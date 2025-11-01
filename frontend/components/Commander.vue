<template>
  <NavView></NavView>

  <div class="routeurLink">
    <router-link to="/" class="btnLink">Home</router-link>
  </div>

  <div>
    <span v-for="(elt, index) in article" :key="index">
      <div class="Card" :id="'id' + index" @click="selectArticle(index)">
        {{ elt.nom }}
      </div>
    </span>
    <!-- Vérifie si c'est bien un tableau sinon car affiche plein de "item" -->
    <div v-if="Array.isArray(descriArticle[selectedItem].descri)">
      <p
        v-for="(item, index) in descriArticle[selectedItem].descri"
        :key="index"
        class="burger">
        <p>{{ item.name }} </p> <br />
        <img :src="item.image" alt="item" />
        <p>{{ item.prix }}</p>
      </p>
    </div>
  </div>

  <div class="route"></div>

  <Footer></Footer>
</template>

<script setup>
import { ref } from "vue";

import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const content = ref("");
const selectedItem = ref(0);

const article = [
  { nom: "Articles favoris" },
  { nom: "Nos suggestions" },
  { nom: "Nouveautés" },
  { nom: "Bon plan" },
];

const descriArticle = [
  { descri: "fav" },
  {
    descri: [
      {
        name: "Cheeseburger",
        prix: "14.99€",
        image: new URL(
          "../images/StandBurger/Cheeseburger.jpg",
          import.meta.url
        ).href,
      },
      {
        name: "Montagnard",
        image: new URL("../images/StandBurger/Montagnard.jpg", import.meta.url)
          .href,
      },
    ],
    // , Hamburger, Bacon burger, Double burger, Chicken burger, Fish burger, Veggie burger",
  },
  { descri: "Description Article 3" },
  { descri: "Description Article 4" },
];

function selectArticle(id) {
  if (id >= article.length) return;
  selectedItem.value = id;
}
</script>

<style scoped>
#photo_presta {
  width: 500px;
}

[id^="id"]:hover {
  background-color: yellow;
}
.burger img {
  height: 150px;
}
</style>
