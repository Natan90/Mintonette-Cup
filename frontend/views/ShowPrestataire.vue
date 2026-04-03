<template>
  <NavView />
  <Modal v-model="showService" :bigger="true">
    <template #content>
      <div class="showPrestaTexte showPrestaServiceDetail">
        <div v-if="isActivityService" class="show-prestataire__items-list">
          <h3>Activités</h3>
          <div v-if="activitesList.length > 0">
            <div v-for="(item, index) in activitesList" :key="index" class="showPrestaActiviteCard"
              :class="{ 'showPrestaActiviteCardSelected': selectedActivites.includes(item.id_activite) }"
              @click="toggleActivite(item.id_activite)">
              <label class="showPrestaCheckboxLabel">
                <span class="showPrestaCheckboxCustom">
                  <svg viewBox="0 0 10 8" fill="none">
                    <polyline points="1,4 4,7 9,1" stroke="#fff" stroke-width="1.8" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </span>
                <div class="showPrestaActiviteInfo">
                  <strong>{{ item.nom_activite }}</strong>
                  <span>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px">
                      <rect x="2" y="3" width="12" height="11" rx="2" />
                      <line x1="5" y1="1" x2="5" y2="5" />
                      <line x1="11" y1="1" x2="11" y2="5" />
                      <line x1="2" y1="7" x2="14" y2="7" />
                    </svg>
                    {{ item.date_activite }} à {{ item.heure_activite }}</span>
                  <span>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px">
                      <circle cx="8" cy="5" r="3" />
                      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    </svg>
                    {{ item.nb_participant }} participants max ·
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"
                      style="vertical-align:-2px;margin-right:4px;margin-left:4px">
                      <circle cx="8" cy="8" r="6" />
                      <path d="M8 5v3l2 2" />
                    </svg> {{ item.prix }} € / u</span>
                </div>
              </label>
            </div>

            <div class="showPrestaReserverFooter">
              <span class="showPrestaReserverCount" v-if="selectedActivites.length > 0">
                {{ selectedActivites.length }} sélectionnée{{ selectedActivites.length > 1 ? 's' : '' }}
              </span>
              <button class="presta-btn-reserver" :disabled="selectedActivites.length === 0"
                :class="{ 'presta-btn-reserver-disabled': selectedActivites.length === 0 }"
                @click="reserverActivitesSelectionnees">
                <div class="presta-btn-reserver-inner">
                  <div class="presta-btn-reserver-icon">
                    <svg viewBox="0 0 16 16">
                      <rect x="2" y="3" width="12" height="11" rx="2" />
                      <line x1="5" y1="1" x2="5" y2="5" />
                      <line x1="11" y1="1" x2="11" y2="5" />
                      <line x1="2" y1="7" x2="14" y2="7" />
                      <circle cx="8" cy="11" r="1.2" fill="#fff" stroke="none" />
                    </svg>
                  </div>
                  <div class="presta-btn-reserver-text">
                    <span class="presta-btn-reserver-label">{{ activitesList.length }} activité(s) disponible(s)</span>
                    <span class="presta-btn-reserver-main">Réserver la sélection</span>
                  </div>
                  <span class="presta-btn-reserver-arrow">→</span>
                </div>
              </button>
            </div>
          </div>
          <p v-else>Aucune activité disponible.</p>
        </div>
        <div v-else class="show-prestataire__items-list">
          <h3>Articles</h3>
          <div v-if="articlesList.length > 0">
            <div v-for="(item, index) in articlesList" :key="index" class="show-prestataire__service-card">
              <p><strong>{{ item.nom_article }}</strong></p>
              <p><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px">
                  <path d="M2 2h2l2.4 7h5.2l1.8-5H5" />
                  <circle cx="7" cy="13" r="1" />
                  <circle cx="12" cy="13" r="1" />
                </svg>Stock : {{ item.stock }}</p>
              <p><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M8 5v3l2 2" />
                </svg>{{ item.prix }} € / u</p>
            </div>
          </div>
          <p v-else>Aucun article disponible.</p>
        </div>
      </div>
    </template>
  </Modal>

  <div class="showPrestaBoutonRetour pointer" @click="goBack">
    &#8592; {{ $t("bouton.retour") }}
  </div>
  <div class="showPrestaMain">
    <br /><br />
    <div class="showPrestaTexte">
      <h1 class="showPrestaTitre">
        {{ $t("adminPage.prestataire.service.title") }}
      </h1>
      <p v-html="$t('adminPage.prestataire.service.descri', {
        nom_prestataire: onePresta.nom_prestataire,
      })
        " class="showPrestaCarte showPrestaSousTitre"></p>
    </div>

    <div class="showPrestaServiceRow showPrestaSectionPadding">
      <p class="showPrestaNbService showPrestaNbServiceValid" v-if="services.filter((p) => p.activate).length > 0">
        {{
          $t("adminPage.prestataire.service.nb_services", {
            count: services.filter((p) => p.activate).length,
            gotS: services.filter((p) => p.activate).length > 1 ? "s" : "",
          })
        }}
      </p>
      <p class="showPrestaNbService showPrestaNbServicePending" v-else>
        {{ $t("adminPage.prestataire.service.nb_servicesVide") }}
      </p>
      <div class="showPrestaFiltreResultat">
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
    <div class="show-prestataire__glass showPrestaNotificationValid" v-if="activate">
      <p v-html="$t('adminPage.prestataire.service.messageActiver', {
        nomService: desactivateService?.nom_service,
      })
        "></p>
      <span class="showPrestaNoticeClose" @click="closeMessageActivate">&times;</span>
    </div>

    <div class="show-prestataire__glass showPrestaNotificationRefus" v-else-if="desactivate">
      <p v-html="$t('adminPage.prestataire.service.messageDesactiver', {
        nomService: desactivateService?.nom_service,
      })
        "></p>
      <span class="showPrestaNoticeClose" @click="closeMessageDesactivate">&times;</span>
    </div>

    <div class="show-prestataire__glass showPrestaNotificationSuppr" v-else-if="deleting">
      <p v-html="$t('adminPage.prestataire.service.messageSuppr', {
        nomService: desactivateService?.nom_service,
      })
        "></p>
      <span class="showPrestaNoticeClose" @click="closeMessageSuppr">&times;</span>
    </div>

    <section>
      <div class="show-prestataire__layout">
        <div class="show-prestataire__card">
          <p class="show-prestataire__name">{{ onePresta.nom_prestataire }}</p>
          <!-- <img src=""> -->
          <div class="show-prestataire__description" v-html="onePresta.descri_prestataire"></div>
          <div class="show-prestataire__contact">
            <p class="show-prestataire__contact-title"><b>Contact</b></p>
            <p>{{ onePresta.mail_prestataire }}</p>
            <p>{{ onePresta.tel_prestataire }}</p>
          </div>
          <p>
            {{ onePresta.prenom_utilisateur }} {{ onePresta.nom_utilisateur }}
          </p>
        </div>
        <div>
          <div class="show-prestataire__services">
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
              <li v-for="(item, index) in servicesFiltres" :key="index" class="show-prestataire__service-item"
                style="padding-bottom: 10px">
                <div class="show-prestataire__service-row">
                  {{ item.nom_service }}
                  <span v-if="item.activate" class="show-prestataire__status-active" title="Actif">&#10003;</span>
                  <span v-else class="show-prestataire__status-inactive" title="Inactif">&#10007;</span>
                  <span class="show-prestataire__actions">
                    <button class="show-prestataire__btn-info" @click="
                      getValuesArticlesOrActivitesByIdService(
                        item.id_service,
                        isActivityService,
                      )
                      ">
                      Voir
                    </button>
                    <!-- Boutons d'activation/désactivation uniquement pour le propriétaire -->
                    <button class="show-prestataire__btn-activate" v-if="
                      !item.activate &&
                      userStore.isConnected &&
                      userStore.prestaId == idPresta
                    " @click="activateService(item)">
                      Activer
                    </button>
                    <button class="show-prestataire__btn-disable" v-else-if="
                      item.activate &&
                      userStore.isConnected &&
                      userStore.prestaId == idPresta
                    " @click="desactivatingService(item)">
                      Désactiver
                    </button>
                    <button class="show-prestataire__btn-delete" v-if="
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
      <button class="show-prestataire__edit-button" @click="goToEditPrestataire" v-if="
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
const selectedActivites = ref([]);

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
 * Récupère les informations du prèestataire ainsi que ses services associés.
 */
