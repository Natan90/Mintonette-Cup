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
        <button @click="addService(oneService)">
          S'inscrire
        </button>
      </div>

    </div>
  </div>
  <div class="back-arrow pointer" @click="goBack">
    &#8592; Retour
  </div>
  <div class="main_container">
    <div class="bloc_texte">
      <h1 class="page_title">
        {{ $t('adminPage.prestataire.service.title') }}
      </h1>
      <p v-html="$t('adminPage.prestataire.service.descri', { nom_prestataire: onePresta.nom_prestataire })"
        class="backgroundBorderL page_subtitle"></p>

    </div>

    <div class="textAndFiltre paddingSides">
      <p class="nb_presta valid" v-if="services.filter(p => p.activate).length > 0">
        {{$t('adminPage.prestataire.service.nb_services', {
          count: services.filter(p => p.activate).length,
          gotS: services.filter(p => p.activate).length > 1 ? 's' : ''
        })}}
      </p>
      <p class="nb_presta toValidate" v-else>
        {{ $t('adminPage.prestataire.service.nb_servicesVide') }}
      </p>
      <p>
      <div class="filtre">
        <label for="triAlpha">{{ $t('adminPage.tri.nom') }}</label>
        <select id="triAlpha" v-model="adminStore.services">
          <option value="az">{{ $t('adminPage.tri.az') }}</option>
          <option value="za">{{ $t('adminPage.tri.za') }}</option>
          <option value="activer">{{ $t('adminPage.tri.activeFirst') }}</option>
          <option value="desactiver">{{ $t('adminPage.tri.inactiveFirst') }}</option>
        </select>
      </div>
      </p>
    </div>
    <div class="backgroundBorderL message valid" v-if="activate">
      <p v-html="$t('adminPage.prestataire.service.messageActiver', { nomService: desactivateService?.nom_service })">
      </p>
      <span class="modal-close" @click="closeMessageActivate">&times;</span>
    </div>

    <div class="backgroundBorderL message refus" v-else-if="desactivate">
      <p
        v-html="$t('adminPage.prestataire.service.messageDesactiver', { nomService: desactivateService?.nom_service })">
      </p>
      <span class="modal-close" @click="closeMessageDesactivate">&times;</span>
    </div>

    <div class="backgroundBorderL message suppr" v-else-if="deleting">
      <p v-html="$t('adminPage.prestataire.service.messageSuppr', { nomService: desactivateService?.nom_service })"></p>
      <span class="modal-close" @click="closeMessageSuppr">&times;</span>
    </div>

    <section>
      <div class="container">
        <div class="container_cards">
          <p class="title_presta">{{ onePresta.nom_prestataire }}</p>
          <!-- <img src=""> -->
          <div class="description" v-html="onePresta.descri_prestataire">
          </div>
          <p>Capacité : <span>{{ Number(onePresta.nb_participants) }}</span></p>
          <p>Tarif : <span>{{ onePresta.tarif_prestataire }}</span></p>
          <div class="contact_presta">
            <p class="contact_title"><b>Contact</b></p>
            <p>{{ onePresta.mail_prestataire }}</p>
            <p>{{ onePresta.tel_prestataire }}</p>
          </div>
          <p>{{ onePresta.prenom_utilisateur }} {{ onePresta.nom_utilisateur }}
          </p>
        </div>
        <div>
          <div class="services_container">
            <p>
              <b>
                {{ $t('prestataireInfo.services', { gotS: services.length > 1 ? 's' : '' }) }}
              </b>
            </p>
            <ul>
              <li v-for="(item, index) in servicesFiltres" :key="index" class="service_item"
                style="padding-bottom: 10px;">
                <div class="serviceWithButtons">
                  {{ item.nom_service }}
                  <span v-if="item.activate" class="active-icon" title="Actif">&#10003;</span>
                  <span v-else class="inactive-icon" title="Inactif">&#10007;</span>
                  <span class="diff_button">
                    <button class="btn_info" @click="getOneService(item)">
                      Voir
                    </button>
                    <button class="btn_activate" v-if="!item.activate" @click="activateService(item)">
                      Activer
                    </button>
                    <button class="btn_desactivate" v-else @click="desactivatingService(item)">
                      Désactiver
                    </button>
                    <button class="btn_supprimer">
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
      <button @click="goToEditPrestataire"
        v-if="userStore.isConnected && onePresta.ispresta && userStore.prestaId === idPresta">
        Modifier mon profil
      </button>
    </div>
  </div>

  <Footer></Footer>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from 'vue-router';
import { useNavigationStore } from "@/stores/navigation";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";



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
  nom_service: '',
  titre_service: { fr: '', en: '' },
  descri_service: { fr: '', en: '' },
  besoin: { fr: '', en: '' },
  prix: 0,
  nb_participants: 0,
  visible_public: true
});

const titre_service = ref('');
const descri_service = ref('');
const besoin_service = ref('');


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
  nb_participants: 0,
  tarif_prestataire: "",
  mail_prestataire: "",
  tel_prestataire: "",
  prenom_utilisateur: "",
  nom_utilisateur: ""
});

const services = ref([]);
const idPresta = route.params.id;

watch(() => locale.value,
  (newLang) => {
    updateDescription();
  })

onMounted(async () => {
  try {
    await getValuesPrestataire(idPresta);
    if (!adminStore.services) adminStore.services = "az";
  } catch (err) {
    console.error(err);
  }
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

    if (adminStore.services === "za")
      return nomB.localeCompare(nomA);

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
    params: { id: idPresta }
  });
}


//==========================
//= Async functions presta =
//==========================
async function getValuesPrestataire() {
  try {
    const res = await axios.get(`http://localhost:3000/prestataire/show/${idPresta}`);
    onePresta.value = res.data.prestataire;

    services.value = res.data.services;

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

async function desactivatingService(service) {
  desactivate.value = true;
  actionsService(service);
}

async function activateService(service) {
  activate.value = true;
  actionsService(service);
}

async function actionsService(service) {
  try {
    desactivateService.value = service;

    const res = await axios.patch(`http://localhost:3000/prestataire/activateService/${service.id_service}`);

    const index = services.value.findIndex(s => s.id_service === service.id_service);
    if (index !== -1) {
      services.value[index].activate = !services.value[index].activate;
    }

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

async function getOneService(service) {
  showService.value = true;
  try {
    const res = await axios.get(`http://localhost:3000/prestataire/service/show/${service.id_service}`)
    oneService.value = res.data;
    console.log("Res.data" ,res.data);


    console.log(oneService)

    updateDescription();

  } catch (err) {
    console.error(err);
  }
}

async function addService(service) {
  if (!userStore.userId) {
    console.error("Utilisateur non connecté !");
    return;
  }

  try {
    const res = await axios.post(`http://localhost:3000/panier/addService`, {
      id_user: userStore.userId,
      service_id: service.id_service,
      quantite: 1
    });

    showService.value = false;
  } catch (err) {
    console.error("Erreur lors de l'ajout au panier :", err);
  }
}


function updateDescription() {
  if (oneService.value) {
    const titre = oneService.value.titre_service;
    const descri = oneService.value.descri_service;
    const besoin = oneService.value.besoin;

    titre_service.value = titre[locale.value]?.texte || '';
    descri_service.value = descri[locale.value]?.texte || '';
    besoin_service.value = besoin[locale.value] || '';
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
