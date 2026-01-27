<template>
  <NavView></NavView>
  <MenuAdmin></MenuAdmin>
  <div class="modal-backdrop" v-if="isDelete">
    <div class="modal-content">
      <span class="modal-close" @click="closeModal">&times;</span>
      <div>
        <p>
          {{ $t('adminPage.user.modal.confirmation') }}
          <span class="name_delete background_name" v-if="selectedUser">{{ selectedUser.nom_utilisateur }}</span> ?
        </p>

      </div>
      <div>
        <button @click="deleteUtilisateur(id_user)" class="btn_modal btn_supprimer">
          {{ $t('adminPage.prestataire.modal.btn_confirmer') }}
        </button>
      </div>
    </div>
  </div>
  <div class="main_content">
    <h1 class="page_title">
      {{ $t('adminPage.user.title') }}
    </h1>
    <p class="backgroundBorderL page_subtitle">
      {{ $t('adminPage.user.descri') }}
    </p>
    <div class="textAndFiltre">
      <p class="nb_presta toValidate" v-if="utilisateurs.filter(p => p.ispresta).length > 0">
        {{ $t('adminPage.user.nb_users', { count: utilisateurs.length, gotS: utilisateurs.length > 1 ? 's' : '' }) }}
      </p>
      <p class="nb_presta valid" v-else>
        {{ $t('adminPage.user.nb_userVide') }}
      </p>
        <div class="filtre">
          <label for="triAlpha">{{ $t('adminPage.tri.nom') }}</label>
          <select id="triAlpha" v-model="adminStore.typeTriUser">
            <option value="az">{{ $t('adminPage.tri.az') }}</option>
            <option value="za">{{ $t('adminPage.tri.za') }}</option>
            <option value="presta">{{ $t('adminPage.tri.presta') }}</option>
            <option value="nonPresta">{{ $t('adminPage.tri.nonPresta') }}</option>
          </select>
        </div>
    </div>
    <p class="backgroundBorderL message suppr" v-if="deleting">
      <span class="name_delete">{{ deletedUser.nom_utilisateur }} {{ deletedUser.prenom_utilisateur }}</span>{{ $t('adminPage.user.messageSuppr') }}
      <span class="modal-close" @click="closeMessageSuppr">&times;</span>
    </p>
    <div class="all_data">
      <table class="adminTable">
        <thead>
          <tr>
            <th>{{ $t('user.nom') }}</th>
            <th>{{ $t('user.prenom') }}</th>
            <th>{{ $t('adminPage.prestataire.prestataire') }}</th>
            <th>{{ $t('adminPage.prestataire.action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in utilisateursFiltres" :key="item.id_utilisateur">
            <td>
              {{ item.nom_utilisateur }}
            </td>
            <td>
              {{ item.prenom_utilisateur }}
            </td>
            <td>
              <span :class="{
                'badge-presta': item.ispresta,
                'badge-non': !item.ispresta
              }">
                <span v-if="item.ispresta">✅</span>
                <span v-else-if="item.waitingforadmin">⏳</span>
                <span v-else>❌</span>
              </span>
            </td>
            <td>
              <button class="btn_info" @click="showProfil(item.id_utilisateur)">
                {{ $t('adminPage.bouton.btn_voir') }}
              </button>
              <span v-if="item.ispresta">
                <button class="btn_refuser" @click="goToRetirerPrestataire">
                  {{ $t('adminPage.bouton.btn_retirer') }}
                </button>
              </span>
              <span v-else-if="item.waitingforadmin">
                <button class="btn_valider" @click="goToAcceptPrestataire">
                  {{ $t('adminPage.bouton.btn_valid') }}
                </button>
              </span>
              <button class="btn_supprimer" @click="ModalShow(item)">
                {{ $t('adminPage.bouton.btn_suppr') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
// import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import NavView from "@/components/NavView.vue";
import MenuAdmin from "@/components/MenuAdmin.vue";
import { useAdminStore } from "@/stores/admin";
import { useNavigationStore } from "@/stores/navigation";
import localData from "../../../backend/database/localData.js";
import { useAdminAPIStore } from "@/services/admin.service.js";

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const adminStore = useAdminStore();
const navStore = useNavigationStore();
const adminAPIStore = useAdminAPIStore();

const utilisateurs = ref([]);
const selectedUser = ref(null);
const deletedUser = ref(null);

const id_user = ref(0);

const isDelete = ref(false);
const deleting = ref(false);


const closeModal = () => {
    isDelete.value = false;
};

const closeMessageSuppr = () =>{
    deleting.value = false;
};

function showProfil(id_user) {
  navStore.previousRoute = route.fullPath;
  router.push({ 
    name: 'ShowAccount',
    params: { 
      userId: id_user,
      lang: locale.value
    }
  });
};

function goToAcceptPrestataire() {
  router.push({
    name: 'Prestataires',
    params: {
      lang: locale.value
    }
  })
}

function goToRetirerPrestataire() {
  router.push({
    name: 'Prestataires',
    params: {
      lang: locale.value
    }
  })
}


function ModalShow(user) {
    selectedUser.value = user;
    id_user.value = user.id_utilisateur;

    isDelete.value = true;
};


const utilisateursFiltres = computed(() => {
  let liste = [...utilisateurs.value];

  // Tri alphabétique
  liste.sort((a, b) => {
    if (adminStore.typeTriUser === "presta") {
      if (a.ispresta && !b.ispresta) return -1;
      if (!a.ispresta && b.ispresta) return 1;
    }

    if (adminStore.typeTriUser === "nonPresta") {
      if (a.ispresta && !b.ispresta) return 1;
      if (!a.ispresta && b.ispresta) return -1;
    }

    const nomA = a.nom_utilisateur?.toLowerCase() || "";
    const nomB = b.nom_utilisateur?.toLowerCase() || "";

    if (adminStore.typeTriUser === "za")
      return nomB.localeCompare(nomA);
    
    return nomA.localeCompare(nomB);

  });

  return liste;
});



onMounted(() => {
  getValuesUtilisateurs();
  if (!adminStore.typeTriUser) adminStore.typeTriUser = "az";
});



async function getValuesUtilisateurs() {
  try {
    const res = await adminAPIStore.GetUtilisateurs();
    utilisateurs.value = res.data;
    console.log(utilisateurs.value);

  } catch (err) {
    console.error("Erreur fetch utilisateurs:", err);
  }
};



async function deleteUtilisateur(idUser) {
  try {
    deletedUser.value = { ...selectedUser.value };

    await adminAPIStore.DeleteUtilisateur(idUser);

    isDelete.value = false;
    deleting.value = true;
    utilisateurs.value = utilisateurs.value.filter(u => u.id_utilisateur !== idUser);
    router.push({ name: 'Utilisateurs', params: { lang: locale.value } });

  } catch (err) {
    console.error("Erreur suppression utilisateur:", err);
  }
};
</script>

<style scoped>
.main_content {
  margin-left: 250px;
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page_title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page_subtitle {
  color: #374151;
  background: #e0f2fe;
  border-left: 4px solid #3b82f6;
}

.nb_presta {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
}

.toValidate {
  color: #d97706;
  background-color: #fef3c7;
}

.valid {
  color: #059669;
  background-color: #d1fae5;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
