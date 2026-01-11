<template>
  <NavView />
  <div class="modal-backdrop" v-if="showService">
    <div class="modal-content bigger">
      <span class="modal-close" @click="closeModal">&times;</span>
      <div class="bloc_texte service_details">
        <h1 class="page_title" v-html="titre_service"></h1>

        <p class="service_description" v-html="descri_service"></p>

        <div class="service_besoin" v-if="!oneService.visible_public">
          <h3>Besoin</h3>
          <p v-html="besoin_service"></p>
        </div>

        <div class="service_infos">
          <div class="info_item">
            <span class="info_label">Prix</span>
            <span class="info_value">{{ oneService.prix }} €</span>
          </div>

          <div class="info_item">
            <span class="info_label">Participants max</span>
            <span class="info_value">{{ oneService.nb_participants }}</span>
          </div>
        </div>
        <button @click="addService(oneService)">S'inscrire</button>
      </div>
    </div>
  </div>
  <div class="back-arrow pointer" @click="goBack">&#8592; Retour</div>
  <div class="main_container">
    <div class="bloc_texte">
      <h1 class="page_title">
        {{ $t("adminPage.prestataire.service.title") }}
      </h1>
      <p
        v-html="
          $t('adminPage.prestataire.service.descri', {
            nom_prestataire: onePresta.nom_prestataire,
          })
        "
        class="backgroundBorderL page_subtitle"></p>
    </div>

    <div class="textAndFiltre paddingSides">
      <p
        class="nb_presta valid"
        v-if="services.filter((p) => p.activate).length > 0">
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
      <p
        v-html="
          $t('adminPage.prestataire.service.messageActiver', {
            nomService: desactivateService?.nom_service,
          })
        "></p>
      <span class="modal-close" @click="closeMessageActivate">&times;</span>
    </div>

    <div class="backgroundBorderL message refus" v-else-if="desactivate">
      <p
        v-html="
          $t('adminPage.prestataire.service.messageDesactiver', {
            nomService: desactivateService?.nom_service,
          })
        "></p>
      <span class="modal-close" @click="closeMessageDesactivate">&times;</span>
    </div>

    <div class="backgroundBorderL message suppr" v-else-if="deleting">
      <p
        v-html="
          $t('adminPage.prestataire.service.messageSuppr', {
            nomService: desactivateService?.nom_service,
          })
        "></p>
      <span class="modal-close" @click="closeMessageSuppr">&times;</span>
    </div>

    <section>
      <div class="container">
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
              <li
                v-for="(item, index) in servicesFiltres"
                :key="index"
                class="service_item"
                style="padding-bottom: 10px">
                <div class="serviceWithButtons">
                  {{ item.nom_service }}
                  <span v-if="item.activate" class="active-icon" title="Actif"
                    >&#10003;</span
                  >
                  <span v-else class="inactive-icon" title="Inactif"
                    >&#10007;</span
                  >
                  <span class="diff_button">
                    <button class="btn_info" @click="getOneService(item)">
                      Voir
                    </button>
                    <button
                      class="btn_activate"
                      v-if="
                        !item.activate &&
                        userStore.isConnected &&
                        userStore.prestaId == idPresta
                      "
                      @click="activateService(item)">
                      Activer
                    </button>
                    <button
                      class="btn_desactivate"
                      v-else-if="
                        item.activate &&
                        userStore.isConnected &&
                        userStore.prestaId == idPresta
                      "
                      @click="desactivatingService(item)">
                      Désactiver
                    </button>
                    <button
                      class="btn_supprimer"
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
import { onMounted, ref, computed, watch } from "vue";
// import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useNavigationStore } from "@/stores/navigation";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import PrestataireData from "../../backend/database/jsonData/Prestataire.json";
import UtilisateurData from "../../backend/database/jsonData/Utilisateur.json";
import ServicesData from "../../backend/database/jsonData/Services.json";
import localData from "../../backend/database/localData.js";

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const navStore = useNavigationStore();
const adminStore = useAdminStore();
const userStore = useUserStore();

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

const titre_service = ref("");
const descri_service = ref("");
const besoin_service = ref("");

const closeModal = () => {
  showService.value = false;
};

const closeMessageActivate = () => {
  activate.value = false;
};

const closeMessageDesactivate = () => {
  desactivate.value = false;
};

const closeMessageSuppr = () => {
  deleting.value = false;
};

const onePresta = ref({
  nom_prestataire: "",
  descri_prestataire: "",
  mail_prestataire: "",
  tel_prestataire: "",
  prenom_utilisateur: "",
  nom_utilisateur: "",
});

const services = ref([]);
const idPresta = route.params.id;

watch(
  () => locale.value,
  (newLang) => {
    updateDescription();
  }
);

