<template>
  <Modal v-model="showModal">
    <template #content>
      <div class="check-wrapper">
        <svg class="checkmark" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="23" fill="none" />
          <path class="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
        </svg>
      </div>
      <div v-if="isConnexionModal">
        <p>{{ $t("modal.connexion") }}</p>
      </div>

      <div v-else>
        <p>{{ $t("modal.inscription") }}</p>
        <button @click="goToAddPrestataire" class="button-prestataire">
          {{ $t("modal.goToPrestataire") }}
        </button>
      </div>
    </template>
  </Modal>

  <div class="page" :class="{ moved: showRegister }">
    <div class="left-side" :class="{ moved: showRegister }">
      <div class="blob" :class="{ moved: showRegister }"></div>
      <div class="small-blob" :class="{ moved: showRegister }"></div>
    </div>

    <div class="left-card" :class="{ moved: showRegister }">
      <div v-if="!showRegister">
        <p class="title">{{ $t("user.connexion") }}</p>

        <div class="button-right-media" :class="{ moved: showRegister }">
          <button class="button_register" @click="moveCard">
            {{ valueTexts.button }}
          </button>
        </div>

        <div class="item input_item">
          <input
            :placeholder="$t('user.login')"
            v-model="login_utilisateur_connexion"
            @keyup.enter="getValuesConnexion" />
          <hr />
        </div>

        <div class="item input_item">
          <input
            type="password"
            :placeholder="$t('user.mdp')"
            v-model="mdp_utilisateur_connexion"
            @keyup.enter="getValuesConnexion" />
          <hr />
        </div>

        <div class="mdp_oublie">
          <button id="button_mdp_oublie" @click="forbiddenPassword()">
            <u>{{ $t("pageLog.mdpOublie") }}</u>
          </button>
        </div>

        <div class="item">
          <button
            @click="getValuesConnexion"
            class="button_message button_connexion">
            {{ $t("user.buttonConnexion") }}
          </button>
        </div>

        <div class="item">
          <button @click="signInWithGoogle" class="google-btn">
            <svg
              class="google-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4" />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853" />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05" />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335" />
            </svg>
            Se connecter avec Google
          </button>
          <p v-if="message" class="message">{{ message }}</p>
        </div>

        <div class="item">
          <router-link to="/" class="button_message button_cancel">{{
            $t("pageLog.annuler")
          }}</router-link>
        </div>
      </div>

      <div v-else>
        <form @submit.prevent="getValuesInscription">
          <p class="title">{{ $t("user.inscription") }}</p>
          <div class="grid">
            <div class="container_left">
              <div class="item">
                <input
                  :placeholder="$t('user.prenom')"
                  v-model="prenom_utilisateur"
                  @keyup.enter="getValuesInscription" />
                <hr />
              </div>

              <div class="button-left-media" :class="{ moved: showRegister }">
                <button class="button_register" @click="moveCard">
                  {{ valueTexts.button }}
                </button>
              </div>

              <div class="item">
                <input
                  :placeholder="$t('user.nom')"
                  v-model="nom_utilisateur"
                  @keyup.enter="getValuesInscription" />
                <hr />
              </div>

              <div class="item">
                <input
                  :placeholder="$t('user.login')"
                  v-model="login_utilisateur"
                  @keyup.enter="getValuesInscription" />
                <hr />
              </div>

              <div class="item">
                <input
                  type="password"
                  :placeholder="$t('user.mdp')"
                  v-model="mdp_utilisateur"
                  @keyup.enter="getValuesInscription" />
                <hr />
              </div>
            </div>

            <div class="separator"></div>

            <div class="container_right">
              <div class="tel">
                <input
                  type="tel"
                  pattern="^0[1-9][0-9]{8}$"
                  v-model="tel_utilisateur"
                  :placeholder="$t('user.tel_utilisateur')" /><br /><br />
              </div>

              <div class="item">
                <input
                  type="email"
                  :placeholder="$t('user.mail')"
                  v-model="mail_utilisateur"
                  @keyup.enter="getValuesInscription" />
                <hr />
              </div>

              <div class="item_radio">
                <div class="radio_group">
                  <input
                    type="radio"
                    v-model="sexe_utilisateur"
                    :id="$t('user.typeSexe.homme')"
                    :value="$t('user.typeSexe.homme')"
                    name="sexe"
                    class="pointer" />
                  <label :for="$t('user.typeSexe.homme')">{{
                    $t("user.typeSexe.homme")
                  }}</label>
                </div>

                <div class="radio_group">
                  <input
                    type="radio"
                    v-model="sexe_utilisateur"
                    :id="$t('user.typeSexe.femme')"
                    :value="$t('user.typeSexe.femme')"
                    name="sexe"
                    class="pointer" />
                  <label :for="$t('user.typeSexe.femme')">{{
                    $t("user.typeSexe.femme")
                  }}</label>
                </div>

                <div class="radio_group">
                  <input
                    type="radio"
                    v-model="sexe_utilisateur"
                    :id="$t('user.typeSexe.autre')"
                    :value="$t('user.typeSexe.autre')"
                    name="sexe"
                    class="pointer" />
                  <label :for="$t('user.typeSexe.autre')">{{
                    $t("user.typeSexe.autre")
                  }}</label>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div class="item">
            <button type="submit" class="button_message button_connexion">
              {{ $t("user.buttonInscription") }}
            </button>
            <p v-if="message" class="message">{{ message }}</p>
          </div>
          <div class="item">
            <router-link to="/" class="button_message button_cancel">{{
              $t("pageLog.annuler")
            }}</router-link>
          </div>
        </form>
      </div>
    </div>

    <div class="background-right" :class="{ moved: showRegister }">
      <div class="bg-text">
        <h1>{{ valueTexts.title }}</h1>
        <p>{{ valueTexts.texte }}</p>
        <button class="button_register" @click="moveCard">
          {{ valueTexts.button }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import Modal from "./Modal.vue";
import { useUtilisateurAuthStore } from "@/services/utilisateur.service";
import { useMailStore } from "@/services/mail.service";
import { useAdminAPIStore } from "@/services/admin.service";
import { useNavigationStore } from "@/stores/navigation";

const adminAPIStore = useAdminAPIStore();
const utilisateurAuthStore = useUtilisateurAuthStore();
const previousRoute = useNavigationStore();
const mailStore = useMailStore();
const navStore = useNavigationStore();
const route = useRoute();
const showRegister = ref(route.name === "Inscription_utilisateur");
const token = ref(route.query.token || null);

const { t } = useI18n();

const login_utilisateur_connexion = ref("");
const mdp_utilisateur_connexion = ref("");

const nom_utilisateur = ref("");
const prenom_utilisateur = ref("");
const login_utilisateur = ref("");
const mdp_utilisateur = ref("");
const mail_utilisateur = ref("");
const tel_utilisateur = ref("");
const sexe_utilisateur = ref("");

const message = ref("");
const connexion = ref(false);
const inscription = ref(false);

function getUserIdFromResponse(user) {
  return user?.id ?? user?.id_utilisateur ?? user?._id ?? null;
}
const userId = ref(0);

const router = useRouter();
const userStore = useUserStore();

const showModal = ref(false);
const isConnexionModal = computed(
  () => route.path === "/utilisateur/connexion",
);

const redirect = route.query.redirect ||
  navStore.previousRoute || {
    name: "Home",
    params: {
      lang: route.params.lang || "fr",
    },
  };

/**
 * Ferme la modal de confirmation et redirige l'utilisateur vers la route définie (redirect).
 */
const closeModal = () => {
  showModal.value = false;
  router.push(redirect);
};
/**
 * Affiche la modal de confirmation après connexion ou inscription.
 */
function ModalShow() {
  showModal.value = true;
  setTimeout(() => {
    closeModal();
  }, 2000);
}
/**
 * Redirige l'utilisateur vers la page d'ajout de prestataire avec son ID utilisateur.
 */
function goToAddPrestataire() {
  console.log("Dans la fonction goToAddPrestataire");
  router.push({
    name: "AddPrestataire",
    params: { id: userStore.userId },
  });
}

const valueTexts = computed(() => {
  if (showRegister.value) {
    return {
      title: t("pageLog.titreConnecter"),
      texte: t("pageLog.texteConnecter"),
      button: t("user.buttonConnexion"),
    };
  } else {
    return {
      title: t("pageLog.titreRejoindre"),
      texte: t("pageLog.texteRejoindre"),
      button: t("user.buttonInscription"),
    };
  }
});

onMounted(async () => {
  const error = route.query.error;

  if (error) {
    message.value = "Échec de l'authentification Google";
    return;
  }

  console.log("Token : ", token.value);

  if (token.value) {
    try {
      await connectUserWithToken(token.value);
      router.replace({
        name: "Home",
        params: { lang: route.params.lang || "fr" },
        query: {},
      });
    } catch (e) {
      message.value = "Erreur lors de la récupération du profil utilisateur";
    }
  }
});

/**
 * Gère la connexion utilisateur : validation des champs, appel API, stockage du token et utilisateur,
 * puis affichage d’une modal de confirmation en cas de succès.
 */
async function getValuesConnexion() {
  if (!login_utilisateur_connexion.value || !mdp_utilisateur_connexion.value) {
    message.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }

  try {
    const res = await utilisateurAuthStore.ConnexionUtilisateur({
      login: login_utilisateur_connexion.value,
      mdp: mdp_utilisateur_connexion.value,
    });

    const connectedUserId = getUserIdFromResponse(res.data.user);
    userStore.setUser(connectedUserId);
    userStore.setRole(res.data.user.role || "user");
    userStore.setToken(res.data.token);
    userId.value = userStore.userId;
    message.value = `Bon retour parmi nous sur la plateforme officielle de la Mintonette Cup !`;
    connexion.value = true;

    if (connexion.value) {
      ModalShow(false);
    }
  } catch (err) {
    const apiMessage =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.data?.error ||
      err?.data?.message;

    if (apiMessage) {
      message.value = apiMessage;
      if (apiMessage === "Compte temporairement bloqué") {
        mailStore.ResetPassword(login_utilisateur_connexion.value);
      }
    } else if (err?.response?.status === 401) {
      message.value = "Identifiant ou mot de passe incorrect.";
    } else {
      message.value = "Erreur serveur : impossible de se connecter.";
    }
    console.error("Erreur connexion :", err);
  }
}
/**
 * Gère l'inscription utilisateur : validation des champs, appel API,
 * stockage des données utilisateur et affichage d’une modal de confirmation.
 */
async function getValuesInscription() {
  if (
    !nom_utilisateur.value ||
    !prenom_utilisateur.value ||
    !login_utilisateur.value ||
    !mdp_utilisateur.value ||
    !mail_utilisateur.value
  ) {
    message.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }

  try {
    const res = await utilisateurAuthStore.InscriptionUtilisateur({
      nom: nom_utilisateur.value,
      prenom: prenom_utilisateur.value,
      login: login_utilisateur.value,
      mdp: mdp_utilisateur.value,
      mail: mail_utilisateur.value,
      tel_utilisateur: tel_utilisateur.value,
      sexe: sexe_utilisateur.value,
    });
    if (res.data && res.data.user) {
      const createdUserId = getUserIdFromResponse(res.data.user);
      userStore.setUser(createdUserId);
      userStore.setRole(res.data.user.role || "user");
      userStore.setToken(res.data.token);
      message.value = `Bienvenue sur la plateforme officielle de la Mintonette Cup`;

      inscription.value = true;
    } else {
      message.value =
        res.data?.message ||
        "Inscription réussie mais impossible de récupérer l'ID utilisateur.";
    }

    if (inscription.value) {
      ModalShow();
    }
  } catch (err) {
    console.error("Erreur inscription :", err);
    if (err?.data?.error) {
      message.value = err.data.error;
    } else if (err?.response?.data?.error) {
      message.value = err.response.data.error;
    } else {
      message.value = "Erreur serveur : impossible de s'inscrire.";
    }
  }
}
/**
 * Alterne entre la vue connexion et inscription et met à jour la route correspondante.
 */
function moveCard() {
  showRegister.value = !showRegister.value;

  if (showRegister.value) {
    router.push({ name: "Inscription_utilisateur" });
  } else {
    router.push({ name: "Connexion_utilisateur" });
  }
}
/**
 * Redirige l'utilisateur vers la page de réinitialisation de mot de passe
 * en sauvegardant la route actuelle comme retour possible.
 */
function forbiddenPassword() {
  navStore.previousRoute = route.fullPath;
  router.push({
    name: "ResetPasswordRequest",
  });
}
/**
 * Lance l'authentification Google en redirigeant vers l'URL backend OAuth.
 */
function signInWithGoogle() {
  console.log("🔹 Bouton Google cliqué");
  console.log(
    "URL backend:",
    `${import.meta.env.VITE_LINK_BACK}/utilisateur/auth/google`,
  );
  window.location.href = `${import.meta.env.VITE_LINK_BACK}/utilisateur/auth/google`;
}
/**
 * Connecte un utilisateur à partir d’un token JWT :
 * stocke le token, récupère les informations utilisateur et initialise la session.
 * @param {string} token - JWT reçu après authentification
 */
async function connectUserWithToken(token) {
  console.log("JWT reçu :", token);

  userStore.startAuthenticating();
  userStore.setToken(token);

  const res = await adminAPIStore.GetCurrentUser(token);
  console.log("Résultat GetCurrentUser :", res);

  userStore.setUser(
    res.data.id_utilisateur ?? res.data.id ?? res.data.user?.id,
  );
  userStore.setRole(res.data.isadmin ? "admin" : "user");

  userStore.stopAuthenticating();
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--log-fond);
}

