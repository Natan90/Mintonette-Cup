<template>
  <nav class="barre-nav" :class="{ blueBar: !isInIndex }">
    <router-link to="/">
      <img class="pointer" src="../images/logo.png" alt="logo" id="logo" />
    </router-link>
    <div class="routeurLink">
      <router-link to="/PrestatairePublic" class=""
        ><span class="pointer optionNav">Prestataire(mode public)</span></router-link
      >
      <router-link to="/PrestatairePresta" class=""
        v-if="userStore.isPresta"><span class="pointer optionNav">Prestataire (mode presta)</span></router-link
      >
      <router-link to="/admin" class="">
      <span class="pointer optionNav">Vue administrateur</span>
    </router-link>
    <router-link to="/Panier"> <span class="pointer optionNav">Panier</span> </router-link>  
      <!-- SI ON EST EN ANGLAIS IL NE FAUT PRESENTER QUE LE FRANCAIS ET INVERSEMENT  -->
      <span>
        <button @click="changeLanguage('fr')" class="langue pointer optionNav"><span>Fr</span></button>/
        <button @click="changeLanguage('en')" class="langue pointer optionNav"><span>En</span></button>
      </span>
      <span v-if="!userStore.isConnected"
        ><strong
          ><router-link to="/utilisateur/connexion"><span class="pointer optionNav">{{
            $t("user.buttonConnexion")
          }}</span></router-link>
          /
          <router-link to="/utilisateur/inscription"><span class="pointer optionNav">{{
            $t("user.buttonInscription")
          }}</span></router-link></strong
        ></span
      >
      <!-- <span v-else><span class="pointer optionNav">Mon profil / Se déconnecter (menu burger)</span></span> -->
      <span v-else class="user-buttons">
        <button class="pointer optionNav" @click="toggleBloc">Profil</button>

        <div class="dropdown-block" :class="{ open: showBloc }">
          <div>
              <router-link class="pointer optionNav">Voir son profil</router-link> <!-- S'il est prestataire -->
          </div>
          <div>
            <router-link to="/utilisateur/modifier" class="pointer optionNav">Paramètres</router-link>
          </div>
          <div>
            <button class="pointer optionNav logout-btn" @click="handleLogout">Se déconnecter</button>
          </div>
        </div>
      </span>

    </div>
  </nav>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isInIndex = ref(route.path === "/");
const showBloc = ref(false);

watch(
  () => route.path,
  (newPath) => {
    isInIndex.value = newPath === "/";
  }
);

function toggleBloc() {
  showBloc.value = !showBloc.value;
}

function handleLogout() {
  userStore.logout();
  showBloc.value = false;
  router.push({ name: 'Home' });
}

function changeLanguage(lang) {
  locale.value = lang;
  localStorage.setItem("lang", lang);
}

const savedLang = localStorage.getItem("lang");
if (savedLang) locale.value = savedLang;
</script>

<style>
body {
  margin: 0;
  height: 100vh;
  top: 0;
}
</style>

<style scoped>
.barre-nav {
  padding: 0;
  background: linear-gradient(to bottom, #000000, transparent);
  color: white;
  display: flex;
  align-items: center;
  font-size: 1.2em;
  width: 100%;
}

.barre-nav.blueBar {
  background: none;
  background-color: #00167a;
}

#logo {
  height: 100px;
}

.routeurLink{
  display: flex;
  justify-content: space-evenly;
  width: calc(100% - 100px);
  height: 1.2em;
}

.log {
  align-content: center;
}

.log span {
  padding: 0px 25px;
}

.langue {
  background: transparent;  
  border: none;                         
  color: white;     
  font-size: 20px;       
}

/* router-link en vue = a en HTML */
.barre-nav a {
  text-decoration: none;
  color: white;
  cursor: default;
}

.optionNav:hover {
  color: #ffff00;
}

.user-buttons {
  position: relative;
  display: inline-block;
}

.dropdown-block {
  position: absolute;
  top: 35px;
  right: 0;
  background-color: #00167a;
  color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  overflow: hidden;
  max-height: 0;
  padding: 0;
  transition: max-height 0.3s ease, padding 0.3s ease;
  width: 200px;
  z-index: 1000;
}

.dropdown-block router-link {
  display: flex;       /* chaque lien prend toute la largeur du bloc */
  flex-direction: column;
  margin-bottom: 0.5rem; /* espace entre les liens */
  color: white;
  text-decoration: none;
  padding: 0.5rem 0;
  border-radius: 3px;
}

.logout-btn {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 0;
  border-radius: 3px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 1rem;
}

.logout-btn:hover {
  color: #ffff00;
}

.dropdown-block.open {
  max-height: 300px;
  padding: 1rem;
}


</style>
