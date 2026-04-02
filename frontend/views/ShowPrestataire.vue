<template>
  <NavView />
  <Modal v-model="showService" :bigger="true">
    <template #content>
      <div class="bloc_texte service_details">
        <div v-if="isActivityService" class="service_items_list">
          <h3>Activités</h3>
          <div v-if="activitesList.length > 0">
            <div v-for="(item, index) in activitesList" :key="index" class="service_item_card">
              <p><strong>{{ item.nom_activite }}</strong></p>
              <p>📅 {{ item.date_activite?.slice(0, 10) }} à {{ item.date_activite?.slice(11, 16) }}</p>
              <p>👥 {{ item.nb_participant }} participants max</p>
              <p>💰 {{ item.prix }} € / u</p>
            </div>
            <button>Réserver une activité</button>
          </div>
          <p v-else>Aucune activité disponible.</p>
        </div>

        <!-- Articles -->
        <div v-else class="service_items_list">
          <h3>Articles</h3>
          <div v-if="articlesList.length > 0">
            <div v-for="(item, index) in articlesList" :key="index" class="service_item_card">
              <p><strong>{{ item.nom_article }}</strong></p>
              <p>📦 Stock : {{ item.stock }}</p>
              <p>💰 {{ item.prix }} € / u</p>
            </div>
          </div>
          <p v-else>Aucun article disponible.</p>
        </div>
      </div>
    </template>
  </Modal>

  <div class="back-arrow pointer" @click="goBack">
    &#8592; {{ $t('bouton.retour') }}
  </div>  
  <div class="main_container">
    <div class="bloc_texte">
      <h1 class="page_title">
        {{ $t("adminPage.prestataire.service.title") }}
      </h1>
      <p v-html="$t('adminPage.prestataire.service.descri', {
        nom_prestataire: onePresta.nom_prestataire,
      })
        " class="backgroundBorderL page_subtitle"></p>
    </div>

    <div class="textAndFiltre paddingSides">
      <p class="nb_presta valid" v-if="services.filter((p) => p.activate).length > 0">
        {{
          $t("adminPage.prestataire.service.nb_services", {
            count: services.filter((p) => p.activate).length,
            gotS: services.filter((p) => p.activate).length > 1 ? "s" : "",
          })
        }}
      </p>
      <p class="nb_presta toValidate" v-else>
        {{ $t("adminPage.prestataire.service.nb_servicesVide") }}
      </p>
      <div class="filtre">
        <label for="triAlpha">{{ $t("adminPage.tri.nom") }}</label>
        <select id="triAlpha" v-model="adminStore.services">
          <option value="az">{{ $t("adminPage.tri.az") }}</option>
          <option value="za">{{ $t("adminPage.tri.za") }}</option>
          <option value="activer">{{ $t("adminPage.tri.activeFirst") }}</option>
          <option value="desactiver">
            {{ $t("adminPage.tri.inactiveFirst") }}
          </option>
        </select>
      </div>
    </div>
    <div class="backgroundBorderL message valid" v-if="activate">
      <p v-html="$t('adminPage.prestataire.service.messageActiver', {
        nomService: desactivateService?.nom_service,
      })
        "></p>
      <span class="modal-close" @click="closeMessageActivate">&times;</span>
    </div>

    <div class="backgroundBorderL message refus" v-else-if="desactivate">
      <p v-html="$t('adminPage.prestataire.service.messageDesactiver', {
        nomService: desactivateService?.nom_service,
      })
        "></p>
      <span class="modal-close" @click="closeMessageDesactivate">&times;</span>
    </div>

    <div class="backgroundBorderL message suppr" v-else-if="deleting">
      <p v-html="$t('adminPage.prestataire.service.messageSuppr', {
        nomService: desactivateService?.nom_service,
      })
        "></p>
      <span class="modal-close" @click="closeMessageSuppr">&times;</span>
    </div>

    <section>
      <div class="container_admin">
        <div class="container_cards">
          <p class="title_presta">{{ onePresta.nom_prestataire }}</p>
          <!-- <img src=""> -->
          <div class="description" v-html="onePresta.descri_prestataire"></div>
          <div class="contact_presta">
            <p class="contact_title"><b>Contact</b></p>
            <p>{{ onePresta.mail_prestataire }}</p>
            <p>{{ onePresta.tel_prestataire }}</p>
          </div>
          <p>
            {{ onePresta.prenom_utilisateur }} {{ onePresta.nom_utilisateur }}
          </p>
        </div>
        <div>
          <div class="services_container">
            <p>
              <b>
                {{
                  $t("prestataireInfo.services", {
                    gotS: services.length > 1 ? "s" : "",
                  })
                }}
              </b>
            </p>
            <ul>
              <li v-for="(item, index) in servicesFiltres" :key="index" class="service_item"
                style="padding-bottom: 10px">
                <div class="serviceWithButtons">
                  {{ item.nom_service }}
                  <span v-if="item.activate" class="active-icon" title="Actif">&#10003;</span>
                  <span v-else class="inactive-icon" title="Inactif">&#10007;</span>
                  <span class="diff_button">
                    <button class="btn_info" @click="getValuesArticlesOrActivitesByIdService(item.id_service, isActivityService)">
                      Voir
                    </button>
                    <!-- Boutons d'activation/désactivation uniquement pour le propriétaire -->
                    <button class="btn_activate" v-if="
                      !item.activate &&
                      userStore.isConnected &&
                      userStore.prestaId == idPresta
                    " @click="activateService(item)">
                      Activer
                    </button>
                    <button class="btn_desactivate" v-else-if="
                      item.activate &&
                      userStore.isConnected &&
                      userStore.prestaId == idPresta
                    " @click="desactivatingService(item)">
                      Désactiver
                    </button>
                    <button class="btn_supprimer" v-if="
                      userStore.isConnected && userStore.prestaId == idPresta
                    ">
                      Supprimer
                    </button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <div>
      <button @click="goToEditPrestataire" v-if="
        userStore.isConnected &&
        onePresta.ispresta &&
        userStore.prestaId === idPresta
      ">
        Modifier mon profil
      </button>
    </div>
  </div>

  <Footer></Footer>
