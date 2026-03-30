<template>
  <NavView></NavView>
  <div class="back-arrow pointer" @click="goBack()">&#8592; Retour</div>

  <Modal v-model="isShowingRecapService" :bigger="true">
    <template #content>
      <div class="recap_container">

        <h2 class="recap_title">Récapitulatif du service</h2>

        <!-- Infos service -->
        <div class="recap_section">
          <p><strong>Nom :</strong> {{ nomService }}</p>
          <p><strong>Description :</strong></p>
          <div v-html="currentDescri"></div>
          <p><strong>Besoin :</strong> {{ currentBesoin }}</p>
          <p><strong>Visible :</strong> {{ visiblePublic ? "Oui" : "Non" }}</p>
          <p><strong>Activé :</strong> {{ activate ? "Oui" : "Non" }}</p>
        </div>

        <!-- Activités -->
        <div v-if="isActivityService" class="recap_section">
          <h3>Activités</h3>

          <div v-if="activitesList.length > 0">
            <div v-for="(item, index) in activitesList" :key="index" class="recap_item">
              <p><strong>{{ item.nom_activite }}</strong></p>
              <p>📅 {{ item.date_activite }} à {{ item.heure_activite }}</p>
              <p>👥 {{ item.nb_participant }} participants</p>
              <p>🪙 {{ item.prix }} €</p>
            </div>
          </div>

          <p v-else>Aucune activité ajoutée</p>
        </div>

        <!-- Articles -->
        <div v-else class="recap_section">
          <h3>Articles</h3>

          <div v-if="articlesList.length > 0">
            <div v-for="(item, index) in articlesList" :key="index" class="recap_item">
              <p><strong>{{ item.nom_article }}</strong></p>
              <p>📦 Stock : {{ item.stock }}</p>
              <p>🪙 {{ item.prix }} €</p>
            </div>
          </div>

          <p v-else>Aucun article ajouté</p>
        </div>
        <div v-if="message && isShowingRecapService" class="message"
          :class="messageType === 'error' ? 'message-error' : 'message-success'">
          <span class="text">{{ message }}</span>
          <span class="modal-close" @click="closeMessage()">&times;</span>
        </div>

        <!-- Actions -->
        <div class="recap_actions">
          <button class="btn_modal btn_refuser" @click="isShowingRecapService = false">
            Modifier
          </button>
          <button class="btn_modal btn_valider" @click="addServiceToPrestataire()">
            Confirmer
          </button>
        </div>

      </div>
    </template>
  </Modal>

  <v-dialog v-model="showLeaveDialog" max-width="500" class="confirmLeave">
    <v-card title="Quitter la page ?">
      <v-card-text>
        <span v-if="!hasData && !isGoingBack">
          Vous n'avez ajouté aucune donnée. Le service créé précédemment sera <strong>perdu</strong> si vous quittez.
        </span>
        <span v-else-if="hasData">
          Vous avez des modifications <strong>non sauvegardées</strong>. Si vous quittez cette page, toutes vos données
          seront perdues.
        </span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Rester sur la page" @click="cancelLeave()"></v-btn>
        <v-btn color="error" text="Quitter quand même" @click="confirmLeave()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <section>
    <div>
      <p v-if="isActivityService">
        Ajoutez les activités proposées dans le cadre du service <span class="name_delete">{{ nomService }}</span>.
        Chaque
        activité peut avoir sa propre date, son horaire, son tarif et son nombre de participants.
      </p>

      <p v-else>
        Ajoutez les articles disponibles à la vente pour le service <span class="name_delete">{{ nomService }}</span>.
        Précisez le nom, le stock disponible et le prix de chaque article.
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
        <input class="input_text" placeholder="Ex: Initiation escalade" v-model="nom_activite" />
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Participants max</label>
          <input type="number" class="input_number" placeholder="0" v-model.number="nb_participants" />
        </div>
        <div class="form_group">
          <label>Prix de l'entrée</label>
          <input type="number" class="input_number" placeholder="0.00" v-model.number="prix_activite" />
        </div>
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Date</label>
          <input type="date" class="input_text" v-model="date_activite" />
        </div>
        <div class="form_group">
          <label>Heure</label>
          <input type="time" class="input_text" v-model="heure_activite" />
        </div>
      </div>

      <div class="btn_container">
        <button class="btn_add pointer" @click="addInItemsList()">+ Ajouter une activité</button>
      </div>
      <div v-if="message && !isShowingRecapService" class="message"
        :class="messageType === 'error' ? 'message-error' : 'message-success'">
        <span class="text">{{ message }}</span>
        <span class="modal-close" @click="closeMessage()">&times;</span>
      </div>

      <!-- Liste des activités ajoutées -->
      <div class="items_list">
        <div v-if="activitesList.length > 0" v-for="(item, index) in activitesList" :key="index" class="item_card">
          <div class="item_card_header">
            <span class="item_name">{{ item.nom_activite }}</span>
            <button class="btn_remove_item" @click="activitesList.splice(index, 1)">&times;</button>
          </div>
          <div class="item_card_details">
            <span>📅 {{ item.date_activite }} à {{ item.heure_activite }}</span>
            <span>👥 {{ item.nb_participant }} participants max</span>
            <span>💰 {{ item.prix }} €</span>
          </div>
        </div>
        <p class="list_empty" v-else>Aucune activité ajoutée pour l'instant.</p>
      </div>
      <div class="btn_container" v-if="!alreadyAddedService || hasChanged">
        <button class="btn_service_submit" @click="showRecapService()">+ Ajouter ce service</button>
      </div>
      <div class="btn_container" v-else-if="alreadyAddedService && hasChanged">
        <button class="btn_service_submit" @click="showRecapService()">+ Modifier ce service</button>
      </div>
      <div v-else class="already_added_banner">
        <span class="already_added_icon"><img src="../images/logo_valid.svg"></span>
        <div>
          <p class="already_added_title">Service ajouté avec succès</p>
          <p class="already_added_sub">Ce service a déjà été enregistré.</p>
        </div>
      </div>
      
    </div>

    <!-- Bloc Article -->
    <div v-else class="bloc_container">
      <div class="bloc_header">
        <h4 class="bloc_title">Articles</h4>
      </div>

      <div class="form_group">
        <label>Nom de l'article</label>
        <input class="input_text" placeholder="Ex: T-shirt XL" v-model="nom_article" />
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Stock</label>
          <input type="number" class="input_number" placeholder="0" v-model.number="stock_article" />
        </div>
        <div class="form_group">
          <label>Prix (€)</label>
          <input type="number" class="input_number" placeholder="0.00" v-model.number="prix_article" />
        </div>
      </div>

      <div class="btn_container">
        <button class="btn_add pointer" @click="addInItemsList()">+ Ajouter un article</button>
      </div>
      <div v-if="message && !isShowingRecapService" class="message"
        :class="messageType === 'error' ? 'message-error' : 'message-success'">
        <span class="text">{{ message }}</span>
        <span class="modal-close" @click="closeMessage()">&times;</span>
      </div>

      <!-- Liste des articles ajoutés -->
      <div class="items_list">
        <div v-if="articlesList.length > 0" v-for="(item, index) in articlesList" :key="index" class="item_card">
          <div class="item_card_header">
            <span class="item_name">{{ item.nom_article }}</span>
            <button class="btn_remove_item" @click="articlesList.splice(index, 1)">&times;</button>
          </div>
          <div class="item_card_details">
            <span>📦 Stock : {{ item.stock }}</span>
            <span>💰 {{ item.prix }} €</span>
          </div>
        </div>
        <p class="list_empty" v-else>Aucun article ajouté pour l'instant.</p>
      </div>
      <div class="btn_container" v-if="!alreadyAddedService || hasChanged">
        <button class="btn_service_submit" @click="showRecapService()">+ Ajouter ce service</button>
      </div>
      <div class="btn_container" v-else-if="alreadyAddedService && hasChanged">
        <button class="btn_service_submit" @click="showRecapService()">+ Modifier ce service</button>
      </div>
      <div v-else class="already_added_banner">
        <span class="already_added_icon"><img src="../images/logo_valid.svg"></span>
        <div>
          <p class="already_added_title">Service ajouté avec succès</p>
          <p class="already_added_sub">Ce service a déjà été enregistré.</p>
        </div>
      </div>
    </div>

  </div>
  <Footer></Footer>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import NavView from './NavView.vue';
