<template>
  <nav class="barre-nav" :class="{ blueBar: !isInIndex }">
    <!-- Logo -->
    <router-link :to="{ name: 'Home', params: { lang: locale } }" class="routeur_logo">
      <img :src="isInIndex ? logo : logo_rose" class="logo pointer" alt="logo" />
    </router-link>

    <div class="optionNav">
      <div class="optionCenter">
        <!-- <router-link :to="{ name: 'ShowPrestataire', params: { lang: locale } }" 
          class="boutonNav">
          <span class="pointer">Prestataire (mode public)</span>
        </router-link> -->
        <div
          v-if="isInIndex"
          @click="scrollToSection('Carte')"
          class="boutonNav pointer">
          {{ $t("barreNav.carte") }}
        </div>

        <div
          v-if="isInIndex"
          @click="scrollToSection('Info')"
          class="boutonNav pointer">
          {{ $t("barreNav.aPropos") }}
        </div>
        <div
          v-if="isInIndex"
          @click="scrollToSection('liste_prestataires')"
          class="boutonNav pointer">
          {{ $t("barreNav.prestataire") }}
        </div>

        <div @click="scrollToSection('footer')" class="boutonNav pointer">
          {{ $t("barreNav.partenaire") }}
        </div>
        <!-- <router-link
          v-if="utilisateur.ispresta"
          :to="{
            name: 'EditPrestataire',
            params: { id: userStore.userId, lang: locale },
          }"
          class="boutonNav">
          <span class="pointer">Edit Prestataire (mode presta)</span>
        </router-link> -->

        <div class="langue">
          <div
            v-if="locale === 'en'"
            @click="changeLanguage('fr')"
            class="boutonNav pointer">
            <span>French</span>
          </div>
          <div
            v-else-if="locale === 'fr'"
            @click="changeLanguage('en')"
            class="boutonNav pointer">
            <span>Anglais</span>
          </div>
        </div>

        <div @click="goToReceptionBox()" class="boutonNav pointer">
        {{ $t("barreNav.boiteReception") }}
        </div>
      </div>

      <div v-if="!isLoggedIn" class="partieProfil">
        <router-link
          :to="{ name: 'Connexion_utilisateur', params: { lang: locale } }"
          class="boutonNav connect">
          <span class="pointer">{{ $t("user.buttonConnexion") }}</span>
        </router-link>

        <div class="default">/</div>

        <router-link
          :to="{ name: 'Inscription_utilisateur', params: { lang: locale } }"
          class="boutonNav connect">
          <span class="pointer">{{ $t("user.buttonInscription") }}</span>
        </router-link>
      </div>

      <div v-else class="userButtons pointer">
        <div class="photoUser">
          <img
            v-if="userProfilePhoto"
            :src="userProfilePhoto"
            alt="Photo de profil"
            class="profile-photo" />

          <div v-else class="profile-placeholder pointer">
            <span>{{ userInitials }}</span>
          </div>
        </div>

        <div class="optionsUser">
          <router-link
            v-if="userStore.userId"
            :to="{
              name: 'ShowAccount',
              params: { lang: locale, userId: userStore.userId },
            }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">{{ $t("barreNav.profil.profil") }}</span>
          </router-link>
          <router-link
            v-if="admin && userStore.userId && userStore.userId == 1"
            :to="{ name: 'Evenement', params: { lang: locale } }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">{{ $t("barreNav.profil.evenement") }}</span>
          </router-link>
          <router-link
            v-if="utilisateur.ispresta"
            :to="{
              name: 'EditPrestataire',
              params: { id: userStore.userId, lang: locale },
            }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">{{ $t("barreNav.profil.prestation") }}</span>
          </router-link>

          <router-link
            v-if="userStore.userId != 1"
            :to="{ name: 'Panier', params: { lang: locale } }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">{{ $t("barreNav.profil.panier") }}</span>
          </router-link>

          <router-link
            v-if="userStore.userId != 1"
            :to="{ name: 'MesBillets', params: { lang: locale } }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">{{ $t("barreNav.profil.billet") }}</span>
          </router-link>

          <div
            class="optionProfil optionProfil"
            :class="{ blueBar: !isInIndex }"
            @click="handleLogout">
            <span>{{ $t("barreNav.profil.logOut") }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useUtilisateurAuthStore } from "@/services/utilisateur.service.js";
import { useAdminAPIStore } from "@/services/admin.service";

import logo from "../images/logo.png";
import logo_rose from "../images/logo_rose.png";


const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const userAuthStore = useUtilisateurAuthStore();
const adminAPIStore = useAdminAPIStore();

const isInIndex = ref(route.name === "Home");
const userProfilePhoto = ref(null);
const userInitials = ref("");
const utilisateur = ref({});
const admin = ref(false);

const isLoggedIn = computed(() => !!userStore.token || !!localStorage.getItem('jwt'));

onMounted(() => {
  loadProfilePhoto();
  isadmin();
});

watch(
  () => route.name,
  (newName) => {
    isInIndex.value = newName === "Home";
    if (newName === "Home" || newName === "ShowAccount") {
      loadProfilePhoto();
    }
  }
);

/**
* Fait défiler la page vers une section HTML en fonction de son ID.
* @param {string} id - ID de l'élément HTML cible
*/
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Charge la photo de profil de l'utilisateur connecté.
 * - Si une photo existe : l'affiche en base64
 * - Sinon : génère les initiales prénom + nom
