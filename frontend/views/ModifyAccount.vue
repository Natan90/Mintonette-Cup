<template>
  <NavView></NavView>
  <div class="page">
    <div class="formulaire">
      <div class="titre_formulaire">
        <h1>{{ $t("account.modifyAccount") }}</h1>
        <router-link to="/" class="croix pointer">&times;</router-link>
      </div>

      <div v-if="loading" class="loading">
        <p>{{ $t("account.loading") }}</p>
      </div>

      <div v-else>
        <form @submit.prevent="updateUserInfo">
          <section class="infos_utilisateur">
            <div class="bloc_information photo-upload">
              <label for="photo">{{ $t("account.profilePhoto") }}</label>
              <div class="photo-preview-container">
                <img
                  v-if="photoPreview"
                  :src="photoPreview"
                  alt="Aperçu photo"
                  class="photo-preview" />
                <div v-else class="photo-placeholder">
                  <span>{{ $t("account.noPhoto") }}</span>
                </div>
              </div>
              <input
                id="photo"
                type="file"
                accept="image/*"
                @change="handlePhotoUpload"
                class="photo-input" />
              <label for="photo" class="upload-btn">{{
                $t("account.choosePhoto")
              }}</label>
            </div>

            <div class="bloc_information">
              <label for="prenom">{{ $t("user.prenom") }}</label>
              <input
                id="prenom"
                v-model="formData.prenom"
                type="text"
                :placeholder="$t('user.prenom')" />
            </div>

            <div class="bloc_information">
              <label for="nom">{{ $t("user.nom") }}</label>
              <input
                id="nom"
                v-model="formData.nom"
                type="text"
                :placeholder="$t('user.nom')" />
            </div>

            <div class="bloc_information">
              <label for="login">{{ $t("user.login") }}</label>
              <input
                id="login"
                v-model="formData.login"
                type="text"
                :placeholder="$t('user.login')" />
            </div>

            <div class="bloc_information">
              <label for="mail">{{ $t("user.mail") }}</label>
              <input
                id="mail"
                v-model="formData.mail"
                type="email"
                :placeholder="$t('user.mail')" />
            </div>

            <div class="bloc_information">
              <label for="tel">{{ $t("user.tel_utilisateur") }}</label>
              <input
                id="tel"
                v-model="formData.tel_utilisateur"
                type="tel"
                pattern="^0[1-9][0-9]{8}$"
                :placeholder="$t('user.tel_utilisateur')" />
            </div>

            <div class="bloc_information">
              <label>{{ $t("user.sexe") }}</label>
              <div class="sexe">
                <div>
                  <input
                    id="sexe-h"
                    v-model="formData.sexe"
                    type="radio"
                    :value="$t('user.typeSexe.homme')"
                    name="sexe" />
                  <label for="sexe-h">{{ $t("user.typeSexe.homme") }}</label>
                </div>

                <div>
                  <input
                    id="sexe-f"
                    v-model="formData.sexe"
                    type="radio"
                    :value="$t('user.typeSexe.femme')"
                    name="sexe" />
                  <label for="sexe-f">{{ $t("user.typeSexe.femme") }}</label>
                </div>

                <div>
                  <input
                    id="sexe-a"
                    v-model="formData.sexe"
                    type="radio"
                    :value="$t('user.typeSexe.autre')"
                    name="sexe" />
                  <label for="sexe-a">{{ $t("user.typeSexe.autre") }}</label>
                </div>
              </div>
            </div>
          </section>

          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <div class="boutons">
            <button class="pointer" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? $t("account.saving") : $t("account.save") }}
            </button>
            <router-link to="/">
              {{ $t("pageLog.annuler") }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import utilisateursData from "../../backend/database/jsonData/Utilisateur.json";
// import axios from 'axios';
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const loading = ref(true);
const isSubmitting = ref(false);
const message = ref("");
const messageType = ref("");
const photoPreview = ref(null);
const photoFile = ref(null);

const userId = Number(route.params.userId);

const formData = ref({
  prenom: "",
  nom: "",
  login: "",
  mail: "",
  tel_utilisateur: "",
  sexe: "",
});
onMounted(() => {
  if (!userStore.isConnected) {
    router.push({ name: "Connexion_utilisateur" });
    return;
  }

  const user = utilisateursData.find(
    (u) => u.id_utilisateur === userId
  );

  if (user) {
    formData.value = {
      prenom: user.prenom_utilisateur || "",
      nom: user.nom_utilisateur || "",
      login: user.login_utilisateur || "",
      mail: user.mail_utilisateur || "",
      tel_utilisateur: user.tel_utilisateur || "",
      sexe: user.sexe_utilisateur || "",
    };

    if (user.photo_profil_utilisateur) {
      photoPreview.value = `data:image/jpeg;base64,${user.photo_profil_utilisateur}`;
    }
  } else {
    message.value = t("account.errorLoading");
    messageType.value = "error";
  }

  loading.value = false;
});

// async onMounted(() => {
//   if (!userStore.isConnected) {
//     router.push({ name: 'Connexion_utilisateur' });
//     return;
//   }

//   try {
//     console.log('Fetching user data for ID:', userStore.userId);
//     const response = await axios.get(`http://localhost:3000/admin/utilisateur/show/${userStore.userId}`);
//     console.log('User data received:', response.data);
//
//     formData.value = {
//       prenom: response.data.prenom_utilisateur || '',
//       nom: response.data.nom_utilisateur || '',
//       login: response.data.login_utilisateur || '',
//       mail: response.data.mail_utilisateur || '',
//       tel_utilisateur: response.data.tel_utilisateur || '',
//       sexe: response.data.sexe_utilisateur || ''
//     };
//
//     if (response.data.photo_profil_utilisateur) {
//       photoPreview.value = `data:image/jpeg;base64,${response.data.photo_profil_utilisateur}`;
//     }
//
//     console.log('Form data updated:', formData.value);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des données :', error);
//     message.value = t('account.errorLoading');
//     messageType.value = 'error';
//   } finally {
//     loading.value = false;
//   }
// });

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    photoFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const updateUserInfo = () => {
  if (isSubmitting.value) return;

  if (
    !formData.value.prenom ||
    !formData.value.nom ||
    !formData.value.login ||
    !formData.value.mail
  ) {
    message.value = t("account.requiredFields");
    messageType.value = "error";
    return;
  }

  isSubmitting.value = true;
  message.value = "";

  message.value = t("account.updateSuccess");
  messageType.value = "success";

  setTimeout(() => {
    router.push({ name: "Home" });
    isSubmitting.value = false;
  }, 2000);
};

// const updateUserInfo = async () => {
//   if (isSubmitting.value) return;

//   if (!formData.value.prenom || !formData.value.nom || !formData.value.login || !formData.value.mail) {
//     message.value = t('account.requiredFields');
//     messageType.value = 'error';
//     return;
//   }

//   isSubmitting.value = true;
//   message.value = '';

//   try {
//     let photoData = null;
//     if (photoFile.value) {
//       const reader = new FileReader();
//       photoData = await new Promise((resolve) => {
//         reader.onload = (e) => {
//           const base64String = e.target.result.split(',')[1];
//           resolve(base64String);
//         };
//         reader.readAsDataURL(photoFile.value);
//       });
//     }

//     const response = await axios.put(`http://localhost:3000/utilisateur/auth/update/${userStore.userId}`, {
//       prenom: formData.value.prenom,
//       nom: formData.value.nom,
//       login: formData.value.login,
//       mail: formData.value.mail,
//       tel_utilisateur: formData.value.tel_utilisateur,
//       sexe: formData.value.sexe,
//       photo_profil: photoData
//     });

//     message.value = t('account.updateSuccess');
//     messageType.value = 'success';

//     setTimeout(() => {
//       router.push({ name: 'Home' });
//     }, 2000);
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour :', error);
//
//     if (error.response?.status === 409) {
//       message.value = t('account.emailAlreadyUsed');
//     } else {
//       message.value = t('account.updateError');
//     }
//     messageType.value = 'error';
//   } finally {
//     isSubmitting.value = false;
//   }
// };
</script>

<style scoped>
.page {
  width: 100%;
  display: flex;
  justify-content: center;
}

.formulaire {
  margin: 40px;
  width: 80%;
  max-width: 600px;

  border-radius: 10px;

  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
}

.titre_formulaire {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  border-radius: 10px 10px 0 0;

  color: black;
}

.croix {
  font-size: 40px;
  font-weight: bold;
  color: red;
  text-decoration: none;
}

.croix:hover {
  scale: 1.1;
  transition: var(--transition-fast);
}

.infos_utilisateur {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  background-color: var(--jaune-logo);
}

.bloc_information {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bloc_information > label {
  text-transform: uppercase;
  font-size: 15px;
  font-weight: 500;
}

.bloc_information > input {
  width: 40%;
  border: none;
  border-radius: 10px;
  padding: 4px;
}

.sexe div:hover {
  color: grey;
  transition: var(--transition-fast);
}

.boutons {
  font-size: 15px;
  text-align: center;
  align-items: baseline;
  display: flex;
  justify-content: space-evenly;
  padding: 10px;

  border-radius: 0 0 10px 10px;

  background-color: white;
}

.boutons button {
  font-size: 16px;

  font-weight: bolder;

  color: black;
  background-color: white;
  border: none;
  border-radius: 10px;
  padding: 6px;
}

.boutons a {
  font-size: 16px;

  font-weight: bolder;

  color: black;
  border-radius: 10px;
  padding: 6px;
  text-decoration: none;
}

.boutons a:hover,
.boutons button:hover {
  background-color: var(--jaune-logo);
  color: grey;
  transition: var(--transition-fast);
}

.loading {
  padding: 40px 30px;
  text-align: center;
  font-size: 18px;
  color: #666;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.photo-preview-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.photo-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #333;
}

.photo-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #333;
  text-align: center;
  padding: 10px;
}

.photo-input {
  display: none;
}

.upload-btn {
  display: inline-block;
  width: fit-content;
  margin: 0 auto;
  background-color: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  text-align: center;
}

.upload-btn:hover {
  background-color: #764ba2;
}
</style>