import { useServiceStore } from '@/services/service.service';
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';
import { usePrestataireInfoStore } from '@/stores/prestataire_info';
import { storeToRefs } from "pinia";
import Footer from './Footer.vue';


const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const serviceStore = useServiceStore();
const navStore = useNavigationStore();
const prestataireInfoStore = usePrestataireInfoStore();

const isActivityService = computed(() => route.query.isActivityService === 'true');
const id_presta = computed(() => route.params.id_presta);
const id_service = computed(() => route.params.id);

const message = ref("");
const messageType = ref("success");
const pendingNavigation = ref(null);
const showLeaveDialog = ref(false);
const allowLeave = ref(false);
const isShowingRecapService = ref(false);
const isGoingBack = ref(false);


// ── Service ───────────────────────────────────
const currentDescri = computed({
  get() {
    return descriService.value[locale.value];
  },
  set(value) {
    descriService.value[locale.value] = value;
  },
});

const currentBesoin = computed({
  get() {
    return besoinService.value[locale.value];
  },
  set(value) {
    besoinService.value[locale.value] = value;
  },
});

const newItemsList = ref([]);

const hasChanged = computed(() => {
  const current = isActivityService.value ? activitesList.value : articlesList.value;
  return JSON.stringify(current) !== JSON.stringify(newItemsList.value);
});

