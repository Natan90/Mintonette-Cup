<template>
  <NavView />
  <div class="back-arrow pointer" @click="goBack">
    &#8592; Retour
  </div>
  <div class="bloc_texte">
    <h1 class="page_title">
      {{ $t('adminPage.prestataire.show.title') }}
    </h1>
    <p v-html="$t('adminPage.prestataire.show.descri', { nom_prestataire: onePresta.nom_prestataire })"
      class="backgroundBorderL page_subtitle"></p>

  </div>

  <div class="textAndFiltre">
            <!-- <p class="nb_presta toValidate" v-if="prestataires.filter(p => p.waitingforadmin).length > 0">
                {{ $t('adminPage.prestataire.nb_presta', { count: prestataires.filter(p => p.waitingforadmin).length, 
                    gotS : prestataires.filter(p => p.waitingforadmin).length > 1  ? 's' : '',
                    verbe : prestataires.filter(p => p.waitingforadmin).length > 1  ? 'are' : 'is' }) }}
            </p> -->
            <!-- <p class="nb_presta valid" v-else>
                {{ $t('adminPage.prestataire.nb_prestaVide') }}
            </p> -->
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
            <li v-for="(item, index) in servicesFiltres" :key="index" class="service_item" style="padding-bottom: 10px;">
              <div class="serviceWithButtons">
                {{ item.nom_service }}
                <span class="diff_button">
                  <button class="btn_activate" v-if="item.activate">
                    Activer
                  </button>
                  <button class="btn_desactivate" v-else>
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



  <Footer></Footer>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from 'vue-router';
import { useNavigationStore } from "@/stores/navigation";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";


const route = useRoute();
const router = useRouter();
const navStore = useNavigationStore();
const adminStore = useAdminStore();


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

</script>

<style>
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
</style>
