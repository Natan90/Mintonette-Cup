<template>
  <!-- Barre de navigation principale -->
  <NavView id="nav_bar"></NavView>
  <div class="modal-backdrop" v-if="showService">
    <div class="modal-content bigger">
      <span class="modal-close" @click="closeModal">&times;</span>
      <div class="service_details">
        <span>
          <button @click="changeDescriLang">
            <span v-if="isFrench">Passer en anglais</span>
            <span v-else>Go in French</span>
          </button>
        </span>
        <div>
          <label for="nom_service">Nom du service</label>
          <input
            class="page_title"
            v-model="oneService.nom_service"
            id="nom_service" />
        </div>
        <div>
          <label for="titre_service">Titre du service</label>
          <input class="page_title" v-model="currentTitre" id="titre_service" />
        </div>

        <label> Description du service </label>
        <Editor
          v-model="currentDescri"
          api-key="8ul0fktth8jre7f3tbbkgp44wmfl27dksyj9mkbt7ddl13ls"
          :init="{
            height: 200,
            menubar: false,
            plugins: 'lists link image table media code preview anchor',
            toolbar:
              'undo redo | bold italic underline | bullist numlist | link | table hr | preview code',
            branding: false,
          }" />

        <div class="service_besoin">
          <h3>Besoin</h3>
          <input v-model="currentBesoin" />
        </div>

        <div class="service_infos">
          <div class="info_item">
            <span class="info_label">Prix (en €)</span>
            <input class="info_value" v-model="oneService.prix_service" />
          </div>

          <div class="info_item">
            <span class="info_label">Participants max</span>
            <input
              class="info_value"
              v-model="oneService.nbParticipants_service" />
          </div>
        </div>
        <div
          v-if="message && showService && messageType === 'error'"
          class="message"
          :class="
            messageType === 'error' ? 'message-error' : 'message-success'
          ">
          <span class="text">{{ message }}</span>
          <span class="modal-close" @click="closeMessage">&times;</span>
        </div>
        <button @click="addServiceToPrestataire()">Ajouter le service</button>
      </div>
    </div>
  </div>

  <div class="container">
    <!-- Titre principal de la page -->
    <div class="title">
      <p v-if="pathAdd">{{ $t("prestataireInfo.titleAdd") }}</p>
      <p v-else>{{ $t("prestataireInfo.titleEdit") }}</p>
    </div>

    <div class="content">
      <!-- Sous-titre indiquant le rôle du prestataire -->
      <div class="subtitle">
        <p>{{ $t("prestataireInfo.role") }}</p>
      </div>

      <!-- Liste des types de prestataires disponibles -->
      <div class="type_prestataire">
        <div
          v-for="(item, index) in type_prestataire"
          :key="index"
          class="boite_type_presta"
          :id="`p-${index}`">
          <!-- Bouton de sélection du type de prestataire -->
          <button
            class="button_type_presta"
            @click="selectTypePresta(index)"
            :disabled="continueInscription">
            {{ item.nom_type_prestataire[locale] }}
          </button>
        </div>
      </div>

      <!-- Tableau affichant les spécificités selon le type choisi -->
      <div v-if="selectedType" class="container_table">
        <h1>
          {{ $t("prestataireInfo.type") }}
          <span :style="{ color: 'red' }">{{ selectedTypeLabel }}</span> ?
        </h1>

        <table class="table_type_presta">
          <tbody>
            <!-- Liste des options possibles -->
            <tr
              v-for="(item, index) in selectedItems"
              :key="index"
              class="table-row">
              <td>
                <!-- Checkbox (une seule sélection autorisée) -->
                <input
                  type="checkbox"
                  :id="`item-${index}`"
                  :value="index"
                  @change="onCheckChange($event, item.nom, index)"
                  :checked="isCheckedWithIndex(index)"
                  :disabled="continueInscription" />
                <label :for="`item-${index}`">
                  {{ item.nom }}
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Message d'erreur si la sélection des checkbox est invalide -->
  <div class="message_error" v-if="errorMessageCheckBox">
    <p>{{ errorMessageCheckBox }}</p>
  </div>

  <!-- Bouton pour continuer l'inscription (uniquement en mode ajout) -->
  <div class="button_container" v-if="!continueInscription && pathAdd">
    <button
      @click.prevent="showContinueInscription"
      :disabled="!isSelectionValid"
      :class="{ disabled: !isSelectionValid }">
      {{ $t("prestataireInfo.btnContinueInscription") }}
    </button>
  </div>

  <!-- Bouton retour vers la sélection du type -->
  <div class="button_container" v-if="continueInscription && pathAdd">
    <button @click.prevent="hideContinueInscription">
      {{ $t("prestataireInfo.btnRetour") }}
    </button>
  </div>

  <!-- Formulaire de création / modification du prestataire -->
  <div
    class="prestataire_container"
    v-if="continueInscription || !pathAdd"
    id="presta_container">
    <div class="editor_container">
      <!-- Champ : nom du prestataire -->
      <div class="form_group">
        <label for="nom">
          {{ $t("prestataireInfo.formulaire.nom") }}
        </label>
        <input type="text" id="nom" v-model="nom_presta" />
      </div>

      <!-- Champ : description avec éditeur TinyMCE -->
      <div class="form_group">
        <label>
          {{ $t("prestataireInfo.formulaire.descri") }}
        </label>
        <Editor
          v-model="descri_presta"
          api-key="8ul0fktth8jre7f3tbbkgp44wmfl27dksyj9mkbt7ddl13ls"
          :init="{
            height: 600,
            menubar: false,
            plugins: 'lists link image table media code preview anchor',
            toolbar:
              'undo redo | bold italic underline | bullist numlist | link | table hr | preview code',
            branding: false,
          }" />
      </div>

      <!-- Champ : email de contact -->
      <div class="form_group">
        <label for="contact">
          {{ $t("user.mail") }}
        </label>
        <input
          type="text"
          id="contact"
          v-model="mail_presta"
          placeholder="mail@example.com" />
      </div>

      <!-- Champ : téléphone -->
      <div class="form_group">
        <label for="contact">
          {{ $t("user.tel_utilisateur") }}
        </label>
        <input
          type="tel"
          id="contact"
          v-model="tel_presta"
          pattern="^0[1-9][0-9]{8}$"
          placeholder="0123456789" />
      </div>

      <div class="form_group">
        <div class="ajout_services">
          <label>{{
            $t("prestataireInfo.services", {
              gotS: services.length > 1 ? "s" : "",
            })
          }}</label>
          <button @click="showService = true" class="pointer">+ Ajouter</button>
        </div>

        <div class="service_input">
          <div
            v-for="(item, index) in services"
            :key="index"
            class="service_row">
            <button @click="showOneService(item.id_service)">
              {{ item.nom_service }}
            </button>
            <span v-if="item.activate" class="active-icon" title="Actif"
              >&#10003;</span
            >
            <span v-else class="inactive-icon" title="Inactif">&#10007;</span>
            <button
              class="btn_activate"
              v-if="!item.activate"
              @click="activateService(item)">
              Activer
            </button>
            <button
              class="btn_desactivate"
              v-else-if="item.activate "
              @click="desactivatingService(item)">
              Désactiver
            </button>
            <button
              type="button"
              class="remove_btn pointer"
              @click="removeServiceField(index)">
              &times;
            </button>
          </div>
        </div>
      </div>

      <!-- Message de succès ou d’erreur après action -->
      <div
        v-if="message && !showService"
        class="message"
        :class="messageType === 'error' ? 'message-error' : 'message-success'">
        <span class="text">{{ message }}</span>
        <span class="modal-close" @click="closeMessage">&times;</span>
      </div>

      <!-- Bouton de modification (mode édition) -->
      <div class="button_container" v-if="!pathAdd">
        <button
          @click="updatePresta"
          :disabled="!isSelectionValid"
          :class="{ disabled: !isSelectionValid }">
          {{ $t("prestataireInfo.formulaire.btnModifier") }}
        </button>
      </div>

      <!-- Bouton d'inscription (mode ajout) -->
      <div class="button_container" v-else>
        <button @click="addPrestataire" :disabled="isSubmitting">
          {{ isSubmitting ? "En cours..." : $t("user.buttonInscription") }}
        </button>
      </div>

      <!-- Bouton de suppression du prestataire -->
      <!-- <div class="button_container">
        <button @click="delPresta">
          {{ $t("adminPage.prestataire.btn_suppr") }}
        </button>
      </div> -->
    </div>
  </div>

  <!-- Pied de page -->
  <Footer></Footer>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, computed, nextTick } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
