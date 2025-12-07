<template>
  <div>
    <router-link to="/">
      <img class="pointer" />Home 
    </router-link>
    <h2>Liste des utilisateurs</h2>
    <ul>
      <li v-for="(item, index) in utilisateurs" :key="index">
        {{ item.prenom_utilisateur }} {{ item.nom_utilisateur }}
        <button @click="supprimerUtilisateur(item.id_utilisateur)">Supprimer</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const utilisateurs = ref([]);

const fetchUtilisateurs = async () => {
  try {
    const res = await axios.get("http://localhost:3000/utilisateur/show");
    utilisateurs.value = res.data;
  } catch (err) {
    console.error("Erreur fetch utilisateurs:", err);
  }
};

onMounted(fetchUtilisateurs);

// Fonction pour supprimer un utilisateur
const supprimerUtilisateur = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
  
  try {
    await axios.delete(`http://localhost:3000/utilisateur/${id}`);
    // Retirer l'utilisateur de la liste locale pour mise à jour immédiate
    utilisateurs.value = utilisateurs.value.filter(u => u.id_utilisateur !== id);
  } catch (err) {
    console.error("Erreur suppression utilisateur:", err);
  }
};
</script>