const alreadyAddedService = ref(false);

// ── Store Refs ───────────────────────────────────
const {
  nom, descri, mail, tel,
  nomService, descriService, besoinService,
  visiblePublic, activate, articlesList, activitesList
} = storeToRefs(prestataireInfoStore);

console.log("nomService : " + nomService.value)

const hasData = computed(() => {
  if (isActivityService.value) {
    return (
      nom_activite.value.trim() !== "" ||
      date_activite.value ||
      heure_activite.value ||
      nb_participants.value > 0 ||
      prix_activite.value > 0
    );
  } else {
    return (
      nom_article.value.trim() !== "" ||
      stock_article.value > 0 ||
      prix_article.value > 0
    );
  }
});

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


// ── onBeforeRouteLeave ────────────────────────────────────
onBeforeRouteLeave((to, from, next) => {
  if (allowLeave.value) {
    next();
    return;
  }

  if (alreadyAddedService.value && !hasChanged.value) {
    prestataireInfoStore.clearItemsStore();
    allowLeave.value = true;
    next();
    return;
  }

  if (isGoingBack.value && !hasData.value && !hasChanged.value) {
    prestataireInfoStore.clearItemsStore();
    next();
    return;
  }

  if (!showLeaveDialog.value) {
    pendingNavigation.value = to;
    showLeaveDialog.value = true;
  }
  next(false);
});

onMounted(() => {
  newItemsList.value = createCloneOfItemsList(isActivityService.value);
});

const closeMessage = () => {
  message.value = "";
};

// ── Retour avec données non sauvegardées ──────────────────────────────────
/**
 * Annule la tentative de navigation et ferme la popup de confirmation de sortie.
 */
function cancelLeave() {
  showLeaveDialog.value = false;
  pendingNavigation.value = null;
}
/**
 * Confirme la sortie de la page, vide les stores si nécessaire et redirige vers la route demandée.
 */
function confirmLeave() {
  showLeaveDialog.value = false;
  if (isGoingBack.value) {
    prestataireInfoStore.clearItemsStore();
  }
  else {
    prestataireInfoStore.clearStore();
  }
  allowLeave.value = true;

  const target = pendingNavigation.value;
  pendingNavigation.value = null;

  if (target) {
    navStore.previousRoute = route.fullPath;
    router.push(target);
  }
}
/**
 * Retourne à la page précédente en utilisant la dernière route enregistrée dans le store de navigation.
 */
function goBack() {
  isGoingBack.value = true;
  const target = navStore.previousRoute;
  if (target) {
    router.push(target);
  }
}


// ── Articles / Activités ──────────────────────────────────
/**
 * Vérifie si une activité ou un article existe déjà dans la liste afin d'éviter les doublons.
 * @returns {boolean} true si l'élément existe déjà, sinon false
 */
function alreadyExists() {
  const normalize = (str) => (str || "").trim().toLowerCase();

  if (isActivityService.value) {
    return activitesList.value.some(item =>
      normalize(item.nom_activite) === normalize(nom_activite.value) &&
      item.date_activite === date_activite.value &&
      item.heure_activite === heure_activite.value
    );
  }

  else {
    return articlesList.value.some(item =>
      normalize(item.nom_article) === normalize(nom_article.value) &&
      item.stock === Number(stock_article.value) &&
      item.prix === Number(prix_article.value)
    );
  }

  return false;
}
/**
 * Créé un clone du tableau activitesList ou articlesList en fonction de isActivity
 * @param {Boolean} isActivity - true si on ajoute des activités, false sinon 
 * @returns {Array} un clone du tableau
 */
function createCloneOfItemsList(isActivity) {
  const list = isActivity ? activitesList.value : articlesList.value;
  return JSON.parse(JSON.stringify(list));
}
/**
 * Ajoute une activité ou un article dans la liste locale après validation des champs.
 * Réinitialise ensuite les champs du formulaire et affiche un message de confirmation.
 */