*/
async function loadProfilePhoto() {
  if (userStore.isConnected) {
    try {
      const response = await adminAPIStore.GetCurrentUser();

      const userData = response.data;

      if (userData.photo_profil_utilisateur) {
        userProfilePhoto.value = `data:image/jpeg;base64,${userData.photo_profil_utilisateur}`;
      } else {
        const prenom = userData.prenom_utilisateur || "";
        const nom = userData.nom_utilisateur || "";
        userInitials.value = (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  }
};

/**
 * Vérifie si l'utilisateur (id 1) est administrateur.
 * Met à jour la variable reactive admin.
*/
async function isadmin() {
  try {
    const res =await adminAPIStore.GetUtilisateurById(1);

    admin.value = res.data.isadmin;
  } catch (err) {
    console.log(err);
  }
}
/**
 * Redirige l'utilisateur vers la page de boîte de réception (Mailbox).
*/
function goToReceptionBox() {
  router.push({
    name: "Mailbox"
  })
}
/**
 * Déconnecte l'utilisateur et redirige vers la page Home.
*/
async function handleLogout() {
  try {
    userStore.logout();
    router.push({ name: "Home" });
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err);
  }
}

/**
 * Change la langue de l'application.
 * - Met à jour l'URL avec la nouvelle langue
 * - Sauvegarde la langue dans le localStorage
 * - Met à jour i18n
 * @param {string} lang - Code langue (ex: 'fr', 'en')
*/
function changeLanguage(lang) {
  // Ça permet de garder déjà ce qu'il y a dans l'URL et d'ajouter la langue
  const newParams = { ...route.params, lang };
  router.push({
    name: router.name,
    params: newParams,
    query: route.query,
    hash: route.hash,
  });
  locale.value = lang;
  localStorage.setItem("lang", lang);
}

const savedLang = localStorage.getItem("lang");
if (savedLang) locale.value = savedLang;

// onMounted(async () => {
//   window.addEventListener("scroll", handleScroll);
//   try {
//     await getValuesEvenement();
//     await getValuesUser();
//   } catch (err) {
//     console.error(err);
//   }
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("scroll", handleScroll);
// });
</script>

<style scoped>
.barre-nav {
  padding: 0;
  color: white;
  display: flex;
  align-items: center;
  font-size: 1.2em;
  width: 100%;

  left: 0;
  right: 0;
  height: 100px;
}

.blueBar {
  background-color: var(--primary-color);
}

.logo {
  height: var(--barreNav-height);
}

.optionNav {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 100px);
  height: 50%;
  margin-left: 100px;
  font-weight: 500;
}

.optionCenter{
  display: flex;
  width: 80%;
  justify-content: center;
  gap: 40px;
}

.barre-nav a {
  text-decoration: none;
  color: white;
  cursor: default;
}

.boutonNav {
  display: flex;
  align-items: center; /* centrage vertical */
  justify-content: center; /* centrage horizontal */

  height: 100%;
}

.boutonNav:hover {
  color: var(--rose-hover);
}

a span {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
}

.langue {
  display: flex;
  flex-direction: row;

  gap: 4px;
  font-size: 20px;
  font-weight: 500;
}

.partieprofil div {
  display: flex;
  align-items: center;
}

.default {
  cursor: default;
  height: 100%;
}

.partieProfil {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 4px;
  margin-right: 0.6em;

}

.userButtons {
  width: 8.5em;
  max-width: 17%;

  margin-right: 0.6em;
}

.userButtons:hover {
  .profile-placeholder,
  .profile-photo {
    transform: scale(1.1);
    border-color: var(--rose-logo);
  }

  .optionProfil {
    transform: scaleX(1);
    height: 2.5em;
    font-size: 1em;
  }
}

.optionsUser {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.optionProfil {
  width: 100%;

  transform: scaleX(0);
  transform-origin: right;

  font-size: 0;
  text-indent: 0.5em;
  align-content: center;

  transition: var(--transition-fast);
}

.optionProfil:hover {
  text-indent: 0.8em;
  background-color: var(--rose-logo);
  color: black;
}

.photoUser {
  width: 100%;

  padding-bottom: 1em;

  display: flex;
  justify-content: flex-end;
}

.profile-button {
  cursor: pointer;
  display: inline-block;
  position: relative;
}

.profile-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.profile-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  border: 2px solid white;
  transition: all 0.3s ease;
}

@media(max-width:1000px){
  .barre-nav{
    flex-direction: column;
  }

  .logo{
    margin: 0;
    object-fit: contain;
  }

  .routeur_logo{
    max-height: 100px;
    display: flex;
    justify-content: center;
  }

  .routeur_logo,
  .optionNav,
  .boutonNav:not(.connect),
  .optionCenter{
    flex-direction: column;
    background-color: var(--primary-color);
    width: 100%;
    margin: 0;
    gap: 0;
  }

  .routeur_logo:hover,
  .boutonNav:not(.connect):hover{
    background-color: var(--rose-logo);
    color: black;
    transition: var(--transition-fast);
  }

  .routeur_logo:hover{
    transform: scale(1.02);
  }  

  .boutonNav:not(.connect):hover{
    padding-left: 10px;
  }

  .partieProfil{
    background-color: var(--primary-color);
    justify-content: center;
    width: 100%;
  }

  .partieProfil:hover{
    transition: var(--transition-fast);
    background-color: var(--rose-logo);
    color: black;
    span{
      color: black;
    }
  }

  .partieProfil span:hover{
    color: grey;
    font-size: bold;
    transition: var(--transition-fast);
  }


}


</style>