async function getValuesPrestataireById(id_presta) {
  try {
    const res = await prestataireStore.GetPrestataireByIdPrestataire(id_presta);
    console.log("prestataire:", JSON.stringify(res.data));
    onePresta.value = res.data.prestataire;
    isActivityService.value = res.data.prestataire.is_activity ?? false;

    const id_prestataire = res.data.prestataire.id_prestataire;
    console.log("id_prestataire utilisé:", id_prestataire);

    const resServices =
      await serviceStore.GetServiceByIdPrestataire(id_prestataire);
    console.log("services:", JSON.stringify(resServices.data));
    services.value = resServices.data.services;
  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}
async function getValuesArticlesOrActivitesByIdService(
  id_service,
  isActivityService,
) {
  showService.value = true;
  selectedActivites.value = [];
  try {
    let res = null;
    if (isActivityService) {
      res = await serviceStore.GetActiviteByIdService(id_service);
      activitesList.value = res.data.activites
        .filter((a) => a.nb_participant > 0)
        .map((a) => ({
          id_activite: a.id_activite,
          nom_activite: a.nom_activite,
          nb_participant: a.nb_participant,
          prix: a.prix_activite != null ? Number(a.prix_activite) : '—',
          date_activite: a.date_activite?.slice(0, 10),
          heure_activite: a.date_activite?.slice(11, 16),
        }));
    } else {
      res = await serviceStore.GetArticleByIdService(id_service);
      articlesList.value = res.data.articles
        .filter((a) => a.stock > 0)
        .map((a) => ({
          id_article: a.id_article,
          nom_article: a.nom_article,
          stock: a.stock,
          prix: a.prix_article != null ? Number(a.prix_article) : '—',
        }));
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

function toggleActivite(id) {
  const i = selectedActivites.value.indexOf(id)
  if (i === -1) selectedActivites.value.push(id)
  else selectedActivites.value.splice(i, 1)
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

    const index = services.value.findIndex(
      (s) => s.id_service === service.id_service,
    );
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
async function reserverActivitesSelectionnees() {
  if (!userStore.userId) {
    console.error("Utilisateur non connecté !");
    return;
  }

  try {
    for (const id_activite of selectedActivites.value) {
      await panierStore.AddToPanier(
        "activite",
        { id_activite },
        userStore.userId,
      );
    }

    selectedActivites.value = [];
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
/* ── Main ── */
.showPrestaMain {
  min-height: 100vh;
  padding: 32px 0 64px;
  background: var(--log-fond);
  color: var(--primary-dark);
  margin-top: -67px;
}

/* ── Retour ── */
.showPrestaBoutonRetour {
  margin: 22px 0 0 36px;
  width: fit-content;
  padding: 9px 18px;
  border-radius: 999px;
  background: rgba(90, 153, 102, 0.08);
  border: 1px solid rgba(90, 153, 102, 0.22);
  color: var(--primary-dark);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.showPrestaBoutonRetour:hover {
  transform: translateX(-3px);
  background: rgba(90, 153, 102, 0.15);
  border-color: var(--primary-light);
}

/* ── Bloc texte ── */
.showPrestaTexte {
  display: flex;
  flex-direction: column;
  padding: 0 36px;
}

.showPrestaTitre {
  margin: 20px 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  background: var(--log-gradient-cta);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.showPrestaCarte {
  border: 1px solid var(--log-border);
  background: var(--log-card-bg);
  border-radius: 20px;
}

.showPrestaSousTitre {
  margin: 0;
  padding: 18px 22px;
  color: #5a7a5e;
  line-height: 1.75;
  font-size: 0.97rem;
}

.showPrestaServiceRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 28px 36px 20px;
}

.showPrestaNbService {
  margin: 0;
  padding: 11px 18px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.9rem;
}

.showPrestaNbServiceValid {
  color: var(--primary-dark);
  background: rgba(90, 153, 102, 0.1);
  border: 1px solid rgba(90, 153, 102, 0.25);
}

.showPrestaNbServicePending {
  color: var(--rose-hover);
  background: rgba(232, 99, 122, 0.08);
  border: 1px solid rgba(232, 99, 122, 0.2);
}

.showPrestaFiltreResultat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 14px;
  background: var(--log-card-bg);
  border: 1px solid var(--log-border);
}

.showPrestaFiltreResultat label {
  color: #7a9a7e;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
}

.showPrestaFiltreResultat select {
  min-width: 160px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1.5px solid var(--log-border);
  background: #fff;
  color: var(--primary-dark);
  font-size: 0.88rem;
  outline: none;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.showPrestaFiltreResultat select:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(90, 153, 102, 0.12);
}

/* ── Notices ── */
.showPrestaNotificationValid,
.showPrestaNotificationRefus,
.showPrestaNotificationSuppr {
  margin: 0 36px 18px;
  padding: 14px 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  font-size: 0.92rem;
  line-height: 1.6;
}

.showPrestaNotificationValid {
  background: rgba(90, 153, 102, 0.08);
  border: 1px solid rgba(90, 153, 102, 0.22);
  color: var(--primary-dark);
}

.showPrestaNotificationRefus {
  background: rgba(232, 99, 122, 0.07);
  border: 1px solid rgba(232, 99, 122, 0.2);
  color: var(--rose-hover);
}

.showPrestaNotificationSuppr {
  background: rgba(255, 180, 0, 0.07);
  border: 1px solid rgba(255, 180, 0, 0.2);
  color: #b07800;
}

.showPrestaNoticeClose {
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  color: #aaa;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.showPrestaNoticeClose:hover {
  color: var(--rose-hover);
}

/* ── Layout ── */
.show-prestataire__layout {
  display: grid;
  grid-template-columns: minmax(280px, 400px) minmax(0, 1fr);
  gap: 24px;
  padding: 0 36px;
  align-items: start;
}

/* ── Cartes ── */
.show-prestataire__card,
.show-prestataire__services {
  background: var(--log-card-bg);
  border: 1.5px solid var(--log-border);
  border-radius: 22px;
  box-shadow:
    0 8px 30px rgba(58, 111, 67, 0.08),
    0 2px 8px rgba(232, 99, 122, 0.05);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.show-prestataire__card:hover,
.show-prestataire__services:hover {
  border-color: var(--primary-very-light);
  box-shadow:
    0 12px 36px rgba(58, 111, 67, 0.13),
    0 2px 10px rgba(232, 99, 122, 0.07);
}

.show-prestataire__card {
  padding: 26px;
}

.show-prestataire__name {
  margin: 0 0 4px;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--primary-dark);
}

.show-prestataire__description {
  margin: 16px 0;
  color: #5a7a5e;
  line-height: 1.75;
  font-size: 0.95rem;
}

.show-prestataire__contact {
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(90, 153, 102, 0.05);
  border: 1px solid rgba(90, 153, 102, 0.15);
}

.show-prestataire__contact-title {
  margin: 0 0 8px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #7a9a7e;
}

.show-prestataire__contact p {
  margin: 4px 0;
  color: var(--primary-dark);
  font-size: 0.92rem;
}

.show-prestataire__card>p:last-child {
  margin: 16px 0 0;
  color: #9ab09e;
  font-size: 0.88rem;
}

/* ── Services ── */
.show-prestataire__services {
  padding: 24px;
}

.show-prestataire__services>p {
  margin: 0 0 16px;
  font-size: 0.82rem;
  color: #7a9a7e;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
}

.show-prestataire__services ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.show-prestataire__service-item {
  padding: 0 !important;
}

.show-prestataire__service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff;
  border: 1.5px solid var(--log-border);
  font-size: 0.93rem;
  font-weight: 600;
  color: var(--primary-dark);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.show-prestataire__service-row:hover {
  background: rgba(90, 153, 102, 0.04);
  border-color: var(--primary-very-light);
  box-shadow: 0 3px 10px rgba(58, 111, 67, 0.08);
}

.show-prestataire__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* ── Statuts ── */
.show-prestataire__status-active {
  color: var(--primary-light);
  font-weight: 700;
  font-size: 1.05rem;
}

.show-prestataire__status-inactive {
  color: var(--rose);
  font-weight: 700;
  font-size: 1.05rem;
}

/* ── Boutons ── */
.show-prestataire__btn-info,
.show-prestataire__btn-activate,
.show-prestataire__btn-disable,
.show-prestataire__btn-delete,
.show-prestataire__edit-button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.2px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.show-prestataire__btn-info {
  background: var(--log-gradient-cta);
  color: #fff;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.22);
}

.show-prestataire__btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(58, 111, 67, 0.32);
  filter: brightness(1.06);
}

.show-prestataire__btn-activate {
  background: rgba(90, 153, 102, 0.1);
  color: var(--primary-dark);
  border: 1.5px solid rgba(90, 153, 102, 0.3);
}

.show-prestataire__btn-activate:hover {
  transform: translateY(-1px);
  background: rgba(90, 153, 102, 0.18);
}

.show-prestataire__btn-disable {
  background: rgba(232, 99, 122, 0.09);
  color: var(--rose-hover);
  border: 1.5px solid rgba(232, 99, 122, 0.25);
}

.show-prestataire__btn-disable:hover {
  transform: translateY(-1px);
  background: rgba(232, 99, 122, 0.16);
}

.show-prestataire__btn-delete {
  background: rgba(232, 99, 122, 0.06);
  color: var(--rose);
  border: 1.5px solid rgba(232, 99, 122, 0.18);
}

.show-prestataire__btn-delete:hover {
  transform: translateY(-1px);
  background: rgba(232, 99, 122, 0.14);
}

/* ── Bouton modifier profil ── */
.show-prestataire__edit-button {
  display: block;
  margin: 32px auto 0;
  padding: 13px 36px;
  font-size: 0.95rem;
  background: var(--log-gradient-cta);
  color: #fff;
  box-shadow: 0 6px 20px rgba(58, 111, 67, 0.25);
}

.show-prestataire__edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(58, 111, 67, 0.35);
  filter: brightness(1.06);
}

/* ── Modal items ── */
.showPrestaServiceDetail {
  padding: 4px 2px;
}

.show-prestataire__items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.show-prestataire__items-list h3 {
  margin: 0 0 8px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.show-prestataire__service-card {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(90, 153, 102, 0.05);
  border: 1.5px solid rgba(90, 153, 102, 0.15);
}

.show-prestataire__service-card p {
  margin: 5px 0;
  color: #5a7a5e;
  font-size: 0.92rem;
}

.show-prestataire__service-card strong {
  color: var(--primary-dark);
  font-size: 1rem;
}

/* ── Section padding ── */
.showPrestaSectionPadding {
  padding-left: 36px;
  padding-right: 36px;
}

/* ── Bouton réserver ── */
.presta-btn-reserver {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin-top: 20px;
  border: none;
  border-radius: 14px;
  background: none;
  cursor: pointer;
  outline: none;
  overflow: hidden;
}

.presta-btn-reserver-inner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px 12px 14px;
  border-radius: 14px;
  background: var(--primary-light);
  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.presta-btn-reserver:hover .presta-btn-reserver-inner {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.presta-btn-reserver:active .presta-btn-reserver-inner {
  transform: scale(0.97) translateY(0);
}

.presta-btn-reserver-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.18s ease;
}

.presta-btn-reserver:hover .presta-btn-reserver-icon {
  background: rgba(255, 255, 255, 0.25);
}

.presta-btn-reserver-icon svg {
  width: 16px;
  height: 16px;
  stroke: #fff;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.presta-btn-reserver-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.presta-btn-reserver-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 0.1px;
}

.presta-btn-reserver-main {
  font-size: 0.92rem;
  color: #fff;
  font-weight: 700;
}

.presta-btn-reserver-arrow {
  margin-left: 4px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.18s ease;
}

.presta-btn-reserver:hover .presta-btn-reserver-arrow {
  transform: translateX(3px);
}

/* ── Carte activité sélectionnable ── */
.showPrestaActiviteCard {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(90, 153, 102, 0.05);
  border: 1.5px solid rgba(90, 153, 102, 0.15);
  margin-bottom: 10px;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}

.showPrestaActiviteCard:hover {
  background: rgba(90, 153, 102, 0.09);
  border-color: var(--primary-light);
}

.showPrestaActiviteCardSelected {
  background: rgba(90, 153, 102, 0.12);
  border-color: var(--primary-light);
}

/* ── Label checkbox ── */
.showPrestaCheckboxLabel {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  width: 100%;
}

/* ── Input natif caché ── */
.showPrestaCheckboxInput {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ── Checkbox custom ── */
.showPrestaCheckboxCustom {
  flex-shrink: 0;
  margin-top: 2px;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid rgba(90, 153, 102, 0.4);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.showPrestaCheckboxCustom svg {
  width: 10px;
  height: 8px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.showPrestaActiviteCardSelected .showPrestaCheckboxCustom {
  background: var(--primary-light);
  border-color: var(--primary-light);
}

.showPrestaActiviteCardSelected .showPrestaCheckboxCustom svg {
  opacity: 1;
}

/* ── Infos activité ── */
.showPrestaActiviteInfo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.showPrestaActiviteInfo strong {
  color: var(--primary-dark);
  font-size: 0.95rem;
}

.showPrestaActiviteInfo span {
  color: #5a7a5e;
  font-size: 0.85rem;
}

/* ── Footer réserver ── */
.showPrestaReserverFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.showPrestaReserverCount {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-dark);
  background: rgba(90, 153, 102, 0.1);
  border: 1px solid rgba(90, 153, 102, 0.25);
  padding: 6px 14px;
  border-radius: 999px;
}

/* ── État désactivé du bouton ── */
.presta-btn-reserver-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .show-prestataire__layout {
    grid-template-columns: 1fr;
  }

  .showPrestaServiceRow {
    flex-direction: column;
    align-items: stretch;
  }

  .showPrestaFiltreResultat {
    justify-content: space-between;
  }
}

@media (max-width: 750px) {
  .showPrestaMain {
    padding-top: 18px;
  }

  .showPrestaBoutonRetour,
  .showPrestaTexte,
  .showPrestaSectionPadding,
  .show-prestataire__layout,
  .showPrestaNotificationValid,
  .showPrestaNotificationRefus,
  .showPrestaNotificationSuppr {
    margin-left: 16px;
    margin-right: 16px;
    padding-left: 0;
    padding-right: 0;
  }

  .show-prestataire__card,
  .show-prestataire__services {
    padding: 18px;
  }

  .show-prestataire__service-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .show-prestataire__actions {
    justify-content: flex-start;
  }
}
</style>
