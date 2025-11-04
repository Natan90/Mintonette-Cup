<template>
  <router-link to="/">{{ $t('homeLink') }}</router-link>
  <div>
    <label>{{ $t('user.nom') }}</label><br>
    <input :placeholder="$t('user.nom')" v-model="nom_utilisateur" /><br><br>

    <label>{{ $t('user.prenom') }}</label><br>
    <input :placeholder="$t('user.prenom')" v-model="prenom_utilisateur" /><br><br>

    <label>{{ $t('user.login') }}</label><br>
    <input :placeholder="$t('user.login')" v-model="login_utilisateur" /><br><br>

    <label>{{ $t('user.mdp') }}</label><br>
    <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur" /><br><br>

    <label>{{ $t('user.mail') }}</label><br>
    <input type="email" :placeholder="$t('user.mail')" v-model="mail_utilisateur" /><br><br>

    <label>{{ $t('user.dateNaissance') }}</label><br>
    <input type="date" v-model="date_naiss_utilisateur" /><br><br>

    <label>{{ $t('user.sexe') }}</label><br>
    
    <input type="radio" v-model="sexe_utilisateur" :id="$t('user.typeSexe.homme')" :value="$t('user.typeSexe.homme')" name="sexe">
    <label :for="$t('user.typeSexe.homme')">{{ $t('user.typeSexe.homme') }}</label><br></br>

    <input type="radio" v-model="sexe_utilisateur" :id="$t('user.typeSexe.femme')" :value="$t('user.typeSexe.femme')" name="sexe">
    <label :for="$t('user.typeSexe.femme')">{{ $t('user.typeSexe.femme') }}</label><br></br>

    <input type="radio" v-model="sexe_utilisateur" :id="$t('user.typeSexe.autre')" :value="$t('user.typeSexe.autre')" name="sexe">
    <label :for="$t('user.typeSexe.autre')">{{ $t('user.typeSexe.autre') }}</label>


    <br>
    <button type="button" @click="getValues">{{ $t('user.buttonInscirption') }}</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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
  if (!nom_utilisateur.value || !prenom_utilisateur.value || !login_utilisateur.value || !mdp_utilisateur.value || !mail_utilisateur.value) {
    message.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }

  try {
    const res = await axios.post('http://localhost:3000/utilisateur/inscription', {
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
  color: red;
}
</style>
