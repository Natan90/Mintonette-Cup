<template>
  <nav class="barre-nav" :class="{ blueBar: !isInIndex }">
    <!-- Logo -->
    <router-link :to="{ name: 'Home', params: { lang: locale } }">
      <img src="../images/logo.png" class="logo pointer" alt="logo" />
    </router-link>

    <div class="optionNav">
      <!-- <router-link :to="{ name: 'ShowPrestataire', params: { lang: locale } }" 
        class="boutonNav">
        <span class="pointer">Prestataire (mode public)</span>
      </router-link> -->
      <div
        v-if="isInIndex"
        @click="scrollToSection('Carte')"
        class="boutonNav pointer">
        Carte
      </div>

      <div
        v-if="isInIndex"
        @click="scrollToSection('liste_prestataires')"
        class="boutonNav pointer">
        Prestataires
      </div>
      <div
        v-if="isInIndex"
        @click="scrollToSection('Info')"
        class="boutonNav pointer">
        À propos
      </div>
      <div @click="scrollToSection('footer')" class="boutonNav pointer">
        Nos partenaires
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
          <span>Français</span>
        </div>
        <div
          v-else-if="locale === 'fr'"
          @click="changeLanguage('en')"
          class="boutonNav pointer">
          <span>English</span>
        </div>
      </div>

      <div v-if="!userStore.isConnected" class="partieProfil">
        <router-link
          :to="{ name: 'Connexion_utilisateur', params: { lang: locale } }"
          class="boutonNav">
          <span class="pointer">{{ $t("user.buttonConnexion") }}</span>
        </router-link>

        <div class="default">/</div>

        <router-link
          :to="{ name: 'Inscription_utilisateur', params: { lang: locale } }"
          class="boutonNav">
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
            :to="{
              name: 'ShowAccount',
              params: { lang: locale, userId: userStore.userId },
            }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">Mon profil</span>
          </router-link>
          <router-link
            v-if="admin && userStore.userId == 1"
            :to="{ name: 'Evenement', params: { lang: locale } }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">Événement</span>
          </router-link>
          <router-link
            v-if="utilisateur.ispresta"
            :to="{
              name: 'EditPrestataire',
              params: { id: userStore.userId, lang: locale },
            }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">Mes prestations</span>
          </router-link>

          <router-link
            v-if="userStore.userId != 1"
            :to="{ name: 'Panier', params: { lang: locale } }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">Panier</span>
          </router-link>

          <router-link
            v-if="userStore.userId != 1"
            :to="{ name: 'MesBillets', params: { lang: locale } }"
            class="optionProfil pointer"
            :class="{ blueBar: !isInIndex }">
            <span class="pointer">Mes billets</span>
          </router-link>

          <div
            class="optionProfil optionProfil"
            :class="{ blueBar: !isInIndex }"
            @click="handleLogout">
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
import utilisateursData from "../../backend/database/jsonData/Utilisateur.json";
import axios from "axios";

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isInIndex = ref(route.name === "Home");
const userProfilePhoto = ref(null);
const userInitials = ref("");
const utilisateur = ref([]);
const admin = ref(false);

const loadProfilePhoto = () => {
  if (userStore.isConnected) {
    const userData = utilisateursData.find(
      (u) => u.id_utilisateur === userStore.userId
    );

    if (userData) {
      if (userData.photo_profil_utilisateur) {
        userProfilePhoto.value = `data:image/jpeg;base64,${userData.photo_profil_utilisateur}`;
      } else {
        const prenom = userData.prenom_utilisateur || "";
        const nom = userData.nom_utilisateur || "";
        userInitials.value = (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
      }
      utilisateur.value = userData;
    }
  }
};

// const loadProfilePhoto = async () => {
//   if (userStore.isConnected) {
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/admin/utilisateur/show/${userStore.userId}`
//       );
//       const userData = response.data;

//       if (userData.photo_profil_utilisateur) {
//         userProfilePhoto.value = `data:image/jpeg;base64,${userData.photo_profil_utilisateur}`;
//       } else {
//         const prenom = userData.prenom_utilisateur || "";
//         const nom = userData.nom_utilisateur || "";
//         userInitials.value = (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
//       }
//     } catch (error) {
//       console.error("Erreur lors du chargement du profil:", error);
//     }
//   }
// };
async function isadmin() {
  try {
    const res = await axios.get(
      `http://localhost:3000/admin/utilisateur/show/1`
    );
    admin.value = res.data.isadmin;
    console.log(admin.value + "Je suis la ");
  } catch (err) {
    console.log(err);
  }
}

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

function handleLogout() {
  userStore.logout();
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

// async function getValuesUser() {
//   try {
//     const res = await axios.get(`http://localhost:3000/admin/utilisateur/show/${userStore.userId}`)
//     utilisateur.value = res.data;
//   } catch (err) {
//     console.error(err);
//   }
// }

// Pour que la barre de nav apparaisse/disparaisse lorsqu'on scroll

// :style="{ top: navbar }"

// const navbar = ref("0px");

// const handleScroll = () => {
//   if (window.scrollY > 500) {
//     navbar.value = "-100px";
//   } else {
//     navbar.value = "0px";
//   }
// };

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
  color: #ffff00;
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

.partieProfil div {
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
  align-items: center;
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
    border-color: var(--jaune-logo);
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
  background-color: var(--jaune-logo);
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
</style>
