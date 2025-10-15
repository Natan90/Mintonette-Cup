<template>
  <NavView></NavView>

  <div class="routeurLink">
    <router-link to="/" class="btnLink">Home</router-link>
  </div>

  <div>
    <span v-for="(elt, index) in article" :key="index">
      <span :id="'id' + index" @click="selectArticle(index)" class="article_title">
        {{ elt.nom }}
      </span>
    </span>

    <p>{{ descriArticle[selectedItem].descri }}</p>
  </div>

  <div class="route">

  </div>
  <br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br>






  <Footer></Footer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Editor from '@tinymce/tinymce-vue'


import NavView from "@/components/NavView.vue"
import Footer from "@/components/Footer.vue";

const content = ref('')
const selectedItem = ref(0)

const article = [
  { "nom": "Articles favoris" },
  { "nom": "Nos suggestions" },
  { "nom": "Nouveautés" },
  { "nom": "Bon plan" }
]

const descriArticle = [
  { "descri": "Description Article 1" },
  { "descri": "Description Article 2" },
  { "descri": "Description Article 3" },
  { "descri": "Description Article 4" }
]

function selectArticle(id: number) {
  if (id >= article.length) return
  selectedItem.value = id
}
</script>

<style scoped>
#photo_presta {
  width: 500px;
}

.article_title {
  padding: 0px 20px;
  cursor: pointer;
}

[id^="id"]:hover {
  background-color: yellow;
}
</style>