.page.moved {
  flex-direction: row-reverse;
}

/* ── Côté gauche décoratif ── */
.left-side {
  width: var(--widthLeftSide);
  position: relative;
  z-index: 1;
  overflow: hidden;
  background-color: var(--log-fond);
}

.left-side::before {
  content: "";
  position: absolute;
  top: -80px;
  left: -80px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 12px 30px rgba(58, 111, 67, 0.2);
  z-index: 0;
  pointer-events: none;
}

.left-side.moved::before {
  left: auto;
  right: -80px;
}

.left-side::after {
  content: "";
  position: absolute;
  bottom: -50px;
  left: 50px;
  width: 120px;
  height: 120px;
  background: var(--rose-pale);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.8;
}

.left-side.moved::after {
  left: auto;
  right: 50px;
}

/* Blob organique 1 — rose */
.blob {
  position: absolute;
  width: 150px;
  height: 150px;
  background: var(--log-blob-1);
  border-radius: 50% 30% 50% 30%;
  top: 10%;
  left: 30%;
  opacity: 0.25;
  z-index: 0;
  transform: rotate(20deg);
}

.blob.moved {
  left: auto;
  right: 30%;
}

/* Blob organique 2 — vert */
.small-blob {
  position: absolute;
  width: 100px;
  height: 100px;
  background: var(--log-blob-2);
  border-radius: 50% 40% 60% 50%;
  top: 75%;
  left: 80%;
  opacity: 0.3;
  z-index: 0;
  transform: rotate(-25deg);
}