</template>

<script setup>
import { useNavigationStore } from "@/stores/navigation";
import { onMounted, ref, computed, watch, onActivated } from "vue";
import { useRoute, useRouter } from "vue-router";
import NavView from "@/components/NavView.vue";
import Modal from "@/components/Modal.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";
import { useUserStore } from "@/stores/user";
import { usePrestataireStore } from "@/services/prestataire.service";
import { useServiceStore } from "@/services/service.service";
import { usePanierStore } from "@/services/panier.service";
import { useI18n } from "vue-i18n";


const { locale } = useI18n();
const navStore = useNavigationStore();
const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const userStore = useUserStore();
const prestataireStore = usePrestataireStore();
const serviceStore = useServiceStore();
const panierStore = usePanierStore();

const desactivateService = ref(null);

const activate = ref(false);
const desactivate = ref(false);
const deleting = ref(false);
const showService = ref(false);

const oneService = ref({
  id_service: null,
  nom_service: "",
  titre_service: { fr: "", en: "" },
  descri_service: { fr: "", en: "" },
  besoin: { fr: "", en: "" },
  prix: 0,
  nb_participants: 0,
  visible_public: true,
});

const isActivityService = ref(false);

const titre_service = ref("");
const descri_service = ref("");
const besoin_service = ref("");

const onePresta = ref({
  nom_prestataire: "",
  descri_prestataire: "",
  mail_prestataire: "",
  tel_prestataire: "",
  prenom_utilisateur: "",
  nom_utilisateur: "",
});
const articlesList = ref([]);
const activitesList = ref([]);

const services = ref([]);
const idPresta = computed(() => route.params.id);

watch(
  () => locale.value,
  (newLang) => {
    updateDescription();
  },
);

onMounted(async () => {
  await getValuesPrestataireById(idPresta.value);
  if (!adminStore.services) adminStore.services = "az";
});

const servicesFiltres = computed(() => {
  let liste = [...services.value];

  // Tri alphabétique
  liste.sort((a, b) => {
    if (adminStore.services === "activer") {
      if (a.activate && !b.activate) return -1;
      if (!a.activate && b.activate) return 1;
    }

    if (adminStore.services === "desactiver") {
      if (a.activate && !b.activate) return 1;
      if (!a.activate && b.activate) return -1;
    }

    const nomA = a.nom_service?.toLowerCase() || "";
    const nomB = b.nom_service?.toLowerCase() || "";

    if (adminStore.services === "za") return nomB.localeCompare(nomA);

    return nomA.localeCompare(nomB);
  });

  return liste;
});

/**
 * Masque le message de confirmation d’activation de service.
*/
const closeMessageActivate = () => {
  activate.value = false;
};
/**
 * Masque le message de confirmation de désactivation de service.
*/
const closeMessageDesactivate = () => {
  desactivate.value = false;
};
/**
 * Masque le message de suppression de service.
*/
const closeMessageSuppr = () => {
  deleting.value = false;
};

/**
 * Retourne à la page précédente enregistrée dans le store de navigation.
*/
function goBack() {
  if (navStore.previousRoute) {
    router.push(navStore.previousRoute);
  }
}

