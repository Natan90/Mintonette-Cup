<template>
  <NavView id="nav_bar"></NavView>
  <Modal v-model="showService" :bigger="true">
    <template #content>
      <div class="service_details">

        <!-- Langue -->
        <div class="service_lang">
          <button class="btn_lang" @click="changeDescriLang">
            <span v-if="isFrench">🌐 Passer en anglais</span>
            <span v-else>🌐 Go in French</span>
          </button>
        </div>

        <!-- Nom du service -->
        <div class="service_form_group">
          <label for="nom_service">Nom du service</label>
          <input class="service_input_text" v-model="oneService.nom_service" id="nom_service" />
        </div>

        <!-- Description -->
        <div class="service_form_group">
          <label>Description du service</label>
          <Editor v-model="currentDescri" api-key="8ul0fktth8jre7f3tbbkgp44wmfl27dksyj9mkbt7ddl13ls" :init="{
            height: 200,
            menubar: false,
            plugins: 'lists link image table media code preview anchor',
            toolbar: 'undo redo | bold italic underline | bullist numlist | link | table hr | preview code',
            branding: false,
          }" />
        </div>

        <!-- Besoin -->
        <div class="service_form_group">
          <label>Besoin</label>
          <input class="service_input_text" v-model="currentBesoin" />
        </div>

        <!-- Visible -->
        <div class="service_form_group">
          <div>
            <label>Visible :</label>
            <input type="radio" class="service_input_text" v-model="currentBesoin" />
            <label>Oui</label>
            <input type="radio" class="service_input_text" v-model="currentBesoin" />
            <label>Non</label>
          </div>
        </div>

        <!-- Actif -->
        <div class="service_form_group">
          <div>
            <label>Actif :</label>
            <input type="radio" class="service_input_text" v-model="currentBesoin" />
            <label>Oui</label>
            <input type="radio" class="service_input_text" v-model="currentBesoin" />
            <label>Non</label>
          </div>
        </div>



        <!-- Message erreur -->
        <div v-if="message && showService && messageType === 'error'" class="message"
          :class="messageType === 'error' ? 'message-error' : 'message-success'">
          <span class="text">{{ message }}</span>
          <span class="modal-close" @click="closeMessage">&times;</span>
        </div>

        <!-- Bouton principal -->
        <div class="service_submit">
          <button class="btn_service_submit" @click="addServiceToPrestataire">
            ✓ Ajouter le service
          </button>
        </div>

      </div>
    </template>
  </Modal>


  <section class="container">
    <div class="content_container">
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
          <div v-for="(item, index) in type_prestataire" :key="index" class="boite_type_presta" :id="`p-${index}`">
            <!-- Bouton de sélection du type de prestataire -->
            <button class="button_type_presta pointer" @click="selectTypePresta(index)" :disabled="continueInscription"
              :class="selectedIndex === index ? 'button_selected' : ''">
              {{ item.nom_type_prestataire[locale] }}
            </button>
          </div>
        </div>

        <!-- Tableau affichant les spécificités selon le type choisi -->
        <div v-if="selectedType" class="container_table">
          <h1>
            {{ $t("prestataireInfo.type") }}
            <span :style="{ color: 'var(--log-rose)' }">{{ selectedTypeLabel }}</span> ?
          </h1>

          <table class="table_type_presta">
            <tbody>
              <!-- Liste des options possibles -->
              <tr v-for="(item, index) in selectedItems" :key="index" class="table-row">
                <td>
                  <!-- Checkbox (une seule sélection autorisée) -->
                  <input type="radio" :id="`item-${index}`" :value="index" @change="onCheckChange($event, item)"
                    :checked="isChecked(item)" :disabled="continueInscription" />
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

    <!-- Message d'erreur si la sélection des boutons radios est invalide -->
    <div class="message_error" v-if="errorMessageCheckBox">
      <p>{{ errorMessageCheckBox }}</p>
    </div>

    <!-- Bouton pour continuer l'inscription (uniquement en mode ajout) -->
    <div class="button_container" v-if="!continueInscription && pathAdd">
      <button @click.prevent="showContinueInscription" :disabled="!isSelectionValid"
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
    <div class="prestataire_container" v-if="continueInscription || !pathAdd" id="presta_container">
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
          <Editor v-model="descri_presta" api-key="8ul0fktth8jre7f3tbbkgp44wmfl27dksyj9mkbt7ddl13ls" :init="{
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
          <input type="text" id="contact" v-model="mail_presta" placeholder="mail@example.com" />
        </div>

        <!-- Champ : téléphone -->
        <div class="form_group">
          <label for="contact">
            {{ $t("user.tel_utilisateur") }}
          </label>
          <input type="tel" id="contact" v-model="tel_presta" pattern="^0[1-9][0-9]{8}$" placeholder="0123456789" />
        </div>

        <div class="form_group">
          <div class="ajout_services">
            <label>{{
              $t("prestataireInfo.services", {
                gotS: services.length > 1 ? "s" : "",
              })
            }}</label>
            <button @click="showModalByService" class="pointer">+ Ajouter</button>
          </div>

          <div class="service_input">
            <div v-for="(item, index) in services" :key="index" class="service_row">
              <button @click="showOneService(item.id_service)">
                {{ item.nom_service }}
              </button>
              <span v-if="item.activate" class="active-icon" title="Actif">&#10003;</span>
              <span v-else class="inactive-icon" title="Inactif">&#10007;</span>
              <button class="btn_activate" v-if="!item.activate" @click="activateService(item)">
                Activer
              </button>
              <button class="btn_desactivate" v-else-if="item.activate" @click="desactivatingService(item)">
                Désactiver
              </button>
              <button type="button" class="remove_btn pointer" @click="removeServiceField(index)">
                &times;
              </button>
            </div>
          </div>
        </div>

        <!-- Message de succès ou d'erreur après action -->
        <div v-if="message && !showService" class="message"
          :class="messageType === 'error' ? 'message-error' : 'message-success'">
          <span class="text">{{ message }}</span>
          <span class="modal-close" @click="closeMessage">&times;</span>
        </div>

        <!-- Bouton de modification (mode édition) -->
        <div class="button_container" v-if="!pathAdd">
          <button @click="updatePresta()" :disabled="!isSelectionValid" :class="{ disabled: !isSelectionValid }">
            {{ $t("prestataireInfo.formulaire.btnModifier") }}
          </button>
        </div>

        <!-- Bouton d'inscription (mode ajout) -->
        <div class="button_container" v-else>
          <button @click="addPrestataire()" :disabled="isSubmitting">
            {{ isSubmitting ? "En cours..." : $t("user.buttonInscription") }}
          </button>
        </div>
      </div>
    </div>
  </section>


  <!-- Pied de page -->
  <Footer></Footer>
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, computed, nextTick } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useServiceStore } from "@/services/service.service";
import { usePrestataireStore } from "@/services/prestataire.service";
import { useTypePrestataireStore } from "@/services/type_prestataire.service";
import Modal from "@/components/Modal.vue";
import Editor from "@tinymce/tinymce-vue";
import Footer from "@/components/Footer.vue";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useNavigationStore } from "@/stores/navigation";

