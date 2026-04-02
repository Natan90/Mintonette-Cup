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
.show-prestataire__main {
  min-height: 100vh;
  padding: 32px 0 48px;
  background:
    radial-gradient(
      circle at top left,
      rgba(232, 80, 130, 0.14),
      transparent 28%
    ),
    linear-gradient(to bottom, #0f0f12 0%, #15151a 48%, #101014 100%);
  color: #f5f5f5;
  margin-top: -67px;
}

.show-prestataire__back {
  margin: 18px 0 0 32px;
  width: fit-content;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.78);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.show-prestataire__back:hover {
  transform: translateX(-2px);
  border-color: rgba(232, 80, 130, 0.28);
  background: rgba(255, 255, 255, 0.1);
}

.show-prestataire__block-text {
  display: flex;
  flex-direction: column;
  padding: 0 32px;
}

.show-prestataire__title {
  margin: 16px 0 10px;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #f8f8f8;
}

.show-prestataire__subtitle,
.show-prestataire__notice,
.show-prestataire__counter,
.show-prestataire__services,
.show-prestataire__card,
.show-prestataire__items-list,
.show-prestataire__service-card {
  box-sizing: border-box;
}

.show-prestataire__glass {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border-radius: 18px;
}

.show-prestataire__subtitle {
  margin: 0;
  padding: 18px 20px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
}

.show-prestataire__filter-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin: 24px 32px 18px;
}

.show-prestataire__counter {
  margin: 0;
  padding: 12px 16px;
  border-radius: 14px;
  font-weight: 700;
}

.show-prestataire__counter--valid {
  color: #fff;
  background: rgba(90, 153, 102, 0.14);
  border: 1px solid rgba(90, 153, 102, 0.28);
}

.show-prestataire__counter--pending {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(232, 80, 130, 0.12);
  border: 1px solid rgba(232, 80, 130, 0.22);
}

.show-prestataire__sort-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.show-prestataire__sort-filter label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-weight: 600;
}

.show-prestataire__sort-filter select {
  min-width: 170px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(14, 14, 18, 0.92);
  color: #f5f5f5;
  outline: none;
}

.show-prestataire__sort-filter select:focus {
  border-color: rgba(232, 80, 130, 0.35);
}

.show-prestataire__notice {
  margin: 0 32px 16px;
  padding: 14px 18px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.show-prestataire__notice--valid {
  background: rgba(90, 153, 102, 0.12);
  border: 1px solid rgba(90, 153, 102, 0.22);
}

.show-prestataire__notice--refus {
  background: rgba(232, 80, 130, 0.1);
  border: 1px solid rgba(232, 80, 130, 0.18);
}

.show-prestataire__notice--suppr {
  background: rgba(255, 180, 0, 0.1);
  border: 1px solid rgba(255, 180, 0, 0.18);
}

.show-prestataire__notice-close {
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.72);
}

.show-prestataire__layout {
  display: grid;
  grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
  gap: 28px;
  padding: 0 32px;
  align-items: start;
}

.show-prestataire__card,
.show-prestataire__services {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
}

.show-prestataire__card {
  padding: 24px;
}

.show-prestataire__name {
  margin: 0 0 16px;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #f8f8f8;
}

.show-prestataire__description {
  margin: 18px 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
}

.show-prestataire__contact {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.show-prestataire__contact-title {
  margin: 0 0 8px;
}

.show-prestataire__card > p:last-child {
  margin: 16px 0 0;
  color: rgba(255, 255, 255, 0.68);
}

.show-prestataire__services {
  padding: 22px;
}

.show-prestataire__services > p {
  margin: 0 0 18px;
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.78);
}

.show-prestataire__services ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.show-prestataire__service-item {
  padding: 0 !important;
}

.show-prestataire__service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.show-prestataire__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.show-prestataire__btn-info,
.show-prestataire__btn-activate,
.show-prestataire__btn-disable,
.show-prestataire__btn-delete,
.show-prestataire__edit-button {
  border: none;
  border-radius: 999px;
  padding: 9px 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.show-prestataire__btn-info,
.show-prestataire__edit-button {
  background: linear-gradient(90deg, var(--primary-color), var(--rose));
  color: #fff;
  box-shadow: 0 10px 22px rgba(58, 111, 67, 0.24);
}

.show-prestataire__btn-activate {
  background: rgba(90, 153, 102, 0.16);
  color: #2a5232;
  border: 1px solid rgba(90, 153, 102, 0.28);
}

.show-prestataire__btn-disable {
  background: rgba(232, 80, 130, 0.16);
  color: #8c2f4f;
  border: 1px solid rgba(232, 80, 130, 0.26);
}

.show-prestataire__btn-delete {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.show-prestataire__btn-info:hover,
.show-prestataire__btn-activate:hover,
.show-prestataire__btn-disable:hover,
.show-prestataire__btn-delete:hover,
.show-prestataire__edit-button:hover {
  transform: translateY(-1px);
}

.show-prestataire__btn-info:hover,
.show-prestataire__edit-button:hover {
  box-shadow: 0 14px 28px rgba(58, 111, 67, 0.32);
}

.show-prestataire__items-list {
  display: grid;
  gap: 14px;
  padding: 6px 2px 2px;
}

.show-prestataire__items-list h3 {
  margin: 0 0 12px;
  font-size: 1.3rem;
}

.show-prestataire__service-card {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.show-prestataire__service-card p {
  margin: 6px 0;
  color: rgba(255, 255, 255, 0.76);
}

.show-prestataire__service-card strong {
  color: #f8f8f8;
}

.show-prestataire__status-active {
  color: #7ed38d;
  font-weight: 700;
  margin-left: 4px;
}

.show-prestataire__status-inactive {
  color: #ff8b8b;
  font-weight: 700;
  margin-left: 4px;
}

.show-prestataire__section-padding {
  padding-left: 32px;
  padding-right: 32px;
}

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
    align-items: flex-start;
    flex-direction: column;
  }

  .show-prestataire__actions {
    justify-content: flex-start;
  }
}
</style>
