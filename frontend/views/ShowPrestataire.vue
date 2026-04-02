<template>
  <NavView />
  <Modal v-model="showService" :bigger="true">
    <template #content>
      <div
        class="show-prestataire__block-text show-prestataire__service-details">
        <div v-if="isActivityService" class="show-prestataire__items-list">
          <h3>Activités</h3>
          <div v-if="activitesList.length > 0">
            <div
              v-for="(item, index) in activitesList"
              :key="index"
              class="show-prestataire__service-card">
              <p>
                <strong>{{ item.nom_activite }}</strong>
              </p>
              <p>
                📅 {{ item.date_activite?.slice(0, 10) }} à
                {{ item.date_activite?.slice(11, 16) }}
              </p>
              <p>👥 {{ item.nb_participant }} participants max</p>
              <p>💰 {{ item.prix }} € / u</p>
            </div>
            <button>Réserver une activité</button>
          </div>
          <p v-else>Aucune activité disponible.</p>
        </div>

        <!-- Articles -->
        <div v-else class="show-prestataire__items-list">
          <h3>Articles</h3>
          <div v-if="articlesList.length > 0">
            <div
              v-for="(item, index) in articlesList"
              :key="index"
              class="show-prestataire__service-card">
              <p>
                <strong>{{ item.nom_article }}</strong>
              </p>
              <p>📦 Stock : {{ item.stock }}</p>
              <p>💰 {{ item.prix }} € / u</p>
            </div>
          </div>
          <p v-else>Aucun article disponible.</p>
        </div>
      </div>
    </template>
  </Modal>

  <div class="show-prestataire__back pointer" @click="goBack">
    &#8592; {{ $t("bouton.retour") }}
  </div>
  <div class="show-prestataire__main">
    <br /><br />
    <div class="show-prestataire__block-text">
      <h1 class="show-prestataire__title">
        {{ $t("adminPage.prestataire.service.title") }}
      </h1>
      <p
        v-html="
          $t('adminPage.prestataire.service.descri', {
            nom_prestataire: onePresta.nom_prestataire,
          })
        "
        class="show-prestataire__glass show-prestataire__subtitle"></p>
    </div>

    <div class="show-prestataire__filter-row show-prestataire__section-padding">
      <p
        class="show-prestataire__counter show-prestataire__counter--valid"
        v-if="services.filter((p) => p.activate).length > 0">
        {{
          $t("adminPage.prestataire.service.nb_services", {
            count: services.filter((p) => p.activate).length,
            gotS: services.filter((p) => p.activate).length > 1 ? "s" : "",
          })
        }}
      </p>
      <p
        class="show-prestataire__counter show-prestataire__counter--pending"
        v-else>
        {{ $t("adminPage.prestataire.service.nb_servicesVide") }}
      </p>
      <div class="show-prestataire__sort-filter">
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
    <div
      class="show-prestataire__glass show-prestataire__notice show-prestataire__notice--valid"
      v-if="activate">
      <p
        v-html="
          $t('adminPage.prestataire.service.messageActiver', {
            nomService: desactivateService?.nom_service,
          })
        "></p>
      <span class="show-prestataire__notice-close" @click="closeMessageActivate"
        >&times;</span
      >
    </div>

    <div
      class="show-prestataire__glass show-prestataire__notice show-prestataire__notice--refus"
      v-else-if="desactivate">
      <p
        v-html="
          $t('adminPage.prestataire.service.messageDesactiver', {
            nomService: desactivateService?.nom_service,
          })
        "></p>
      <span
        class="show-prestataire__notice-close"
        @click="closeMessageDesactivate"
        >&times;</span
      >
    </div>

    <div
      class="show-prestataire__glass show-prestataire__notice show-prestataire__notice--suppr"
      v-else-if="deleting">
      <p
        v-html="
          $t('adminPage.prestataire.service.messageSuppr', {
            nomService: desactivateService?.nom_service,
          })
        "></p>
      <span class="show-prestataire__notice-close" @click="closeMessageSuppr"
        >&times;</span
      >
    </div>

    <section>
      <div class="show-prestataire__layout">
        <div class="show-prestataire__card">
          <p class="show-prestataire__name">{{ onePresta.nom_prestataire }}</p>
          <!-- <img src=""> -->
          <div
            class="show-prestataire__description"
            v-html="onePresta.descri_prestataire"></div>
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
              <li
                v-for="(item, index) in servicesFiltres"
                :key="index"
                class="show-prestataire__service-item"
                style="padding-bottom: 10px">
                <div class="show-prestataire__service-row">
                  {{ item.nom_service }}
                  <span
                    v-if="item.activate"
                    class="show-prestataire__status-active"
                    title="Actif"
                    >&#10003;</span
                  >
                  <span
                    v-else
                    class="show-prestataire__status-inactive"
                    title="Inactif"
                    >&#10007;</span
                  >
                  <span class="show-prestataire__actions">
                    <button
                      class="show-prestataire__btn-info"
                      @click="
                        getValuesArticlesOrActivitesByIdService(
                          item.id_service,
                          isActivityService,
                        )
                      ">
                      Voir
                    </button>
                    <!-- Boutons d'activation/désactivation uniquement pour le propriétaire -->
                    <button
                      class="show-prestataire__btn-activate"
                      v-if="
                        !item.activate &&
                        userStore.isConnected &&
                        userStore.prestaId == idPresta
                      "
                      @click="activateService(item)">
                      Activer
                    </button>
                    <button
                      class="show-prestataire__btn-disable"
                      v-else-if="
                        item.activate &&
                        userStore.isConnected &&
                        userStore.prestaId == idPresta
                      "
                      @click="desactivatingService(item)">
                      Désactiver
                    </button>
                    <button
                      class="show-prestataire__btn-delete"
                      v-if="
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
      <button
        class="show-prestataire__edit-button"
        @click="goToEditPrestataire"
        v-if="
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
  try {
    let res = null;
    if (isActivityService) {
      res = await serviceStore.GetActiviteByIdService(id_service);
      console.log(res.data.activites);
      activitesList.value = res.data.activites.map((a) => ({
        id_activite: a.id_activite,
        nom_activite: a.nom_activite,
        nb_participant: a.nb_participant,
        prix: Number(a.prix_activite),
        date_activite: a.date_activite?.slice(0, 10),
        heure_activite: a.date_activite?.slice(11, 16),
      }));
    } else {
      res = await serviceStore.GetArticleByIdService(id_service);
      console.log(res.data.articles);
      articlesList.value = res.data.articles.map((a) => ({
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
async function addService(service) {
  if (!userStore.userId) {
    console.error("Utilisateur non connecté !");
    return;
  }

  try {
    const res = await panierStore.AddToPanier(
      "service",
      service,
      userStore.userId,
    );

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
.show-prestataire__main {
  min-height: 100vh;
  padding: 32px 0 64px;
  background: var(--log-fond);
  color: var(--primary-dark);
  margin-top: -67px;
}

/* ── Retour ── */
.show-prestataire__back {
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
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.show-prestataire__back:hover {
  transform: translateX(-3px);
  background: rgba(90, 153, 102, 0.15);
  border-color: var(--primary-light);
}

/* ── Bloc texte ── */
.show-prestataire__block-text {
  display: flex;
  flex-direction: column;
  padding: 0 36px;
}

.show-prestataire__title {
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

/* ── Glass utilitaire ── */
.show-prestataire__glass {
  border: 1px solid var(--log-border);
  background: var(--log-card-bg);
  border-radius: 20px;
}

.show-prestataire__subtitle {
  margin: 0;
  padding: 18px 22px;
  color: #5a7a5e;
  line-height: 1.75;
  font-size: 0.97rem;
}

/* ── Filtre / tri ── */
.show-prestataire__filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 28px 36px 20px;
}

.show-prestataire__counter {
  margin: 0;
  padding: 11px 18px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.9rem;
}

.show-prestataire__counter--valid {
  color: var(--primary-dark);
  background: rgba(90, 153, 102, 0.1);
  border: 1px solid rgba(90, 153, 102, 0.25);
}

.show-prestataire__counter--pending {
  color: var(--rose-hover);
  background: rgba(232, 99, 122, 0.08);
  border: 1px solid rgba(232, 99, 122, 0.2);
}

.show-prestataire__sort-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 14px;
  background: var(--log-card-bg);
  border: 1px solid var(--log-border);
}

.show-prestataire__sort-filter label {
  color: #7a9a7e;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
}

.show-prestataire__sort-filter select {
  min-width: 160px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1.5px solid var(--log-border);
  background: #fff;
  color: var(--primary-dark);
  font-size: 0.88rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.show-prestataire__sort-filter select:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(90, 153, 102, 0.12);
}

/* ── Notices ── */
.show-prestataire__notice {
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

.show-prestataire__notice--valid {
  background: rgba(90, 153, 102, 0.08);
  border: 1px solid rgba(90, 153, 102, 0.22);
  color: var(--primary-dark);
}

.show-prestataire__notice--refus {
  background: rgba(232, 99, 122, 0.07);
  border: 1px solid rgba(232, 99, 122, 0.2);
  color: var(--rose-hover);
}

.show-prestataire__notice--suppr {
  background: rgba(255, 180, 0, 0.07);
  border: 1px solid rgba(255, 180, 0, 0.2);
  color: #b07800;
}

.show-prestataire__notice-close {
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  color: #aaa;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.show-prestataire__notice-close:hover {
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
  box-shadow: 0 8px 30px rgba(58, 111, 67, 0.08), 0 2px 8px rgba(232, 99, 122, 0.05);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.show-prestataire__card:hover,
.show-prestataire__services:hover {
  border-color: var(--primary-very-light);
  box-shadow: 0 12px 36px rgba(58, 111, 67, 0.13), 0 2px 10px rgba(232, 99, 122, 0.07);
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

.show-prestataire__card > p:last-child {
  margin: 16px 0 0;
  color: #9ab09e;
  font-size: 0.88rem;
}

/* ── Services ── */
.show-prestataire__services {
  padding: 24px;
}

.show-prestataire__services > p {
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
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
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
.show-prestataire__service-details {
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
.show-prestataire__section-padding {
  padding-left: 36px;
  padding-right: 36px;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .show-prestataire__layout {
    grid-template-columns: 1fr;
  }

  .show-prestataire__filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .show-prestataire__sort-filter {
    justify-content: space-between;
  }
}

@media (max-width: 750px) {
  .show-prestataire__main {
    padding-top: 18px;
  }

  .show-prestataire__back,
  .show-prestataire__block-text,
  .show-prestataire__filter-row,
  .show-prestataire__layout,
  .show-prestataire__notice {
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