const { t, locale } = useI18n();
const userStore = useUserStore();
const serviceStore = useServiceStore();
const prestataireStore = usePrestataireStore();
const typePrestataireStore = useTypePrestataireStore();
const mailBoxStore = useMailBoxStore();
const navStore = useNavigationStore();

const route = useRoute();
const router = useRouter();
const prestaId = computed(() => route.params.id);
const pathAdd = computed(() => route.name === "AddPrestataire");

const message = ref("");
const messageType = ref("success");

const isFrench = ref(true);

//=========================
//======= Services ========
//=========================
const showService = ref(false);
const isActivityService = ref(false);
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

function showModalByService() {
  showService.value = true;
  const currentType = type_prestataire.value.find(
    (t) => t.id_type_prestataire === selectedTypeId.value
  );
  isActivityService.value = currentType?.is_activity ?? false;
}

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
const selectedIndex = ref(0);

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

onMounted(async () => {
  try {
    await getValuesTypePresta();
    await getValuesEveryType();
    if (!pathAdd.value) {
      continueInscription.value = true;
      await getValuesPrestataire();
    }
  } catch (err) {
    console.error(err);
  }
});

const closeMessage = () => {
  message.value = "";
};

const changeDescriLang = () => {
  isFrench.value = !isFrench.value;
};


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
  switch (selectedTypeId.value) {
    case 1:
      return type_animation.value.map(item => ({
        nom: item.nom_type_animation,
      }));
    case 2:
      return type_boutique.value.map(item => ({
        nom: item.nom_type_boutique,
      }));
    case 3:
      return type_restauration.value.map(item => ({
        nom: item.nom_type_restauration,
      }));
    default:
      return [];
  }
});