/**
 * Redirige vers la page d’édition du prestataire courant.
*/
function goToEditPrestataire() {
  router.push({
    name: "EditPrestataire",
    params: { id: idPresta.value },
  });
}

//==========================
//= Async functions presta =
//==========================
/**
 * Récupère les informations du prestataire ainsi que ses services associés.
*/
async function getValuesPrestataireById(id_presta) {
  try { 
    const res = await prestataireStore.GetPrestataireByIdPrestataire(id_presta);
    onePresta.value = res.data.prestataire;
    isActivityService.value = res.data.prestataire.is_activity ?? false;

    const id_prestataire = res.data.prestataire.id_prestataire;

    const resServices = await serviceStore.GetServiceByIdPrestataire(id_prestataire);
    services.value = resServices.data.services;

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}
async function getValuesArticlesOrActivitesByIdService(id_service, isActivityService) {
  showService.value = true;
  try { 
    let res = null;
    if (isActivityService) {
      res = await serviceStore.GetActiviteByIdService(id_service);
      console.log(res.data.activites);
      activitesList.value = res.data.activites.map(a => ({
        id_activite: a.id_activite,
        nom_activite: a.nom_activite,
        nb_participant: a.nb_participant,
        prix: Number(a.prix_activite),
        date_activite: a.date_activite?.slice(0, 10),
        heure_activite: a.date_activite?.slice(11, 16),
      }));
    } 
    else {
      res = await serviceStore.GetArticleByIdService(id_service);
      console.log(res.data.articles);
      articlesList.value = res.data.articles.map(a => ({
        id_article: a.id_article,
        nom_article: a.nom_article,
        stock: a.stock,
        prix: Number(a.prix_article),
      }));
    }

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}
/**
 * Désactive le service du prestataire.
 * 
 * @param {Array} service - Le service à désactiver.
 */
function desactivatingService(service) {
  desactivate.value = true;
  actionsService(service);
}
/**
 * Active le service du prestataire.
 * 
 * @param {Array} service - Le service à activer.
 */
function activateService(service) {
  activate.value = true;
  actionsService(service);
}
/**
 * Active ou désactive un service et met à jour son état local.
*/
async function actionsService(service) {
  try {
    desactivateService.value = service;

    const res = await serviceStore.ActivateService(service.id_service);

    const index = services.value.findIndex(s => s.id_service === service.id_service);
    if (index !== -1) {
      services.value[index].activate = !services.value[index].activate;
    }

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}
/**
 * Ajoute un service au panier de l’utilisateur connecté.
*/
async function addService(service) {
  if (!userStore.userId) {
    console.error("Utilisateur non connecté !");
    return;
  }

  try {
    const res = await panierStore.AddToPanier("service", service, userStore.userId);

    showService.value = false;
  } catch (err) {
    console.error("Erreur lors de l'ajout au panier :", err);
  }
}
/**
 * Met à jour les champs affichés du service selon la langue sélectionnée.
*/
function updateDescription() {
  if (oneService.value) {
    const titre = oneService.value.titre_service;
    const descri = oneService.value.descri_service;
    const besoin = oneService.value.besoin;

    titre_service.value = titre[locale.value]?.texte || "";
    descri_service.value = descri[locale.value]?.texte || "";
    besoin_service.value = besoin[locale.value] || "";
  }
}
</script>

<style>
.service_details {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
}

.service_details .page_title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.2;
}

.service_description {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 25px;
}

.service_besoin {
  background: #f6f8fa;
  padding: 15px 18px;
  border-radius: 10px;
  margin-bottom: 25px;
}

.service_besoin h3 {
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}

.service_besoin p {
  margin: 0;
  font-size: 0.95rem;
  color: #555;
}

.service_infos {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.info_item {
  flex: 1;
  min-width: 200px;
  background: #f0f3f7;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info_label {
  font-size: 0.9rem;
  color: #666;
}

.info_value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
}

.container_admin {
  display: flex;
  flex-direction: row;
  margin-left: 250px;
  gap: 200px;
}

.container_cards {
  min-width: 600px;
  background-color: yellow;
}

.bloc_texte {
  display: flex;
  flex-direction: column;
  padding: 0 50px;
}

.services_container {
  padding: 10px 20px;
  border: 3px solid black;
  border-radius: 10px;
  background-color: aqua;
}

.serviceWithButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.paddingSides {
  padding-left: 50px;
  padding-right: 90px;
}

span[title="Actif"] {
  color: green;
  font-weight: bold;
  margin-left: 10px;
}

span[title="Inactif"] {
  color: red;
  font-weight: bold;
  margin-left: 10px;
}
</style>
