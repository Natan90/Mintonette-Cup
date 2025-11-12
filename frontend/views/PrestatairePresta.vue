<template>
  <NavView></NavView>

  <div class="routeurLink">
    <router-link to="/" class="btnLink">Home</router-link>
  </div>

  <div v-if="utilisateur">
    {{ utilisateur.prenom_utilisateur }} {{ utilisateur.nom_utilisateur }}
  </div>

  <div>
    <span v-for="(elt, index) in article" :key="index">
      <span
        :id="'id' + index"
        @click="selectArticle(index)"
        class="article_title">
        {{ elt.nom }}
      </span>
    </span>

    <p>{{ descriArticle[selectedItem].descri }}</p>
  </div>

  <div class="route">
    <h3>Prévisualisation :</h3>
    <div v-html="content"></div>
    <button @click="saveArticle()">Sauvegarder</button>
    <div class="ConteneurImageBurger">
      <img src="../images/PhotoFond.png" alt="photo_fond" id="photo_presta" />
    </div>
  </div>
  <br />
  <Editor
    v-model="content"
    api-key="sd8q04ss2q9ej9zg4jvcgu10p2mxdckx4rgnbbhdrojqrgpo"
    :init="{
      height: 500,
      width: 1000,
      menubar: false,
      plugins: 'lists link image code',
      toolbar: 'undo redo | bold italic underline | bullist numlist | code',
    }" />

  <Footer></Footer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import Editor from "@tinymce/tinymce-vue";
import { useUserStore } from "@/stores/user";

import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const content = ref("");
const selectedItem = ref(0);

const article = [
  { nom: "Article 1" },
  { nom: "Article 2" },
  { nom: "Article 3" },
  { nom: "Article 4" },
];

const descriArticle = [
  { descri: "Description Article 1" },
  { descri: "Description Article 2" },
  { descri: "Description Article 3" },
  { descri: "Description Article 4" },
];

function selectArticle(id: number) {
  if (id >= article.length) return;
  selectedItem.value = id;
}


async function saveArticle() {
  try {
    const res = await axios.post("http://localhost:3000/PrestatairePresta", {
      contenu: content.value,
      utilisateur_id: userStore.userId,
    });
    console.log("Article sauvegardé :", res.data);
    alert("Article sauvegardé avec succès !");
  } catch (err) {
    console.error("Erreur lors de la sauvegarde :", err);
    alert("Erreur lors de la sauvegarde de l'article");
  }
}
//Il faudra ajouter dans la vraie base de donnée SQL pour que ca marche vraiment 
content.value = localStorage.getItem("editorContent") || "";

watch(content, (newVal) => {
  localStorage.setItem("editorContent", newVal);
});

const userStore = useUserStore();
const utilisateur = ref(null);

watch(
  () => userStore.userId,
  async (newId) => {
    if (!newId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/utilisateur/show/${newId}`
      ); 
      console.log("Utilisateur récupéré:", res.data);
      utilisateur.value = res.data;
    } catch (err) {
      console.error(err);
    }
  },
  { immediate: true }
);
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
