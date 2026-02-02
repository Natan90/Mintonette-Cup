<template>
  <div class="reset-container">
    <h2>
      <span v-if="continueReset">
        Réinitialiser le mot de passe
      </span>
      <span v-else>
        Entrez votre adresse e-mail
      </span>
    </h2>

    <div>
      <div class="input-group">
        <input type="email" placeholder="mail@example.com" v-model.trim="mailToSend" />
      </div>

      <p class="message" v-if="message && !continueReset" :class="{ error: isError }">
        {{ message }}
      </p>

      <button @click="sendEmail(mailToSend)" v-if="!continueReset">
        Envoyer le mail
      </button>

      <form @submit.prevent="submitReset" v-if="continueReset">
        <div class="input-group">
          <input type="password" placeholder="Nouveau mot de passe" v-model="newPassword" />
        </div>

        <div class="input-group">
          <input type="password" placeholder="Confirmer le mot de passe" v-model="confirmPassword" />
        </div>

        <button type="submit">Réinitialiser</button>
      </form>
    </div>

    <p v-if="message && continueReset" :class="{ error: isError }">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUtilisateurAuthStore } from "@/services/utilisateur.service";
import { useMailStore } from "@/services/mail.service";

const route = useRoute();
const userAuthStore = useUtilisateurAuthStore();
const mailStore = useMailStore();

const mailToSend = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const isError = ref(false);
const continueReset = ref(false);

const token = route.params.token || null;

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function submitReset() {
  if (!newPassword.value || !confirmPassword.value) {
    message.value = "Veuillez remplir tous les champs";
    isError.value = true;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    message.value = "Les mots de passe ne correspondent pas";
    isError.value = true;
    return;
  }

  try {
    const res = await userAuthStore.ResetPasswordUtilisateur(newPassword.value);

    message.value = "Mot de passe réinitialisé avec succès !";
    isError.value = false;
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (err) {
    message.value = err.response?.data?.error || "Erreur serveur";
    isError.value = true;
  }
}

async function sendEmail(mailToSend) {
  if (!mailToSend) {
    message.value = "Veuillez remplir votre email";
    isError.value = true;
    return;
  }

  if (!isValidEmail(mailToSend)) {
    message.value = "Veuillez saisir une adresse e-mail valide";
    isError.value = true;
    return;
  }

  message.value = "";
  isError.value = false;
  continueReset.value = true;

  try {
    await mailStore.ResetPassword(mailToSend);

    message.value = "Un e-mail de réinitialisation a été envoyé";
    continueReset.value = true;
  } catch (err) {
    message.value = err.response?.data?.error || "Erreur lors de l'envoi de l'e-mail";
    isError.value = true;
  }
}
</script>

<style scoped>
.reset-container {
  max-width: 450px;
  margin: 100px auto;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #1e90ff;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: #1e90ff;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #0077cc;
}

p {
  margin-top: 12px;
  font-size: 14px;
}

.error {
  color: red;
}
</style>
