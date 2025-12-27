<template>
  <nav class="barre-nav" :class="{ blueBar: !isInIndex }">
    <!-- Logo -->
    <router-link :to="{ name: 'Home', params: { lang: locale } }">
      <img class="pointer" src="../images/logo.png" alt="logo" id="logo" />
    </router-link>

    <div class="routeurLink">
      <router-link
        v-if="isInIndex"
        :to="{ name: 'Home', params: { lang: locale }, hash: '#filtre_presta' }"
      >
        <span class="pointer optionNav">Section prestataire</span>
      </router-link>

      <router-link
        :to="{ name: 'PrestatairePublic', params: { lang: locale } }"
      >
        <span class="pointer optionNav">Prestataire (mode public)</span>
      </router-link>

      <router-link
        v-if="userStore.isPresta"
        :to="{ name: 'EditPrestataire', params: { id: userStore.userId, lang: locale } }"
      >
        <span class="pointer optionNav">Edit Prestataire (mode presta)</span>
      </router-link>
      <router-link
        v-else
        :to="{ name: 'AddPrestataire', params: { id: userStore.userId, lang: locale } }"
      >
        <span class="pointer optionNav">Become Prestataire (mode presta)</span>
      </router-link>

      <router-link :to="{ name: 'admin', params: { lang: locale } }">
        <span class="pointer optionNav">Vue administrateur</span>
      </router-link>

      <span>
        <button @click="changeLanguage('fr')" class="langue pointer optionNav">
          Fr
        </button>/
        <button @click="changeLanguage('en')" class="langue pointer optionNav">
          En
        </button>
      </span>

      <span v-if="!userStore.isConnected">
        <strong>
          <router-link
            :to="{ name: 'Connexion_utilisateur', params: { lang: locale } }"
          >
            <span class="pointer optionNav">{{ $t("user.buttonConnexion") }}</span>
          </router-link> /
          <router-link
            :to="{ name: 'Inscription_utilisateur', params: { lang: locale } }"
          >
            <span class="pointer optionNav">{{ $t("user.buttonInscription") }}</span>
          </router-link>
        </strong>
      </span>

      <span v-else class="user-buttons">
        <div class="profile-button" @click="toggleBloc">
          <img
            v-if="userProfilePhoto"
            :src="userProfilePhoto"
            alt="Photo de profil"
            class="profile-photo pointer"
          />
          <div v-else class="profile-placeholder pointer">
            <span>{{ userInitials }}</span>
          </div>
        </div>
        <div class="dropdown-block" :class="{ open: showBloc }">
          <div>
            <router-link
              :to="{ name: 'ShowAccount', params: { lang: locale } }"
              class="pointer optionProfil"
            >
              Mon profil
            </router-link>

            <router-link
              v-if="userStore.isPresta"
              :to="{ name: 'EditPrestataire', params: { id: userStore.userId, lang: locale } }"
              class="pointer optionProfil"
            >
              Mes prestations
            </router-link>

            <router-link
              :to="{ name: 'Panier', params: { lang: locale } }"
              class="pointer optionProfil"
            >
              Panier
            </router-link>

            <router-link
              :to="{ name: 'ModifyAccount', params: { lang: locale } }"
              class="pointer optionProfil"
            >
              Paramètres
            </router-link>

            <div class="optionProfil" @click="handleLogout">Se déconnecter</div>
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

const isInIndex = ref(route.name === 'Home');
const showBloc = ref(false);
const showMiniCart = ref(false);
const cartSeats = ref([]);
const userProfilePhoto = ref(null);
const userInitials = ref("");

const loadProfilePhoto = async () => {
  if (userStore.isConnected) {
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/show/${userStore.userId}`
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

const cartTotal = computed(() =>
  cartSeats.value.reduce((sum, seat) => {
    if (["I", "H", "G"].includes(seat.numero_colonne)) return sum + 25;
    if (["F", "E", "D"].includes(seat.numero_colonne)) return sum + 18;
    return sum + 12;
  }, 0)
);

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
  font-weight: 500;
}

.langue {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  font-weight: 500;
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
  border-radius: 5px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease, padding 0.3s ease;
  width: 200px;
  z-index: 1000;
}

.dropdown-block.open {
  max-height: 300px;
  border: 1px solid white;
}

.optionProfil {
  width: 100%;
  color: white;
  height: 2.5em;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding-left: 0.5em;
}

.optionProfil:hover {
  padding-left: 0.8em;
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