// import axios from 'axios';
import { useI18n } from "vue-i18n";
import localData from "../../backend/database/localData.js";

import Editor from "@tinymce/tinymce-vue";
import Footer from "@/components/Footer.vue";

const { t, locale } = useI18n();
const userStore = useUserStore();
const route = useRoute();

const prestaId = computed(() => route.params.id);
const pathAdd = computed(() => route.name === "AddPrestataire");

const message = ref("");
const messageType = ref("success");

const isFrench = ref(true);

//=========================
//======= Services ========
//=========================
const showService = ref(false);
const services = ref([]);
const oneService = ref({
  nom_service: "",
  titre_service: { fr: "", en: "" },
  descri_service: { fr: "", en: "" },
  besoin: { fr: "", en: "" },
  prix: 0,
  nb_participants: 0,
  activate: false,
  visible_public: true,
});

//=========================
//=== Type prestataire ====
//=========================
const type_prestataire = ref([]);
const type_animation = ref([]);
const type_restauration = ref([]);
const type_boutique = ref([]);

const selectedType = ref("animation");
const selectedTypeId = ref(1);
const continueInscription = ref(false);
const checkedItems = ref([]);

//=========================
//===== Inputs fields =====
//=========================
const nom_presta = ref("");
const descri_presta = ref("");
const mail_presta = ref("");
const tel_presta = ref("");