async function addInItemsList() {
  if (!hasData.value) {
    message.value = "Veuillez remplir tous les champs."
    messageType.value = "error";
    return;
  }

  alreadyExists();

  if (isActivityService.value) {
    activitesList.value.push({
      nom_activite: nom_activite.value,
      date_activite: date_activite.value,
      heure_activite: heure_activite.value,
      nb_participant: Number(nb_participants.value),
      prix: Number(prix_activite.value)
    });

    nom_activite.value = "";
    nb_participants.value = 0;
    prix_activite.value = 0;
    date_activite.value = null;
    heure_activite.value = null;

    message.value = "Activité ajoutée.";
    messageType.value = "success";
  }
  else {
    articlesList.value.push({
      nom_article: nom_article.value,
      stock: Number(stock_article.value),
      prix: Number(prix_article.value)
    });

    nom_article.value = "";
    stock_article.value = 0;
    prix_article.value = 0;

    message.value = "Article ajouté.";
    messageType.value = "success";
  }

  // Create a clone to compare with previous tab
  // Put alreadyAddedService in computed
}


// ── Services ──────────────────────────────────
/**
 * Affiche la modal de récapitulatif du service avant validation finale.
 */
function showRecapService() {
  isShowingRecapService.value = true;
}
/**
 * Crée les activités côté backend.
 */
async function addActivitesToService(idService) {
  for (let i = 0; i < activitesList.value.length; i++) {
    const elt = activitesList.value[i];

    await serviceStore.AddActivites(idService, {
      nom: elt.nom_activite,
      nb_participant: Number(elt.nb_participant),
      prix: Number(elt.prix),
      date: elt.date_activite,
      heure: elt.heure_activite
    });
  }
}
/**
 * Crée les articles côté backend.
 */
async function addArticlesToService(idService) {
  for (let i = 0; i < articlesList.value.length; i++) {
    const elt = articlesList.value[i];

    await serviceStore.AddArticles(newServiceId, {
      nom: elt.nom_article,
      stock: Number(elt.stock),
      prix: Number(elt.prix)
    });
  }
}
/**
 * Crée le service côté backend.
 * Affiche un message de succès ou d'erreur selon le résultat de l'opération.
 */
async function addServiceToPrestataire() {
  try {
    if (isActivityService.value) {
      addActivitesToService(id_service.value);
    }
    else {
      addArticlesToService(id_service.value);
    }

    alreadyAddedService.value = true;
    newItemsList.value = createCloneOfItemsList(isActivityService.value);

    message.value = "Service ajouté avec succès !";
    messageType.value = "success";

  } catch (err) {
    message.value = err.message;
    messageType.value = "error";
  }
}
</script>

<style scoped>
.recap_container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 6px;
}

.recap_title {
  font-size: 1.5em;
  font-weight: bold;
}

.recap_section {
  background: #f8fdf9;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #dfeee2;
}

.recap_item {
  border-bottom: 1px dashed #ccc;
  padding: 8px 0;
}

.recap_item:last-child {
  border-bottom: none;
}

.recap_actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

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
  font-weight: 500;
  font-size: 0.85em;
  padding: 10px 24px;
  border: none;
  border-radius: 25px;
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

.item_card {
  background: #fff;
  border: 1.5px solid var(--log-border);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  transition: box-shadow 0.2s ease;
}

.item_card:hover {
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.1);
}

.item_card_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item_name {
  font-weight: 700;
  font-size: 1em;
  color: var(--primary-dark);
}

.item_card_details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item_card_details span {
  font-size: 0.85em;
  color: #5a7a5e;
  background: #f0f7f1;
  padding: 4px 10px;
  border-radius: 20px;
}

.btn_remove_item {
  background: transparent;
  border: none;
  color: #e8637a;
  font-size: 1.3em;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s ease, transform 0.2s ease;
  padding: 0 4px;
}

.btn_remove_item:hover {
  color: #c94d65;
  transform: scale(1.2);
}

.already_added_banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #edf7ef, #f5fcf6);
  border: 1.5px solid #a8d9b0;
  border-radius: 14px;
  padding: 16px 20px;
  margin-top: 8px;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.1);
}

.already_added_icon {
  font-size: 2em;
  flex-shrink: 0;
}

.already_added_title {
  font-weight: 700;
  font-size: 1em;
  color: var(--primary-dark);
  margin: 0 0 2px 0;
}

.already_added_sub {
  font-size: 0.85em;
  color: #5a7a5e;
  margin: 0;
}
</style>