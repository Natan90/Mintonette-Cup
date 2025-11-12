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
    <div v-if="Array.isArray(descriArticle[selectedItem].descri)" class="burger-cards">
  <div
    v-for="(item, index) in descriArticle[selectedItem].descri"
    :key="index"
    class="burger-card"
  >
    <img :src="item.image" :alt="item.name" />
    <h3>{{ item.name }}</h3>
    <p class="price">{{ item.price }}</p>
    <!-- quand on appuie sur ca il faut que ca ajoute la somme dans le panier  -->
    <button class="btn-commander">Commander</button>
  </div>
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
const selectedItem = ref(1);

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
        price: "14.99€",
        image: new URL(
          "../images/StandBurger/Cheeseburger.jpg",
          import.meta.url
        ).href,
      },
      {
        name: "Montagnard",
        price: "19.99€",
        image: new URL("../images/StandBurger/Montagnard.jpg", import.meta.url)
          .href,
      },
      {
        name: "Hamburger",
        price: "12.99€",
        image: new URL("../images/StandBurger/Hamburger.png", import.meta.url)
          .href,
      },
      {
        name: "Bacon Burger",
        price: "15.99€",
        image: new URL("../images/StandBurger/Bacon.jpg", import.meta.url)
          .href,
      },
      {
        name: "Double Burger",
        price: "18.99€",
        image: new URL(
          "../images/StandBurger/DoubleBurger.jpg",
          import.meta.url
        ).href,
      },
      {
        name: "Chicken Burger",
        price: "16.99€",
        image: new URL(
          "../images/StandBurger/ChickenBurger.jpg",
          import.meta.url
        ).href,
      },
      {
        name: "Fish Burger",
        price: "17.99€",
        image: new URL("../images/StandBurger/FishBurger.jpg", import.meta.url)
          .href,
      },
      {
        name: "Veggie Burger",
        price: "13.99€",
        image: new URL(
          "../images/StandBurger/VeggieBurger.jpg",
          import.meta.url
        ).href,
      },
    ],
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
.burger-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  margin-top: 20px;
}

.burger-card {
  width: 220px;
  background-color: #fff8dc;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 15px;
}

.burger-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.burger-card h3 {
  margin: 10px 0 5px;
  font-size: 1.1rem;
}

.burger-card .price {
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 10px;
}

.burger-card .btn-commander {
  padding: 8px 15px;
  border: none;
  background-color: #f8e16c;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.burger-card .btn-commander:hover {
  background-color: #e1c44c;
}

.burger-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 20px rgba(0,0,0,0.25);
}

</style>