const activate = ref(false);
const desactivate = ref(false);
const deleting = ref(false);
const isSubmitting = ref(false);

const selectedNames = computed(() =>
  checkedItems.value.map((item) => item.nom)
);

const isSelectionValid = computed(() => {
  return checkedItems.value.length == 1;
});

onMounted(() => {
  try {
    getValuesTypePresta();
    getValuesEveryType();
    if (!pathAdd.value) {
      continueInscription.value = true; // Activer le formulaire en mode édition
      getValuesPrestataire();
    }
  } catch (err) {
    console.error(err);
  }
});

const closeModal = () => {
  showService.value = false;
};

const closeMessage = () => {
  message.value = "";
};

const changeDescriLang = () => {
  isFrench.value = !isFrench.value;
};

const currentTitre = computed({
  get() {
    return isFrench.value
      ? oneService.value.titre_service.fr
      : oneService.value.titre_service.en;
  },
  set(value) {
    if (isFrench.value) {
      oneService.value.titre_service.fr = value;
    } else {
      oneService.value.titre_service.en = value;
    }
  },
});

const currentDescri = computed({
  get() {
    return isFrench.value
      ? oneService.value.descri_service.fr
      : oneService.value.descri_service.en;
  },
  set(value) {
    if (isFrench.value) {
      oneService.value.descri_service.fr = value;
    } else {
      oneService.value.descri_service.en = value;
    }
  },
});

const errorMessageCheckBox = computed(() => {
  if (checkedItems.value.length === 0) {
    return "Veuillez sélectionner une option.";
  }
  if (checkedItems.value.length > 1) {
    return "Veuillez sélectionner une seule option.";
  }
  return "";
});

const currentBesoin = computed({
  get() {
    return isFrench.value
      ? oneService.value.besoin.fr
      : oneService.value.besoin.en;
  },
  set(value) {
    if (isFrench.value) {
      oneService.value.besoin.fr = value;
    } else {
      oneService.value.besoin.en = value;
    }
  },
});

