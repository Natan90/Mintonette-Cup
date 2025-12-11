<template>
  
  <div class="route">
    <h3>Prévisualisation :</h3>
    <div v-html="content"></div>
    <button @click="saveArticle()">Sauvegarder</button>
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
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import Editor from "@tinymce/tinymce-vue";
import { useUserStore } from "@/stores/user";


const content = ref("");

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
    // alert("Erreur lors de la sauvegarde de l'article");
    alert("Erreur lors de la sauvegarde !");
  }
}
//Il faudra ajouter dans la vraie base de donnée SQL pour que ca marche vraiment 
// content.value = localStorage.getItem("editorContent") || "";

// watch(content, (newVal) => {
//   localStorage.setItem("editorContent", newVal);
// });

const userStore = useUserStore();
const utilisateur = ref(null);

// watch(
//   () => userStore.userId,
//   async (newId) => {
//     if (!newId) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/utilisateur/show/${newId}`
//       ); 
//       console.log("Utilisateur récupéré:", res.data);
//       utilisateur.value = res.data;
//     } catch (err) {
//       console.error(err);
//     }
//   },
//   { immediate: true }
// );
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