.small-blob.moved {
  left: auto;
  right: 80%;
}

/* ── Panneau droit coloré ── */
.background-right {
  flex: 1;
  background: var(--log-gradient-connexion);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: white;
  z-index: 1;
}

.background-right.moved {
  background: var(--log-gradient-inscription);
}

/* ── Carte formulaire ── */
.left-card {
  width: var(--widthLeftCard35);
  background: var(--log-card-bg);
  border-radius: 20px;
  padding: 40px 50px;
  box-shadow:
    0 10px 35px rgba(58, 111, 67, 0.12),
    0 2px 8px rgba(232, 99, 122, 0.08);

  position: absolute;
  left: 15%;
  top: var(--coordLeftCardTop);
  transform: translateY(-50%);
  transition: all 0.5s ease;
  z-index: 2;
}

.left-card:hover {
  transform: translateY(calc(-50% - 3px));
  box-shadow:
    0 18px 45px rgba(58, 111, 67, 0.16),
    0 4px 12px rgba(232, 99, 122, 0.1);
}

.left-card.moved {
  transform: translate(calc(30% + var(--widthLeftSide)), -50%);
  width: var(--widthLeftCard45);
}

/* ── Titre ── */
.title {
  font-family: var(--fontFamilyTitle), sans-serif;
  letter-spacing: 1px;
  font-size: 2.2em;
  font-weight: 700;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 25px;
}