const selectedItems = computed(() => {
  switch (selectedType.value) {
    case "animation":
      return type_animation.value.map((item) => ({
        nom: item.nom_type_animation,
      }));
    case "boutique":
      return type_boutique.value.map((item) => ({
        nom: item.nom_type_boutique,
      }));
    case "restauration":
      return type_restauration.value.map((item) => ({
        nom: item.nom_type_restauration,
      }));
    default:
      return [];
  }
});

const selectedTypeLabel = computed(() => {
  switch (selectedType.value) {
    case "animation":
      return "d'animation";
    case "boutique":
      return "de boutique";
    case "restauration":
      return "de restauration";
    default:
      return "";
  }
});

function isLangEmpty(service, lang) {
  return (
    !service.titre_service[lang]?.trim() &&
    !service.descri_service[lang]?.trim() &&
    !service.besoin[lang]?.trim()
  );
}

function getMissingLangMessage(service) {
  const frEmpty = isLangEmpty(service, "fr");
  const enEmpty = isLangEmpty(service, "en");

  if (frEmpty && enEmpty) {
    return t("messagesServices.aucuneLangues");
  }

  if (frEmpty) {
    return t("messagesServices.queEN");
  }

  if (enEmpty) {
    return t("messagesServices.queFR");
  }

  return null;
}

function addServiceToPrestataire() {
  if (
    !oneService.value.nom_service ||
    oneService.value.nom_service.trim() === ""
  ) {
    message.value = "Le nom du service est obligatoire.";
    messageType.value = "error";
    return;
  }
  const confirmMessage = getMissingLangMessage(oneService.value);

  if (confirmMessage) {
    const confirmAdd = window.confirm(confirmMessage);
    if (!confirmAdd) return;
  }

  oneService.value.prix = Number(oneService.value.prix_service || 0);
  oneService.value.nb_participants = Number(
    oneService.value.nbParticipants_service || 0
  );

  services.value.push({ ...oneService.value });

  oneService.value = {
    nom_service: "",
    titre_service: { fr: "", en: "" },
    descri_service: { fr: "", en: "" },
    besoin: { fr: "", en: "" },
    prix: 0,
    nb_participants: 0,
    activate: false,
    visible_public: true,
  };
  showService.value = false;
  message.value = "Service ajouté avec succès !";
  messageType.value = "success";
}

function removeServiceField(index) {
  services.value.splice(index, 1);
}

async function desactivatingService(service) {
  desactivate.value = true;
  actionsService(service);
}

function activateService(service) {
  activate.value = true;
  actionsService(service);
}

