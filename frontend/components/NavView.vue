<template>
  <nav class="barre-nav" :class="{ blueBar: !isInIndex }">
    <router-link to="/">
      <img class="pointer" src="../images/logo.png" alt="logo" id="logo" />
    </router-link>
    <div class="routeurLink">
      <router-link to="/PrestatairePublic">
        <span class="pointer optionNav">Prestataire(mode public)</span>
      </router-link>
      <router-link to="/PrestatairePresta" v-if="userStore.isPresta">
        <span class="pointer optionNav">Prestataire (mode presta)</span>
      </router-link>
      <router-link to="/admin">
        <span class="pointer optionNav">Vue administrateur</span>
      </router-link>

      <router-link to="/gradins/reservationNord">
        <span class="pointer optionNav">gradin</span>
      </router-link>
      <span>
        <button @click="changeLanguage('fr')" class="langue pointer optionNav">
          <span>Fr</span></button
        >/
        <button @click="changeLanguage('en')" class="langue pointer optionNav">
          <span>En</span>
        </button>
      </span>

      <div class="cartWrapper" @click.stop v-if="userStore.isConnected">
        <p class="pointer optionNav" @click="toggleMiniCart">
          Panier ({{ cartSeats.length }})
        </p>
        <div v-if="showMiniCart" class="miniCart">
          <h4>Panier</h4>
          <p v-if="!cartSeats.length">Votre panier est vide.</p>
          <ul v-else>
            <li
              v-for="seat in cartSeats"
              :key="seat.numero_colonne + seat.numero_ligne">
              {{ seat.numero_colonne }}{{ seat.numero_ligne }}
            </li>
          </ul>
          <p v-if="cartSeats.length">Total :{{ cartTotal }} €</p>
          <router-link to="/Panier">
            <span class="pointer textePanier">Panier</span>
          </router-link>
        </div>
      </div>

      <span v-if="!userStore.isConnected">
        <strong>
          <router-link to="/utilisateur/connexion">
            <span class="pointer optionNav">{{
              $t("user.buttonConnexion")
            }}</span> </router-link
          >/
          <router-link to="/utilisateur/inscription">
            <span class="pointer optionNav">{{
              $t("user.buttonInscription")
            }}</span>
          </router-link>
        </strong>
      </span>

      <span v-else class="user-buttons">
        <button class="pointer optionNav" @click="toggleBloc">Profil</button>
        <div class="dropdown-block" :class="{ open: showBloc }">
          <div>
            <router-link class="pointer optionNav">Voir son profil</router-link>
          </div>
          <div>
            <router-link to="/utilisateur/modifier" class="pointer optionNav"
              >Paramètres</router-link
            >
          </div>
          <div>
            <button class="pointer optionNav logout-btn" @click="handleLogout">
              Se déconnecter
            </button>
          </div>
        </div>
      </span>
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

const isInIndex = ref(route.path === "/");
const showBloc = ref(false);
const showMiniCart = ref(false);
const cartSeats = ref([]);

watch(
  () => route.path,
  (newPath) => {
    isInIndex.value = newPath === "/";
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

const cartTotal = computed(() =>
  cartSeats.value.reduce((sum, seat) => {
    if (["I", "H", "G"].includes(seat.numero_colonne)) return sum + 25;
    if (["F", "E", "D"].includes(seat.numero_colonne)) return sum + 18;
    return sum + 12;
  }, 0)
);

function goToFullCart() {
  router.push("/Panier");
}

onMounted(fetchCart);

document.addEventListener("click", () => (showMiniCart.value = false));
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

#logo {
  height: 100px;
}

.routeurLink {
  display: flex;
  justify-content: space-evenly;
  width: calc(100% - 100px);
  height: 1.2em;
}

.langue {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
}

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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-height: 0;
  padding: 0;
  transition: max-height 0.3s ease, padding 0.3s ease;
  width: 200px;
  z-index: 1000;
}

.dropdown-block router-link {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
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
</style>