/* ── Champs ── */
.tel {
  height: 50px;
}

.item {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.item hr {
  height: 3px;
  border: none;
  border-radius: 3px;
  background: var(--log-gradient-input);
  margin: 5px 0 0 0;
  padding: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.7s ease;
  opacity: 0.6;
}

.item input:focus + hr {
  transform: scaleX(1);
  opacity: 1;
}

input {
  background-color: transparent;
  display: block;
  width: 100%;
  padding: 12px 14px 0px 0px;
  font-size: 15px;
  border-radius: 8px;
  border: none;
  color: #2a3d2e;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.input_item {
  height: 50px;
}

input:focus {
  outline: none;
}

input::placeholder {
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #8aab8e;
}

/* ── Mot de passe oublié ── */
.mdp_oublie {
  text-align: right;
  margin-bottom: 15px;
}

#button_mdp_oublie {
  border: none;
  background-color: transparent;
  font-size: 0.85em;
  color: var(--rose);
  cursor: pointer;
  transition: color 0.25s ease;
}

#button_mdp_oublie:hover {
  color: var(--rose-hover);
}

/* ── Boutons ── */
.button_message {
  display: block;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 15px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.25s ease;
  width: 100%;
  text-align: center;
  color: #fff;
  text-decoration: none;
}

.button_connexion {
  background: var(--log-gradient-cta);
  background-size: 200% 100%;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.25);
}

