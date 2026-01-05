<template>
  <nav class="barre-nav" :class="{ blueBar: !isInIndex }">
    <!-- Logo -->
    <router-link :to="{ name: 'Home', params: { lang: locale } }">
      <img src="../images/logo.png" class="logo pointer" alt="logo" />
    </router-link>

<<<<<<< HEAD
    <div class="optionNav">

      <router-link :to="{ name: 'ShowPrestataire', params: { lang: locale } }" 
        class="boutonNav">
        <span class="pointer">Prestataire (mode public)</span>
      </router-link>
=======
    <div class="routeurLink">
      <!-- <router-link
        :to="{ name: 'ShowPrestataire', params: { lang: locale } }">
        <span class="pointer optionNav">Prestataire (mode public)</span>
      </router-link> -->
>>>>>>> b081f84ae974b62fa47c78c584d37f5c61e91ba4

      <router-link v-if="utilisateur.ispresta" :to="{name: 'EditPrestataire',params: { id: userStore.userId, lang: locale }}"
        class="boutonNav">
        <span class="pointer">Edit Prestataire (mode presta)</span>
      </router-link>

      <router-link v-else :to="{name: 'AddPrestataire',params: { id: userStore.userId, lang: locale }}" 
        class="boutonNav">
        <span class="pointer">Become Prestataire (mode presta)</span>
      </router-link>

      <router-link :to="{ name: 'Evenement', params: { lang: locale } }"
        class="boutonNav">
        <span class="pointer">Vue administrateur</span>
      </router-link>

      <div class="langue">
        <div v-if="locale === 'en'" @click="changeLanguage('fr')"  class="boutonNav pointer">
          <span>Français</span>
        </div>
        <div v-else-if="locale === 'fr'" @click="changeLanguage('en')"  class="boutonNav pointer">
          <span>English</span>
        </div>
      </div>

      <div v-if="!userStore.isConnected" class="partieProfil">
        <router-link :to="{ name: 'Connexion_utilisateur', params: { lang: locale } }"
           class="boutonNav">
          <span class="pointer">{{ $t("user.buttonConnexion")}}</span>
        </router-link>

        <div class="default">
          /
        </div>

        <router-link :to="{ name: 'Inscription_utilisateur', params: { lang: locale } }"
           class="boutonNav">
          <span class="pointer">{{$t("user.buttonInscription")}}</span>
        </router-link>
      </div>

      <div v-else class="userButtons">

        <img v-if="userProfilePhoto" :src="userProfilePhoto" alt="Photo de profil" class="profile-photo pointer" />
        
        <div v-else class="profile-placeholder pointer">
          <span>{{ userInitials }}</span>
        </div>

          <div class="optionsUser">

            <router-link :to="{ name: 'ShowAccount', params: { lang: locale, userId: userStore.userId } }" 
              class="pointer optionProfil">
              <span>Mon profil</span>
            </router-link>

            <router-link v-if="utilisateur.ispresta" :to="{name: 'EditPrestataire',params: { id: userStore.userId, lang: locale }}"
              class="pointer optionProfil">
              <span class="pointer">Mes prestations</span>
            </router-link>

            <router-link :to="{ name: 'Panier', params: { lang: locale } }"
              class="pointer optionProfil">
              <span class="pointer">Panier</span>
            </router-link>

          <div class="optionProfil pointer" @click="handleLogout">
            <span>Se déconnecter</span>
          </div>

        </div>
    </div>
  </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isInIndex = ref(route.name === "Home");
const showBloc = ref(false);
const showMiniCart = ref(false);
const cartSeats = ref([]);
const userProfilePhoto = ref(null);
const userInitials = ref("");
const utilisateur = ref([]);

const loadProfilePhoto = async () => {
  if (userStore.isConnected) {
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/utilisateur/show/${userStore.userId}`
      );
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
onMounted(async () => {
  loadProfilePhoto();
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

function toggleBloc() {
  showBloc.value = !showBloc.value;
}

function toggleMiniCart() {
  showMiniCart.value = !showMiniCart.value;
  if (showMiniCart.value) fetchCart();
}

function handleLogout() {
  userStore.logout();
  showBloc.value = false;
  router.push({ name: "Home" });
}

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

async function fetchCart() {
  try {
    const res = await axios.get("http://localhost:3000/gradin/panier/show");
    cartSeats.value = res.data;
  } catch (err) {
    console.error(err);
  }
}

async function getValuesUser() {
  try {
    const res = await axios.get(`http://localhost:3000/admin/utilisateur/show/${userStore.userId}`)
    utilisateur.value = res.data;

  } catch (err) {
    console.error(err);
  }
}


</script>

<style scoped>
.barre-nav {
  padding: 0;
  color: white;
  display: flex;
  align-items: center;
  font-size: 1.2em;
  width: 100%;
}

.barre-nav.blueBar {
  background-color: #00167a;
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

.barre-nav a {
  text-decoration: none;
  color: white;
  cursor: default;
}

.boutonNav {
  display: flex;
  align-items: center;      /* centrage vertical */
  justify-content: center;  /* centrage horizontal */

  height: 100%;
  /* cursor: pointer; */
}

.boutonNav:hover {
  color: #ffff00;
}

a span{
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

.partieProfil div{
  display: flex;
  align-items: center;
}

.default{
  cursor: default;
  height: 100%;
}

.partieProfil{
  height: 100%;
  display: flex;
  flex-direction:row;
  align-items: center;
  gap: 4px;
  margin-right: 0.6em;
}

.userButtons {
  width: 17%;
  margin-right: 0.6em;
}

.userButtons:hover{

  .optionsUser{
    height: 300%;
    margin-right: 1em;

    background-color: blue;

    transition: var(--transition-fast);
  }

  .optionProfil{
    height: 2.5em;
    width: 100%;

    font-size: 1em;

    transition: var(--transition-fast);
  }
}

.primaire{
  height: 100%;
  width: 100%;

  text-align: center;
  align-content: center;
}

.optionsUser{
  height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: blue;
}

.optionProfil {
  height: 0;
  width: 100%;

  font-size: 0;
  text-indent: 0.5em;
  align-content: center;
}

.optionProfil:hover {
  text-indent: 0.8em;
  background-color: var(--jaune-logo);
  color: black;
  transition: var(--transition-fast);

  cursor: pointer;
}

.cartWrapper {
  display: inline-block;
  position: relative;
}

.miniCart {
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background: white;
  color: black;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.miniCart h4 {
  margin-top: 0;
}

.miniCart ul {
  padding-left: 16px;
  margin: 8px 0;
}

.miniCart button {
  margin-top: 8px;
  width: 100%;
  padding: 6px;
}
.textePanier {
  color: black;
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

.profile-photo:hover {
  transform: scale(1.1);
  border-color: var(--jaune-logo);
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

.profile-placeholder:hover {
  transform: scale(1.1);
  border-color: var(--jaune-logo);
}

.user-buttons {
  position: relative;
  display: inline-block;
}
</style>