function actionsService(service) {
  try {
    // Mettre à jour le service dans localStorage
    localData.update(
      "services",
      service.id_service,
      {
        activate: !service.activate,
      },
      "id_service"
    );

    const index = services.value.findIndex(
      (s) => s.id_service === service.id_service
    );
    if (index !== -1) {
      services.value[index].activate = !services.value[index].activate;
    }

    console.log("Service activé/désactivé:", service.id_service);
  } catch (err) {
    // async function activateService(service) {
    //     activate.value = true;
    //     actionsService(service);
    // }
    //
    // async function actionsService(service) {
    //     try {
    //         const res = await axios.patch(`http://localhost:3000/prestataire/activateService/${service.id_service}`);
    //
    //         const index = services.value.findIndex(s => s.id_service === service.id_service);
    //         if (index !== -1) {
    //             services.value[index].activate = !services.value[index].activate;
    //         }
    //
    //     } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

//=========================
//======== Events =========
//=========================
function isCheckedWithIndex(index) {
  return checkedItems.value.some((i) => i.index === index);
}

function onCheckChange(event, nom, index) {
  if (event.target.checked) {
    checkedItems.value.push({ nom, index });
  } else {
    checkedItems.value = checkedItems.value.filter((i) => i.index !== index);
  }
}

function showContinueInscription() {
  continueInscription.value = true;

  nextTick(() => {
    const element = document.getElementById("presta_container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function hideContinueInscription() {
  continueInscription.value = false;

  nextTick(() => {
    const element = document.getElementById("nav_bar");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function selectTypePresta(index) {
  const typeObj = type_prestataire.value[index];
  if (typeObj) {
    // nom_type_prestataire est un objet avec des langues { fr: "Animation", en: "Animation" }
    const nomType =
      typeObj.nom_type_prestataire[locale.value] ||
      typeObj.nom_type_prestataire.fr;
    selectedType.value = nomType.toLowerCase();
    selectedTypeId.value = typeObj.id_type_prestataire;
  }
}

function delPresta() {
  userStore.delPresta();
}

//=========================
//= Async functions types =
//=========================
function getValuesTypePresta() {
  try {
    type_prestataire.value = localData.getAll("type_prestataire");
    console.log("Types prestataire chargés:", type_prestataire.value);
  } catch (err) {
    console.error("Erreur chargement types prestataire:", err);
  }
}

// async function getValuesTypePresta() {
//     try {
//         const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
//         type_prestataire.value = res.data.result;
//     } catch (err) {
//         console.error(err);
//     }
// }

function getValuesEveryType() {
  try {
    type_animation.value = localData.getAll("type_animation");
    type_restauration.value = localData.getAll("type_restauration");
    type_boutique.value = localData.getAll("type_boutique");
    console.log(
      "Types chargés - Animation:",
      type_animation.value.length,
      "Restauration:",
      type_restauration.value.length,
      "Boutique:",
      type_boutique.value.length
    );
  } catch (err) {
    console.error("Erreur chargement types:", err);
  }
}

// async function getValuesEveryType() {
//     try {
//         const res = await axios.get("http://localhost:3000/prestataire/showEveryType");
//         type_animation.value = res.data.animations;
//         type_restauration.value = res.data.restaurations;
//         type_boutique.value = res.data.boutiques;
//     } catch (err) {
//         console.error(err);
//     }
// }

//==========================
//= Async functions presta =
//==========================
async function getValuesPrestataire() {
  if (prestaId.value === null) return;

  try {
    const prestataires = localData.getAll("prestataires");
    const presta = prestataires.find((p) => p.id_prestataire == prestaId.value);

    if (!presta) {
      console.error("Prestataire non trouvé:", prestaId.value);
      return;
    }

    const allServices = localData.getAll("services");
    const prestaServices = allServices.filter(
      (s) => s.id_prestataire == prestaId.value
    );

    nom_presta.value = presta.nom_prestataire;

    // async function getValuesPrestataire() {
    //     if (prestaId.value === null) return;
    //
    //     try {
    //         const res = await axios.get(`http://localhost:3000/prestataire/show/${prestaId.value}`);
    //         const presta = res.data.prestataire;
    //         const prestaServices = res.data.services;
    //
    //         nom_presta.value = presta.nom_prestataire;
    descri_presta.value = presta.descri_prestataire;
    mail_presta.value = presta.mail_prestataire;
    tel_presta.value = presta.tel_prestataire;

    const typeObj = type_prestataire.value.find(
      (t) =>
        t.id_type_prestataire ===
        (presta.id_type_prestataire || presta.type_prestataire_id)
    );
    if (typeObj) {
      const nomType =
        typeObj.nom_type_prestataire[locale.value] ||
        typeObj.nom_type_prestataire.fr;
      selectedType.value = nomType.toLowerCase();
      selectedTypeId.value = typeObj.id_type_prestataire;
    }

    // Attendre que Vue mette à jour selectedItems computed
    await nextTick();

    let spec = presta.specificite;

    // Pour suppirmer tous les trucs chiants
    if (typeof spec === "string") {
      spec = spec.replace(/[\{\}"]/g, "").trim();
    }

    console.log(
      "Recherche de la spécificité:",
      spec,
      "dans",
      selectedItems.value
    );

    const index = selectedItems.value.findIndex(
      (item) => item.nom.trim().toLowerCase() === spec.toLowerCase()
    );

    console.log("Index trouvé:", index);

    if (index !== -1) {
      checkedItems.value = [{ nom: selectedItems.value[index].nom, index }];
    } else {
      checkedItems.value = [];
    }

    services.value = prestaServices.map((s) => ({
      id_service: s.id_service,
      nom_service: s.nom_service,
      activate: s.activate || false,
    }));
  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

function addPrestataire() {
  // Empêcher les doubles clics
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const utilisateurs = localData.getAll("utilisateurs");
    const userIndex = utilisateurs.findIndex(
      (u) => u.id_utilisateur == prestaId.value
    );

    if (userIndex === -1) {
      message.value = "Utilisateur non trouvé";
      messageType.value = "error";
      isSubmitting.value = false;
      return;
    }

    // Vérifier si un prestataire existe déjà pour cet utilisateur
    const prestataires = localData.getAll("prestataires");
    const existingPresta = prestataires.find(
      (p) => p.id_utilisateur == prestaId.value
    );

    if (existingPresta) {
      message.value = "Vous avez déjà une demande de prestataire en cours";
      messageType.value = "error";
      isSubmitting.value = false;
      return;
    }

    // Créer le nouveau prestataire
    const newPrestaId =
      prestataires.length > 0
        ? Math.max(...prestataires.map((p) => p.id_prestataire)) + 1
        : 1;

    const newPrestataire = {
      id_prestataire: newPrestaId,
      id_utilisateur: parseInt(prestaId.value),
      nom_prestataire: nom_presta.value,
      descri_prestataire: descri_presta.value,
      mail_prestataire: mail_presta.value,
      tel_prestataire: tel_presta.value,
      specificite: selectedNames.value.join(","),
      id_type_prestataire: Number(selectedTypeId.value),
      waitingforadmin: true,
      refused: false,
      id_zone: null,
      message_ajout: true,
    };

    localData.add("prestataires", newPrestataire);

    // Ajouter les services
    const allServices = localData.getAll("services");
    services.value.forEach((s) => {
      const newServiceId =
        allServices.length > 0
          ? Math.max(...allServices.map((srv) => srv.id_service)) + 1
          : 1;
      const newService = {
        id_service: newServiceId,
        id_prestataire: newPrestaId,
        nom_service: s.nom_service,
        titre_service: s.titre_service,
        descri_service: s.descri_service,
        besoin: s.besoin,
        prix_service: s.prix,
        nbParticipants_service: s.nb_participants,
        activate: s.activate || false,
      };
      localData.add("services", newService);
    });

    // Mettre à jour l'utilisateur (ispresta reste false jusqu'à validation admin)
    utilisateurs[userIndex].ispresta = false;
    utilisateurs[userIndex].waitingforadmin = true;
    localData.update(
      "utilisateurs",
      prestaId.value,
      { ispresta: false, waitingforadmin: true },
      "id_utilisateur"
    );

    userStore.prestaId = newPrestaId;

    message.value = "Prestataire créé avec succès";
    messageType.value = "success";

    console.log("Nouveau prestataire créé:", newPrestataire);

    isSubmitting.value = false;
  } catch (err) {
    message.value = "Erreur lors de la création: " + err.message;
    messageType.value = "error";
    console.error("Erreur:", err);
    isSubmitting.value = false;
  }
}

// async function addPrestataire() {
//     try {
//         const servicesPayload = services.value.map(s => ({
//             nom_service: s.nom_service,
//             titre_service: {
//                 fr: { texte: s.titre_service.fr },
//                 en: { texte: s.titre_service.en }
//             },
//             descri_service: {
//                 fr: { texte: s.descri_service.fr },
//                 en: { texte: s.descri_service.en }
//             },
//             besoin: s.besoin,
//             prix: s.prix,
//             nb_participants: s.nb_participants,
//             activate: s.activate,
//             visible_public: s.visible_public
//         }));
//
//
//         const res = await axios.post(`http://localhost:3000/prestataire/becomePrestataire/${prestaId.value}`, {
//             nom: nom_presta.value,
//             descri: descri_presta.value,
//             mail: mail_presta.value,
//             tel: tel_presta.value,
//             specificite: selectedNames.value,
//             type: Number(selectedTypeId.value),
//             services: servicesPayload
//         });
//         userStore.prestaId = res.data.user.prestaId;
//
//         message.value = res.data.message;
//         messageType.value = "success";
//     } catch (err) {
//         if (err.response && err.response.data) {
//             message.value = err.response.data.error;
//         } else {
//             message.value = "Erreur inconnue";
//         }
//         messageType.value = 'error';
//     }
// }

function updatePresta() {
  try {
    // Mettre à jour le prestataire
    localData.update(
      "prestataires",
      prestaId.value,
      {
        nom_prestataire: nom_presta.value,
        descri_prestataire: descri_presta.value,
        mail_prestataire: mail_presta.value,
        tel_prestataire: tel_presta.value,
        specificite: selectedNames.value.join(","),
        id_type_prestataire: Number(selectedTypeId.value),
      },
      "id_prestataire"
    );

    // Mettre à jour les services
    const allServices = localData.getAll("services");
    services.value.forEach((s) => {
      if (s.id_service) {
        // Service existant - mise à jour
        localData.update(
          "services",
          s.id_service,
          {
            nom_service: s.nom_service,
            titre_service: s.titre_service,
            descri_service: s.descri_service,
            besoin: s.besoin,
            prix_service: s.prix,
            nbParticipants_service: s.nb_participants,
            activate: s.activate,
          },
          "id_service"
        );
      } else {
        // Nouveau service
        const newServiceId =
          allServices.length > 0
            ? Math.max(...allServices.map((srv) => srv.id_service)) + 1
            : 1;
        localData.add("services", {
          id_service: newServiceId,
          id_prestataire: parseInt(prestaId.value),
          nom_service: s.nom_service,
          titre_service: s.titre_service,
          descri_service: s.descri_service,
          besoin: s.besoin,
          prix_service: s.prix,
          nbParticipants_service: s.nb_participants,
          activate: s.activate || false,
        });
      }
    });

    message.value = "Prestataire mis à jour avec succès";
    messageType.value = "success";
    console.log("Prestataire mis à jour:", prestaId.value);
  } catch (err) {
    message.value = "Erreur lors de la mise à jour: " + err.message;
    messageType.value = "error";
    console.error("Erreur:", err);
  }
}

// async function updatePresta() {
//     try {
//         const servicesPayload = services.value.map(s => ({
//             nom_service: s.nom_service,
//             titre_service: {
//                 fr: { texte: s.titre_service.fr },
//                 en: { texte: s.titre_service.en }
//             },
//             descri_service: {
//                 fr: { texte: s.descri_service.fr },
//                 en: { texte: s.descri_service.en }
//             },
//             besoin: s.besoin,
//             prix: s.prix,
//             nb_participants: s.nb_participants,
//             activate: s.activate,
//             visible_public: s.visible_public
//         }));
//
//
//         const res = await axios.put(`http://localhost:3000/prestataire/updatePresta/${prestaId.value}`, {
//             nom: nom_presta.value,
//             descri: descri_presta.value,
//             mail: mail_presta.value,
//             tel: tel_presta.value,
//             specificite: selectedNames.value,
//             type: Number(selectedTypeId.value),
//             services: servicesPayload
//         });
//         message.value = res.data.message;
//         messageType.value = "success";
//     } catch (err) {
//         if (err.response && err.response.data) {
//             message.value = err.response.data.error;
//         } else {
//             message.value = "Erreur inconnue";
//         }
//         messageType.value = 'error';
//     }
// }

function showOneService(id_service) {
  try {
    const allServices = localData.getAll("services");
    const s = allServices.find((srv) => srv.id_service == id_service);

    if (!s) {
      console.error("Service non trouvé:", id_service);
      return;
    }

    console.log("Service trouvé:", s);

    oneService.value = {
      id_service: s.id_service,
      nom_service: s.nom_service,

      titre_service: {
        fr: s.titre_service?.fr?.texte ?? s.titre_service?.fr ?? "",
        en: s.titre_service?.en?.texte ?? s.titre_service?.en ?? "",
      },

      descri_service: {
        fr: s.descri_service?.fr?.texte ?? s.descri_service?.fr ?? "",
        en: s.descri_service?.en?.texte ?? s.descri_service?.en ?? "",
      },

      besoin: {
        fr: s.besoin?.fr ?? "",
        en: s.besoin?.en ?? "",
      },

      prix: s.prix_service ?? s.prix ?? 0,
      nb_participants: s.nbParticipants_service ?? s.nb_participants ?? 0,

      // async function showOneService(id_service) {
      //     try {
      //         const res = await axios.get(`http://localhost:3000/prestataire/service/show/${id_service}`) ;
      //         const s = res.data;
      //         console.log("res.data", res.data)
      //
      //         oneService.value = {
      //             id_service: s.id_service,
      //             nom_service: s.nom_service,
      //
      //             titre_service: {
      //                 fr: s.titre_service?.fr?.texte ?? '',
      //                 en: s.titre_service?.en?.texte ?? ''
      //             },
      //
      //             descri_service: {
      //                 fr: s.descri_service?.fr?.texte ?? '',
      //                 en: s.descri_service?.en?.texte ?? ''
      //             },
      //
      //             besoin: {
      //                 fr: s.besoin?.fr ?? '',
      //                 en: s.besoin?.en ?? ''
      //             },
      //
      //             prix: s.prix ?? 0,
      //             nb_participants: s.nb_participants ?? 0,
      activate: s.activate ?? false,
      visible_public: s.visible_public ?? true,
    };

    showService.value = true;
  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #0a1d42;
}

.title p {
  text-align: center;
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.subtitle p {
  font-size: 1.3em;
  text-align: center;
  margin-bottom: 30px;
  color: black;
}

.type_prestataire {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}

.button_type_presta {
  background: linear-gradient(135deg, #f7c325, #ffdb59);
  color: #0a1d42;
  font-weight: 700;
  font-size: 1.1em;
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(247, 195, 37, 0.4);
  transition: all 0.3s ease;
}

.button_type_presta:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 0 20px rgba(247, 195, 37, 0.6),
    0 0 8px rgba(247, 195, 37, 0.4) inset;
}

.button_type_presta:active {
  transform: translateY(2px) scale(0.98);
  box-shadow: 0 3px 10px rgba(0, 87, 255, 0.3);
}

.container_table {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.table_type_presta {
  width: 400px;
  max-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.table_type_presta td {
  padding: 15px 20px;
  font-size: 1em;
}

.table-row {
  border-bottom: 1px solid #e0e0e0;
}

.table-row:last-child {
  border-bottom: none;
}

.other-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.other-option input[type="text"] {
  flex: 1;
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.container_table h1 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #1b2e59;
}

.prestataire_container {
  display: flex;
  justify-content: center;
  padding-top: 80px;
  width: 100%;
  box-sizing: border-box;
}

.editor_container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 800px;
  margin: auto;
  margin-top: 60px;
}

.tox-tinymce {
  width: 100% !important;
}

.form_group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form_group input,
.form_group select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.ajout_services {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.ajout_services button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
}

.ajout_services button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 18px rgba(41, 128, 185, 0.6),
    0 0 10px rgba(41, 128, 185, 0.3) inset;
}

.ajout_services button:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 3px 10px rgba(41, 128, 185, 0.4);
}

.service_input {
  display: flex;
  flex-direction: column;
}

.service_row {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.service_row input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.remove_btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 14px;
  margin-left: 10px;
  border-radius: 10px;
  transition: all 0.2s;
}

.remove_btn:hover {
  background: #c0392b;
  transform: scale(1.1);
}
</style>