.button_connexion:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(58, 111, 67, 0.3);
}

.button_cancel {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  display: inline-block;
  width: 100%;
}

.button_cancel:hover {
  background: #eef5ef;
  border-color: var(--primary-dark);
  color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(58, 111, 67, 0.15);
}

.button_message:active {
  transform: translateY(1px);
}

/* ── Message d'erreur ── */
.message {
  margin-top: 12px;
  font-weight: 600;
  color: var(--rose-hover);
  text-align: center;
  font-size: 14px;
}

/* ── Texte panneau droit ── */
.bg-text {
  text-align: center;
  max-width: 500px;
  line-height: 1.4;
}

.bg-text h1 {
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 1px;
  color: #fff;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
}

.bg-text p {
  font-size: 1.1em;
  opacity: 0.95;
  font-weight: 400;
  line-height: 1.5;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.button_register {
  border: 2px solid rgba(255, 255, 255, 0.8);
  padding: 12px 28px;
  border-radius: 8px;
  color: var(--primary-dark);
  background: var(--log-card-bg);
  font-weight: 700;
  font-size: 1em;
  cursor: pointer;
  margin-top: 22px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.button_register:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}

/* ── Grille inscription ── */
.grid {
  display: flex;
  flex-direction: row;
  padding-top: 30px;
}

.container_left {
  width: 50%;
  padding: 15px 15px 15px 0px;
}

.separator {
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--log-border),
    transparent
  );
  margin: 0 20px;
}

.container_right {
  margin-top: 10px;
  width: 50%;
  height: 160px;
  display: flex;

  flex-direction: column;
  justify-content: space-between;
}

.both_size {
  flex-direction: row;
  gap: 50px;
}

.item_radio {
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
}

.radio_group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.radio_group input[type="radio"] {
  accent-color: var(--primary-color);
  width: auto;
  margin: 0;
  vertical-align: middle;
}

.item_radio label {
  margin-left: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #3a4a3d;
  cursor: pointer;
}

/* ── Bouton Google ── */
.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #3c4043;
  border: 1px solid var(--log-border);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.google-btn:hover {
  background: #f5faf6;
  border-color: var(--primary-light);
  box-shadow: 0 2px 8px rgba(58, 111, 67, 0.12);
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* ── Modale check ── */
.check-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px auto;
}

.checkmark {
  width: 90%;
  height: 90%;
  stroke: var(--primary-color);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.checkmark-circle {
  stroke-dasharray: 157;
  stroke-dashoffset: 157;
  animation: draw-circle 0.6s forwards;
}

.checkmark-check {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw-check 0.4s 0.6s forwards;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: var(--rose-hover);
}

/* ── Bouton prestataire ── */
.button-prestataire {
  background: var(--log-gradient-cta);
  color: white;
  font-weight: 600;
  font-size: 1.1em;
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(58, 111, 67, 0.25);
}

.button-prestataire:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(58, 111, 67, 0.35);
}

.button-prestataire:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(58, 111, 67, 0.2);
}

.button-right-media,
.button-left-media {
  display: none;
}

@keyframes draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-check {
  to {
    stroke-dashoffset: 0;
  }
}

@media (max-width: 900px) {
  .page {
    flex-direction: column;
    overflow-y: auto;
  }

  .page.moved {
    flex-direction: column;
  }

  .button-right-media,
  .button-left-media {
    display: block;
    position: absolute;
    top: 40px;
  }

  .button-right-media {
    left: 70%;
  }

  .button-left-media {
    left: 10%;
  }

  .button-left-media button,
  .button-right-media button {
    background-color: var(--primary-color);
    color: white;
  }

  .left-side {
    display: none;
  }

  /* Carte connexion */
  .left-card,
  .left-card.moved {
    position: static;
    transform: none !important;
    width: 90% !important;
    margin: 40px auto;
    transition: none;
  }

  .left-card:hover {
    transform: none !important;
  }

  .grid {
    flex-direction: column;
    padding-top: 10px;
  }

  .background-right,
  .background-right.moved {
    display: none;
  }

  .separator {
    width: 100%;
    height: 2px;
    margin: 15px 0;
  }

  .container_right {
    width: 100%;
    height: auto;
  }
}
</style>