const selectedTypeLabel = computed(() => {
  const typeObj = type_prestataire.value[selectedIndex.value];
  if (!typeObj) return "";

  return (
    typeObj.nom_type_prestataire[locale.value] ||
    typeObj.nom_type_prestataire.fr
  );
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


async function addServiceToPrestataire() {
  if (!oneService.value.nom_service?.trim()) {
    message.value = "Le nom du service est obligatoire.";
    messageType.value = "error";
    return;
  }
  const confirmMessage = getMissingLangMessage(oneService.value);
  if (confirmMessage) {
    const confirmAdd = window.confirm(confirmMessage);
    if (!confirmAdd) return;
  }

  try {
    const res = await serviceStore.CreateService(prestaId.value, {
      nom_service: oneService.value.nom_service,
      descri_service: oneService.value.descri_service,
      besoin: oneService.value.besoin,
      activate: oneService.value.activate,
      visible_public: oneService.value.visible_public
    });

    const newServiceId = res.data.id_service;

    services.value.push({ 
      ...oneService.value, 
      id_service: newServiceId 
    });

    showService.value = false;
    message.value = "Service ajouté avec succès !";
    messageType.value = "success";

    navStore.previousRoute = route.fullPath;

    router.push({
      name: "AddByService",
      params: { id: newServiceId },
      query: { isActivityService: isActivityService.value }
    });


  } catch (err) {
    message.value = err.message;
    messageType.value = "error";
  }
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


async function actionsService(service) {
  try {
    const res = await serviceStore.ActivateService(service.id_service);

    const index = services.value.findIndex(s => s.id_service === service.id_service);
    if (index !== -1) {
      services.value[index].activate = !services.value[index].activate;
    }

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

function isChecked(item) {
  return checkedItems.value.some(
    (i) => i.nom === item.nom
  );
}

function onCheckChange(event, item) {
  if (event.target.checked) {
    checkedItems.value = [item];
  } else {
    checkedItems.value = [];
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
  selectedIndex.value = index;

  const typeObj = type_prestataire.value[index];
  if (typeObj) {
    selectedTypeId.value = typeObj.id_type_prestataire;
  }
}


async function getValuesTypePresta() {
  try {
    const res = await typePrestataireStore.GetTypePrestataires();
    type_prestataire.value = res.data.result;
  } catch (err) {
    console.error(err);
  }
}

async function getValuesEveryType() {
  try {
    const res = await typePrestataireStore.GetTypePrestataires();
    type_animation.value = res.data.animations;
    type_restauration.value = res.data.restaurations;
    type_boutique.value = res.data.boutiques;
  } catch (err) {
    console.error(err);
  }
}

async function getValuesPrestataire() {
  if (prestaId.value === null) return;

  try {
    const res = await prestataireStore.GetPrestataireById(prestaId.value);

    const presta = res.data.prestataire;
    const prestaServices = res.data.services;

    if (!presta) {
      console.error("Prestataire non trouvé :", prestaId.value);
      return;
    }

    nom_presta.value = presta.nom_prestataire;
    descri_presta.value = presta.descri_prestataire;
    mail_presta.value = presta.mail_prestataire;
    tel_presta.value = presta.tel_prestataire;

    const indexType = type_prestataire.value.findIndex(
      (t) =>
        t.id_type_prestataire ===
        (presta.id_type_prestataire || presta.type_prestataire_id)
    );

    if (indexType !== -1) {
      selectedIndex.value = indexType;

      const typeObj = type_prestataire.value[indexType];

      const nomType =
        typeObj.nom_type_prestataire[locale.value] ||
        typeObj.nom_type_prestataire.fr;

      selectedType.value = nomType.toLowerCase();
      selectedTypeId.value = typeObj.id_type_prestataire;
    }

    await nextTick();

    let spec = presta.specificite;

    if (typeof spec === "string") {
      try {
        spec = JSON.parse(spec);
      } catch {
        spec = [spec];
      }
    }

    if (Array.isArray(spec)) {
      spec = spec[0];
    }

    const index = selectedItems.value.findIndex(
      (item) => item.nom.trim().toLowerCase() === spec.toLowerCase()
    );

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

async function addPrestataire() {
  try {
    const servicesPayload = services.value.map(s => ({
      nom_service: s.nom_service,
      titre_service: {
        fr: { texte: s.titre_service.fr },
        en: { texte: s.titre_service.en }
      },
      descri_service: {
        fr: { texte: s.descri_service.fr },
        en: { texte: s.descri_service.en }
      },
      besoin: s.besoin,
      prix: s.prix,
      nb_participants: s.nb_participants,
      activate: s.activate,
      visible_public: s.visible_public
    }));

    const res = await prestataireStore.BecomePrestataire(userStore.userId, {
      nom: nom_presta.value,
      descri: descri_presta.value,
      mail: mail_presta.value,
      tel: tel_presta.value,
      specificite: selectedNames.value,
      type: Number(selectedTypeId.value),
      services: servicesPayload
    });

    userStore.prestaId = res.data.id_prestataire;

    await sendMailToAdmin(false);

    message.value = res.data.message;
    messageType.value = "success";
  } catch (err) {
    message.value = err.message;
    messageType.value = 'error';
  }
}

async function updatePresta() {
  try {
    const servicesPayload = services.value.map(s => ({
      nom_service: s.nom_service,
      titre_service: {
        fr: { texte: s.titre_service.fr },
        en: { texte: s.titre_service.en }
      },
      descri_service: {
        fr: { texte: s.descri_service.fr },
        en: { texte: s.descri_service.en }
      },
      besoin: s.besoin,
      prix: s.prix,
      nb_participants: s.nb_participants,
      activate: s.activate,
      visible_public: s.visible_public
    }));

    const res = await prestataireStore.UpdatePrestataire(userStore.userId, {
      nom: nom_presta.value,
      descri: descri_presta.value,
      mail: mail_presta.value,
      tel: tel_presta.value,
      specificite: selectedNames.value,
      type: Number(selectedTypeId.value),
      services: servicesPayload
    });
    message.value = res.data.message;
    messageType.value = "success";

    await sendMailToAdmin(true);

  } catch (err) {
    message.value = err.message;
    messageType.value = 'error';
  }
}

async function showOneService(id_service) {
  try {
    const res = await serviceStore.GetServiceById(id_service);
    const s = res.data.service;

    oneService.value = {
      id_service: s.id_service,
      nom_service: s.nom_service,

      titre_service: {
        fr: s.titre_service?.fr?.texte ?? '',
        en: s.titre_service?.en?.texte ?? ''
      },

      descri_service: {
        fr: s.descri_service?.fr?.texte ?? '',
        en: s.descri_service?.en?.texte ?? ''
      },

      besoin: {
        fr: s.besoin?.fr ?? '',
        en: s.besoin?.en ?? ''
      },

      prix: s.prix ?? 0,
      nb_participants: s.nb_participants ?? 0,
      activate: s.activate ?? false,
      visible_public: s.visible_public ?? true,
    };

    showService.value = true;
  } catch (err) {
    console.error(err);
  }
}

async function sendMailToAdmin(isModif) {
  const path = isModif
    ? "mailToSend.modifPresta"
    : "mailToSend.demandePresta";

  const subject = t(`${path}.subject`);

  const messageText = t(`${path}.message`, {
    nom: nom_presta.value,
    email: mail_presta.value,
    telephone: tel_presta.value,
    type: selectedType.value,
    specificite: selectedNames.value.join(", ")
  });

  const id_admin = 1;
  let id_type_message = isModif ? 2 : 1;
  try {
    const res = await mailBoxStore.sendMessageTo(userStore.userId, {
      id_user_to: id_admin,
      subject,
      message: messageText,
      id_type_message
    });

  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped>
.container,
.prestataire_container,
.button_container,
.message_error {
  --log-primary: #3a6f43;
  --log-primary-light: #5a9966;
  --log-primary-dark: #2a5232;
  --log-rose: #e8637a;
  --log-rose-hover: #c94d65;
  --log-rose-pale: #ffd5d5;
  --log-rose-medium: #fc9999;
  --log-card-bg: #fffaf8;
  --log-fond: #f9fafb;
  --log-border: #ddd0cc;
  --log-gradient-cta: linear-gradient(90deg, #3a6f43, #e8637a);
  --log-gradient-input: linear-gradient(to right, #5a9966, #e8637a);
}

/* ── Conteneur principal ── */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* ── Titre ── */
.title p {
  text-align: center;
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--log-primary);
}

/* ── Sous-titre ── */
.subtitle p {
  font-size: 1.3em;
  text-align: center;
  margin-bottom: 30px;
  color: #3a4a3d;
}

/* ── Sélection type prestataire ── */
.type_prestataire {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}

.button_type_presta {
  background: var(--log-card-bg);
  color: var(--log-primary);
  font-weight: 700;
  font-size: 1.1em;
  padding: 15px 30px;
  border: 2px solid var(--log-primary-light);
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.15);
  transition: all 0.3s ease;
}

.button_type_presta:not(.button_selected):hover {
  transform: translateY(-4px) scale(1.04);
  background: #eef5ef;
  box-shadow: 0 8px 22px rgba(58, 111, 67, 0.25);
  border-color: var(--log-primary);
}

.button_type_presta:active {
  transform: translateY(2px) scale(0.98);
}

.button_selected {
  background: var(--log-gradient-cta);
  color: #fff;
  /* border-color: transparent; */
  box-shadow: 0 6px 18px rgba(58, 111, 67, 0.3);
}

.button_selected:hover {
  background: var(--log-gradient-cta-invert);
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 8px 22px rgba(232, 99, 122, 0.35);
}

/* ── Table des spécificités ── */
.container_table {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container_table h1 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
  color: var(--log-primary-dark);
}

.table_type_presta {
  width: 400px;
  max-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--log-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(58, 111, 67, 0.1), 0 2px 8px rgba(232, 99, 122, 0.06);
}

.table_type_presta td {
  padding: 15px 20px;
  font-size: 1em;
  color: #2a3d2e;
}

.table_type_presta td label {
  font-weight: 500;
  cursor: pointer;
}

.table-row {
  border-bottom: 1px solid var(--log-border);
  transition: background 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f0f7f1;
}

input[type="radio"] {
  accent-color: var(--log-primary);
  margin-right: 10px;
  width: auto;
}

/* ── Message d'erreur checkbox ── */
.message_error {
  text-align: center;
  color: var(--log-rose-hover);
  font-weight: 600;
  font-size: 0.95em;
  margin-top: 8px;
}

/* ── Boutons d'action principaux ── */
.button_container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.button_container button {
  background: var(--log-gradient-cta);
  color: #fff;
  font-weight: 600;
  font-size: 1em;
  padding: 12px 32px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.25);
  transition: all 0.3s ease;
  letter-spacing: 0.4px;
}

.button_container button:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(58, 111, 67, 0.35);
}

.button_container button:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(58, 111, 67, 0.2);
}

.button_container button.disabled,
.button_container button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ── Formulaire prestataire ── */
.prestataire_container {
  display: flex;
  justify-content: center;
  padding-top: 60px;
  width: 100%;
  box-sizing: border-box;
}

.editor_container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 800px;
  margin: auto;
  margin-top: 40px;
}

/* ── Labels & Inputs ── */
.form_group label {
  font-weight: 700;
  margin-bottom: 6px;
  display: block;
  color: var(--log-primary-dark);
  font-size: 0.95em;
  letter-spacing: 0.3px;
}

.form_group input,
.form_group select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--log-border);
  background: var(--log-card-bg);
  color: #2a3d2e;
  font-size: 15px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.form_group input:focus,
.form_group select:focus {
  outline: none;
  border-color: var(--log-primary-light);
  box-shadow: 0 0 0 3px rgba(90, 153, 102, 0.15);
}

.form_group input::placeholder {
  color: #8aab8e;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ── Section services ── */
.ajout_services {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.ajout_services label {
  font-weight: 700;
  color: var(--log-primary-dark);
}

.ajout_services button {
  background: var(--log-gradient-cta);
  color: white;
  border: none;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(58, 111, 67, 0.25);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.ajout_services button:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 6px 18px rgba(58, 111, 67, 0.35);
}

.ajout_services button:active {
  transform: translateY(1px) scale(0.98);
}

.service_input {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.service_row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--log-card-bg);
  border: 1.5px solid var(--log-border);
  border-radius: 10px;
  transition: box-shadow 0.2s ease;
}

.service_row:hover {
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.1);
}

.service_row>button:first-child {
  flex: 1;
  background: transparent;
  border: none;
  font-weight: 600;
  color: var(--log-primary);
  cursor: pointer;
  text-align: left;
  font-size: 0.95em;
  padding: 4px 0;
  transition: color 0.2s;
}

.service_row>button:first-child:hover {
  color: var(--log-primary-dark);
  text-decoration: underline;
}

/* Icônes actif / inactif */
.active-icon {
  color: var(--log-primary);
  font-weight: 700;
  font-size: 1.1em;
}

.inactive-icon {
  color: var(--log-rose);
  font-weight: 700;
  font-size: 1.1em;
}

/* Bouton Activer */
.btn_activate {
  background: var(--log-primary);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(58, 111, 67, 0.2);
}

.btn_activate:hover {
  background: var(--log-primary-dark);
  transform: translateY(-1px);
}

/* Bouton Désactiver */
.btn_desactivate {
  background: var(--log-rose);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(232, 99, 122, 0.25);
}

.btn_desactivate:hover {
  background: var(--log-rose-hover);
  transform: translateY(-1px);
}

/* Bouton supprimer */
.remove_btn {
  background: var(--log-rose);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1em;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(232, 99, 122, 0.2);
}

.remove_btn:hover {
  background: var(--log-rose-hover);
  transform: scale(1.1);
}

/* ── Messages succès / erreur ── */
.message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95em;
}

.message-success {
  background: #eef7f0;
  color: var(--log-primary-dark);
  border: 1.5px solid var(--log-primary-light);
}

.message-error {
  background: #fff0f2;
  color: var(--log-rose-hover);
  border: 1.5px solid var(--log-rose-medium);
}

.message .text {
  flex: 1;
}

.modal-close {
  font-size: 20px;
  font-weight: bold;
  color: #777;
  cursor: pointer;
  margin-left: 12px;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: var(--log-rose-hover);
}

/* ── Modal service : conteneur principal ── */
.service_details {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 2px;
}

/* ── Bouton langue ── */
.service_lang {
  display: flex;
  justify-content: flex-end;
}

.btn_lang {
  background: transparent;
  border: 1.5px solid var(--log-border);
  color: var(--log-primary);
  font-size: 0.85em;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn_lang:hover {
  background: var(--log-primary);
  color: #fff;
  border-color: var(--log-primary);
}

/* ── Groupes de champs ── */
.service_form_group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.service_form_group label {
  font-weight: 700;
  font-size: 0.9em;
  color: var(--log-primary-dark);
  letter-spacing: 0.3px;
}

.service_input_text {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--log-border);
  background: var(--log-card-bg);
  color: #2a3d2e;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.service_input_text:focus {
  outline: none;
  border-color: var(--log-primary-light);
  box-shadow: 0 0 0 3px rgba(90, 153, 102, 0.15);
}

.service_input_number {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--log-border);
  background: var(--log-card-bg);
  color: #2a3d2e;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.service_input_number:focus {
  outline: none;
  border-color: var(--log-primary-light);
  box-shadow: 0 0 0 3px rgba(90, 153, 102, 0.15);
}

/* ── Bloc activité / article ── */
.service_bloc {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--log-fond);
  border: 1.5px solid var(--log-border);
  border-radius: 12px;
  padding: 16px;
}

.service_bloc_title {
  font-size: 1em;
  font-weight: 700;
  color: var(--log-primary);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Ligne de deux inputs côte à côte ── */
.service_row_inputs {
  display: flex;
  gap: 14px;
}

.service_row_inputs .service_form_group {
  flex: 1;
}

/* ── Bouton secondaire (ajouter activité/article) ── */
.service_btn_container {
  display: flex;
  justify-content: flex-end;
}

.btn_service_add {
  background: transparent;
  border: 1.5px solid var(--log-primary);
  color: var(--log-primary);
  font-weight: 700;
  font-size: 0.9em;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn_service_add:hover {
  background: var(--log-primary);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(58, 111, 67, 0.25);
}

/* ── Bouton principal de soumission ── */
.service_submit {
  display: flex;
  justify-content: center;
  padding-top: 4px;
}

.btn_service_submit {
  background: var(--log-gradient-cta);
  color: #fff;
  font-weight: 700;
  font-size: 1em;
  padding: 12px 36px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.25);
  transition: all 0.3s ease;
  letter-spacing: 0.4px;
}

.btn_service_submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(58, 111, 67, 0.35);
}

.btn_service_submit:active {
  transform: translateY(1px);
}
</style>