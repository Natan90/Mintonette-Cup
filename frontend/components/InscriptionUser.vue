<template>
  <div>
    <label>Nom</label><br>
    <input placeholder="Saisissez votre nom" v-model="nom_utilisateur" /><br><br>

    <label>Prénom</label><br>
    <input placeholder="Saisissez votre prénom" v-model="prenom_utilisateur" /><br><br>

    <label>Login</label><br>
    <input placeholder="Saisissez votre login" v-model="login_utilisateur" /><br><br>

    <label>Mot de passe</label><br>
    <input type="password" placeholder="Saisissez votre mot de passe" v-model="mdp_utilisateur" /><br><br>

    <label>Mail</label><br>
    <input type="email" placeholder="Saisissez votre email" v-model="mail_utilisateur" /><br><br>

    <label>Date de naissance</label><br>
    <input type="date" v-model="date_naiss_utilisateur" /><br><br>

    <label>Sexe</label><br>
    <input type="radio" id="homme" value="Homme" v-model="sexe_utilisateur" name="sexe" />
    <label for="homme">Homme</label>

    <input type="radio" id="femme" value="Femme" v-model="sexe_utilisateur" name="sexe" />
    <label for="femme">Femme</label>

    <input type="radio" id="autre" value="Autre" v-model="sexe_utilisateur" name="sexe" />
    <label for="autre">Autre</label>
    <br><br>

    <!-- IMPORTANT : type="button" pour ne pas recharger la page -->
    <button type="button" @click="getValues">Submit</button>

    <!-- Message de succès ou d'erreur -->
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const nom_utilisateur = ref("");
const prenom_utilisateur = ref("");
const login_utilisateur = ref("");
const mdp_utilisateur = ref("");
const mail_utilisateur = ref("");
const date_naiss_utilisateur = ref("");
const sexe_utilisateur = ref("");
const message = ref("");

async function getValues() {
  // Vérification rapide avant envoi
  if (!nom_utilisateur.value || !prenom_utilisateur.value || !login_utilisateur.value || !mdp_utilisateur.value || !mail_utilisateur.value) {
    message.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }

  try {
    const res = await axios.post('http://localhost:3000/inscription_utilisateur', {
      nom: nom_utilisateur.value,
      prenom: prenom_utilisateur.value,
      login: login_utilisateur.value,
      mdp: mdp_utilisateur.value,
      mail: mail_utilisateur.value,
      date_naissance: date_naiss_utilisateur.value,
      sexe: sexe_utilisateur.value,
    });
    message.value = `Utilisateur créé avec l'ID : ${res.data.id}`;
  } catch (err) {
    message.value = `Erreur lors de l'inscription : ${err.response?.data?.error || err.message}`;
    console.error(err);
  }
}
</script>

<style scoped>
input {
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
  padding: 5px 15px;
}
p {
  margin-top: 15px;
  font-weight: bold;
  color: green;
}
</style>
