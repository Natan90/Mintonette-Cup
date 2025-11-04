<template>
  <div>
    <h2>Liste des utilisateurs</h2>
    <ul>
      <li v-for="(item, index) in utilisateurs" :key="index">
        {{ item.prenom_utilisateur }} {{ item.nom_utilisateur }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const utilisateurs = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/utilisateur/show");
    utilisateurs.value = res.data; // récupère tous les champs
  } catch (err) {
    console.error("Erreur fetch utilisateurs:", err);
  }
});
</script>
