<template>
  <NavView></NavView>
  <div class="back-arrow pointer" @click="goBack">&#8592; Retour</div>

  <section>
    <div>
      <p v-if="isActivityService">
        Ajoutez les activités proposées dans le cadre du service <span class="name_delete">{{ service.nom_service }}</span>. Chaque activité peut avoir sa propre date, son horaire, son tarif et son nombre de participants.
      </p>

      <p v-else>
        Ajoutez les articles disponibles à la vente pour le service <span class="name_delete">{{ service.nom_service }}</span>. Précisez le nom, le stock disponible et le prix de chaque article.
      </p>
    </div>
  </section>

  <div class="page_wrapper">
    <!-- Bloc Activité -->
    <div v-if="isActivityService" class="bloc_container">
      <div class="bloc_header">
        <h4 class="bloc_title">Activités</h4>
      </div>

      <div class="form_group">
        <label>Nom de l'activité</label>
        <input class="input_text" placeholder="Ex: Initiation escalade" v-model="nom_activite"/>
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Participants max</label>
          <input type="number" class="input_number" placeholder="0" v-model="nb_participants"/>
        </div>
        <div class="form_group">
          <label>Prix de l'entrée</label>
          <input type="number" class="input_number" placeholder="0.00" v-model="prix_activite"/>
        </div>
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Date</label>
          <input type="date" class="input_text" v-model="date_activite"/>
        </div>
        <div class="form_group">
          <label>Heure</label>
          <input type="time" class="input_text" v-model="heure_activite"/>
        </div>
      </div>

      <div class="btn_container">
        <button class="btn_add" @click="addInItemsList()">+ Ajouter</button>
      </div>

      <!-- Liste des activités ajoutées -->
      <div class="items_list">
        <p v-if="itemsList.length > 0" v-for="(item, index) in itemsList" :key="index">
          {{ item.nom_activite }}
        </p>
        <p class="list_empty" v-else>Aucune activité ajoutée pour l'instant.</p>
      </div>
    </div>

    <!-- Bloc Article -->
    <div v-else class="bloc_container">
      <div class="bloc_header">
        <h4 class="bloc_title">Articles</h4>
      </div>

      <div class="form_group">
        <label>Nom de l'article</label>
        <input class="input_text" placeholder="Ex: T-shirt XL" v-model="nom_article"/>
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Stock</label>
          <input type="number" class="input_number" placeholder="0" v-model="stock_article"/>
        </div>
        <div class="form_group">
          <label>Prix (€)</label>
          <input type="number" class="input_number" placeholder="0.00" v-model="prix_article"/>
        </div>
      </div>

      <div class="btn_container">
        <button class="btn_add" @click="addInItemsList()">+ Ajouter</button>
      </div>
      <div v-if="message" class="message"
          :class="messageType === 'error' ? 'message-error' : 'message-success'">
          <span class="text">{{ message }}</span>
          <span class="modal-close" @click="closeMessage">&times;</span>
      </div>

      <!-- Liste des articles ajoutés -->
      <div class="items_list">
        <p v-if="itemsList.length > 0" v-for="(item, index) in itemsList" :key="index">
          {{ item.nom_article }}
        </p>
        <p class="list_empty" v-else>Aucun article ajouté pour l'instant.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import NavView from './NavView.vue';
import { useServiceStore } from '@/services/service.service';
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';

const route = useRoute();
const router = useRouter();
const serviceStore = useServiceStore();
const navStore = useNavigationStore();

const isActivityService = computed(() => route.query.isActivityService === 'true');
console.log("isActivityService :", isActivityService.value);
const id_service = computed(() => route.params.id);

const message = ref("");
const messageType = ref("success");

const itemsList = ref([]);
const service = ref([]);

// Activite
const nom_activite = ref("");
const nb_participants = ref(0);
const prix_activite = ref(0);
const date_activite = ref(null);
const heure_activite = ref(null);

// Article
const nom_article = ref("");
const stock_article = ref(0);
const prix_article = ref(0);

onMounted(() => {
  getValuesItemsList();
})

const closeMessage = () => {
  message.value = "";
};

function goBack() {
  if (navStore.previousRoute) {
    router.push(navStore.previousRoute);
  }
}


async function getValuesItemsList() {
  try {
    const res = await serviceStore.GetServiceById(id_service.value);
    service.value = res.data.service;

    if (isActivityService.value) {
      itemsList.value = res.data.activites;
    } else {
      itemsList.value = res.data.articles;
    }

  } catch (err) {
    console.error(err);
  }
}

async function addInItemsList() {
  try {
    let res = null;
    
    if (isActivityService.value) {
      console.log("dans activities avec isActivityService =", isActivityService.value);
      res = await serviceStore.AddActivites(id_service.value, {
        nom: nom_activite.value, 
        nb_participant: nb_participants.value,
        prix: prix_activite.value,
        date: date_activite.value,
        heure: heure_activite.value
      });
    }
    else {
      console.log("dans articles avec isActivityService =", isActivityService.value);
      res = await serviceStore.AddArticles(id_service.value, {
        nom: nom_article.value,
        stock: stock_article.value,
        prix: prix_article.value
      })
    }
    message.value = res.data.message;
    messageType.value = res.status === 201 ? "success" : "error";

    getValuesItemsList();

  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped>
/* ── Variables ── */
.page_wrapper {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

/* ── Carte principale ── */
.bloc_container {
  width: 100%;
  max-width: 620px;
  background: var(--log-card-bg);
  border-radius: 18px;
  border: 1.5px solid var(--log-border);
  padding: 32px;
  box-shadow: 0 8px 30px rgba(58, 111, 67, 0.1), 0 2px 8px rgba(232, 99, 122, 0.06);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── En-tête du bloc ── */
.bloc_header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--log-border);
}

.bloc_title {
  font-size: 1.3em;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* ── Groupes de champs ── */
.form_group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form_group label {
  font-weight: 700;
  font-size: 0.88em;
  color: var(--primary-dark);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.input_text,
.input_number {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--log-border);
  background: #fff;
  color: #2a3d2e;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.input_text:focus,
.input_number:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(90, 153, 102, 0.15);
}

.input_text::placeholder,
.input_number::placeholder {
  color: #a8bfab;
  font-weight: 400;
}

/* ── Ligne de deux champs ── */
.row_inputs {
  display: flex;
  gap: 16px;
}

.row_inputs .form_group {
  flex: 1;
}

/* ── Bouton ajouter ── */
.btn_container {
  display: flex;
  justify-content: flex-end;
}

.btn_add {
  background: var(--log-gradient-cta);
  color: #fff;
  font-weight: 700;
  font-size: 0.95em;
  padding: 10px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.25);
  transition: all 0.25s ease;
  letter-spacing: 0.4px;
}

.btn_add:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(58, 111, 67, 0.35);
}

.btn_add:active {
  transform: translateY(1px) scale(0.98);
}

/* ── Liste des éléments ajoutés ── */
.items_list {
  margin-top: 4px;
  border-top: 1.5px dashed var(--log-border);
  padding-top: 16px;
}

.list_empty {
  text-align: center;
  color: #a8bfab;
  font-size: 0.9em;
  font-style: italic;
  margin: 0;
}
</style>