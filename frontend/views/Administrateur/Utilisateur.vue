<template>
  <NavView></NavView>
  <MenuAdmin></MenuAdmin>

  <div class="main_content">
    <h2 class="title">Liste des utilisateurs</h2>

    <ul class="user-list">
      <li v-for="(item, index) in utilisateurs" :key="index" class="user-card">
        <div class="user-info">
          <span class="user-id">{{ item.id_utilisateur }}</span>
          <span class="user-name">{{ item.prenom_utilisateur }} {{ item.nom_utilisateur }}</span>
        </div>
        <button class="btn-delete" @click="supprimerUtilisateur(item.id_utilisateur)">
          Supprimer
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import NavView from "@/components/NavView.vue";
import MenuAdmin from "@/components/MenuAdmin.vue";

const { locale } = useI18n();

const utilisateurs = ref([]);



const fetchUtilisateurs = async () => {
  try {
    const res = await axios.get("http://localhost:3000/admin/show");
    utilisateurs.value = res.data;
  } catch (err) {
    console.error("Erreur fetch utilisateurs:", err);
  }
};

onMounted(fetchUtilisateurs);

const supprimerUtilisateur = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
  
  try {
    await axios.delete(`http://localhost:3000/admin/delete/${id}`);
    utilisateurs.value = utilisateurs.value.filter(u => u.id_utilisateur !== id);
  } catch (err) {
    console.error("Erreur suppression utilisateur:", err);
  }
};
</script>

<style scoped>
.main_content {
  max-width: 800px;
  margin-left: 250px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.home-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  text-decoration: none;
  color: #1abc9c;
  font-weight: bold;
}

.home-link:hover {
  color: #16a085;
}

.home-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.user-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: box-shadow 0.2s, transform 0.2s;
}

.user-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.user-info {
  display: flex;
  gap: 1rem;
  font-weight: 500;
}

.user-id {
  color: #888;
}

.user-name {
  color: #2c3e50;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #c0392b;
}
</style>
