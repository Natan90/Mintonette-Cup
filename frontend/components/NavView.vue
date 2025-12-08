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
      <router-link to="/utilisateur" class="">
      <span class="pointer optionNav" v-if="userStore.userId === 1">Vue administrateur</span>
    </router-link>
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
      <span v-else><button class="pointer optionNav" @click="userStore.logout">Se déconnecter</button></span>
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
</style>