onMounted(() => {
  getValuesPrestataire(idPresta);
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

function goBack() {
  if (navStore.previousRoute) {
    router.push(navStore.previousRoute);
  }
}

function goToEditPrestataire() {
  router.push({
    name: "EditPrestataire",
    params: { id: idPresta },
  });
}

//==========================
//= Async functions presta =
//==========================
// async function getValuesPrestataire() {
//   try {
//     const res = await axios.get(`http://localhost:3000/prestataire/show/${idPresta}`);
//     onePresta.value = res.data.prestataire;

//     services.value = res.data.services;

//   } catch (err) {
//     console.error("Erreur lors de la récupération des données :", err);
//   }
// }

function getValuesPrestataire() {
  console.log("idPresta:", idPresta, "Type:", typeof idPresta);

  // Récupérer depuis localStorage
  const prestatairesLocalStorage = localData.getAll("prestataires");
  const utilisateursLocalStorage = localData.getAll("utilisateurs");
  const servicesLocalStorage = localData.getAll("services");

  // Fusionner prestataires JSON + localStorage (priorité au localStorage)
  const localStoragePrestaIds = prestatairesLocalStorage.map(
    (p) => p.id_prestataire
  );
  const prestatairesJSONFiltered = PrestataireData.filter(
    (p) => !localStoragePrestaIds.includes(p.id_prestataire)
  );
  const allPrestataires = [
    ...prestatairesJSONFiltered,
    ...prestatairesLocalStorage,
  ];

  // Fusionner utilisateurs JSON + localStorage
  const localStorageUserIds = utilisateursLocalStorage.map(
    (u) => u.id_utilisateur
  );
  const utilisateursJSONFiltered = UtilisateurData.filter(
    (u) => !localStorageUserIds.includes(u.id_utilisateur)
  );
  const allUtilisateurs = [
    ...utilisateursJSONFiltered,
    ...utilisateursLocalStorage,
  ];

  // Fusionner services JSON + localStorage
  const localStorageServiceIds = servicesLocalStorage.map((s) => s.id_service);
  const servicesJSONFiltered = ServicesData.filter(
    (s) => !localStorageServiceIds.includes(s.id_service)
  );
  const allServices = [...servicesJSONFiltered, ...servicesLocalStorage];

  // Trouver le prestataire
  const presta = allPrestataires.find(
    (p) => p.id_prestataire === Number(idPresta)
  );
  if (presta) {
    const utilisateur = allUtilisateurs.find(
      (u) => u.id_utilisateur === presta.id_utilisateur
    );
    onePresta.value = {
      ...presta,
      nom_utilisateur: utilisateur?.nom_utilisateur || "",
      prenom_utilisateur: utilisateur?.prenom_utilisateur || "",
    };
  }

  // Filtrer et normaliser les services pour ce prestataire
  const filtered = allServices
    .filter((s) => {
      return (
        s.prestataire_id === Number(idPresta) ||
        s.id_prestataire === Number(idPresta)
      );
    })
    .map((s) => {
      // Normaliser la structure pour que tous les services aient les mêmes propriétés
      return {
        id_service: s.id_service,
        nom_service: s.nom_service,
        titre_service: s.titre_service,
        descri_service: s.descri_service,
        besoin: s.besoin,
        prix: s.prix || s.prix_service,
        nb_participants: s.nb_participants || s.nbParticipants_service,
        activate: s.activate !== undefined ? s.activate : true,
        prestataire_id: s.prestataire_id || s.id_prestataire,
        visible_public:
          s.visible_public !== undefined ? s.visible_public : true,
      };
    });

  console.log("Services filtrés:", filtered.length);
  services.value = filtered;
}

function desactivatingService(service) {
  desactivate.value = true;
  actionsService(service);
}

function activateService(service) {
  activate.value = true;
  actionsService(service);
}

// async function actionsService(service) {
//   try {
//     desactivateService.value = service;

//     const res = await axios.patch(`http://localhost:3000/prestataire/activateService/${service.id_service}`);

//     const index = services.value.findIndex(s => s.id_service === service.id_service);
//     if (index !== -1) {
//       services.value[index].activate = !services.value[index].activate;
//     }

//   } catch (err) {
//     console.error("Erreur lors de la récupération des données :", err);
//   }
// }

function actionsService(service) {
  desactivateService.value = service;
  const index = services.value.findIndex(
    (s) => s.id_service === service.id_service
  );
  if (index !== -1) {
    services.value[index].activate = !services.value[index].activate;

    // Mettre à jour dans localStorage si le service y existe
    const serviceToUpdate = { ...services.value[index] };
    localData.update("services", service.id_service, serviceToUpdate);
  }
}

// async function getOneService(service) {
//   showService.value = true;
//   try {
//     const res = await axios.get(`http://localhost:3000/prestataire/service/show/${service.id_service}`)
//     oneService.value = res.data;
//     console.log("Res.data" ,res.data);

//     console.log(oneService)

//     updateDescription();

//   } catch (err) {
//     console.error(err);
//   }
// }

function getOneService(service) {
  showService.value = true;

  // Chercher dans localStorage d'abord, puis dans JSON
  const servicesLocalStorage = localData.getAll("services");
  let serviceData = servicesLocalStorage.find(
    (s) => s.id_service === service.id_service
  );

  if (!serviceData) {
    serviceData = ServicesData.find((s) => s.id_service === service.id_service);
  }

  if (serviceData) {
    oneService.value = serviceData;
  }
  updateDescription();
}

// async function addService(service) {
//   if (!userStore.userId) {
//     console.error("Utilisateur non connecté !");
//     return;
//   }

//   try {
//     const res = await axios.post(`http://localhost:3000/panier/addService`, {
//       id_user: userStore.userId,
//       service_id: service.id_service,
//       quantite: 1
//     });

//     showService.value = false;
//   } catch (err) {
//     console.error("Erreur lors de l'ajout au panier :", err);
//   }
// }

function addService(service) {
  if (!userStore.userId) {
    console.error("Utilisateur non connecté !");
    return;
  }

  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const existingItem = panier.find(
    (item) =>
      item.service_id === service.id_service &&
      item.id_user === userStore.userId
  );

  if (existingItem) {
    existingItem.quantite += 1;
  } else {
    panier.push({
      id_user: userStore.userId,
      service_id: service.id_service,
      quantite: 1,
    });
  }

  localStorage.setItem("panier", JSON.stringify(panier));
  showService.value = false;
}

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
.bigger {
  max-width: 900px;
}

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

.container {
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
