<template>
  <NavView></NavView>

  <div class="routeurLink">
    <router-link to="/" class="btnLink">Home</router-link>
  </div>

  <div>
    <span v-for="(elt, index) in article" :key="index">
      <span :id="'id' + index" @click="selectArticle(index)" class="article_title">
        {{ elt.nom }} &nbsp;&nbsp;
      </span>
    </span>

    <p>{{ descriArticle[selectedItem].descri }}</p>
  </div>

  <div class="route">
    <div class="ConteneurTexte">
      <span>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
        industry's standard dummy text ever since the 1500s...
      </span>
    </div>

    <div class="ConteneurImageBurger">
      <img src="../images/PhotoFond.png" alt="photo_fond" id="photo_presta">
    </div>
  </div>
<br>
    <Editor
        v-model="content"
        api-key="no-api-key"
    :init="{
    height: 500,
    width: 1000,
    menubar: false,
    plugins: 'lists link image code',
    toolbar: 'undo redo | bold italic underline | bullist numlist | code'
    }"
    />

    <h3>Prévisualisation :</h3>
    <div v-html="content"></div>


</template>

<script setup lang="ts">
import { ref } from "vue"
import Editor from '@tinymce/tinymce-vue'


import NavView from "@/components/NavView.vue"

const content = ref('')
const selectedItem = ref(0)

const article = [
  { "nom": "Article 1" },
  { "nom": "Article 2" },
  { "nom": "Article 3" },
  { "nom": "Article 4" }
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
  cursor: pointer;
}

#id:hover {

}
</style>
