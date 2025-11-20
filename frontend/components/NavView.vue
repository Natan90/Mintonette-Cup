<template>
  <nav class="barre-nav" :class="{ blueBar: !isInIndex }">
    <router-link to="/">
      <img src="../images/logo.png" alt="logo" id="logo" />
    </router-link>
    <div class="routeurLink">
      <router-link to="/" class="">Home</router-link><br />
      <router-link to="/PrestatairePublic" class=""
        >Prestataire(mode public)</router-link
      >
      <router-link to="/PrestatairePresta" class=""
        >Prestataire (mode presta)</router-link
      >
      <!-- SI ON EST EN ANGLAIS IL NE FAUT PRESENTER QUE LE FRANCAIS ET INVERSEMENT  -->
      <span>
        <button @click="changeLanguage('fr')" class="langue pointer">Fr</button>/
        <button @click="changeLanguage('en')" class="langue pointer">En</button>
      </span>
      <span v-if="!userStore.isConnected"
        ><strong
          ><router-link to="/utilisateur/connexion">{{
            $t("user.buttonConnexion")
          }}</router-link>
          /
          <router-link to="/utilisateur/inscription">{{
            $t("user.buttonInscription")
          }}</router-link></strong
        ></span
      >
      <span v-else>Mon profil / Se déconnecter (menu burger)</span>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const isInIndex = ref(route.path === "/");

watch(
  () => route.path,
  (newPath) => {
    isInIndex.value = newPath === "/";
  }
);

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
  display: flex;
  justify-content: space-between;
  color: white;
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
}

.barre-nav a:hover {
  color: #ffff00;
}
</style>
