ça ne marche pas là
quand je change la taille de container_right l'espace entre les boutons radios et leur label change
<template>
  <router-link to="/">{{ $t('homeLink') }}</router-link>
  <div class="container">
    <div class="content">
      <div class="grid">
        <div class="container_left">
          <div class="item both_size">
            <div class="item">
              <label>{{ $t('user.nom') }}</label><br>
              <input :placeholder="$t('user.nom')" v-model="nom_utilisateur" />
            </div>

            <div class="item">
              <label>{{ $t('user.prenom') }}</label><br>
              <input :placeholder="$t('user.prenom')" v-model="prenom_utilisateur" />
            </div>

          </div>

          <div class="item">
            <label>{{ $t('user.login') }}</label><br>
            <input :placeholder="$t('user.login')" v-model="login_utilisateur" /><br><br>
          </div>

          <div class="item">
            <label>{{ $t('user.mdp') }}</label><br>
            <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur" /><br><br>
          </div>

          <div class="item">
            <label>{{ $t('user.mail') }}</label><br>
            <input type="email" :placeholder="$t('user.mail')" v-model="mail_utilisateur" /><br><br>
          </div>
        </div>

        <div class="separator"></div>

        <div class="container_right">
          <div class="item">
            <label>{{ $t('user.dateNaissance') }}</label><br>
            <input type="date" v-model="date_naiss_utilisateur" /><br><br>
          </div>

          <div class="item">
            <label>{{ $t('user.sexe') }}</label><br>
          </div>

          <div class="item_radio">
            <div class="radio_group">
              <input type="radio" v-model="sexe_utilisateur" :id="$t('user.typeSexe.homme')"
                :value="$t('user.typeSexe.homme')" name="sexe" @click="changeOther('homme')">
              <label :for="$t('user.typeSexe.homme')">{{ $t('user.typeSexe.homme') }}</label>
            </div>


            <div class="radio_group">
              <input type="radio" v-model="sexe_utilisateur" :id="$t('user.typeSexe.femme')"
                :value="$t('user.typeSexe.femme')" name="sexe" @click="changeOther('femme')">
              <label :for="$t('user.typeSexe.femme')">{{ $t('user.typeSexe.femme') }}</label>
            </div>


            <div class="radio_group">
              <input type="radio" v-model="sexe_utilisateur" :id="$t('user.typeSexe.autre')"
                :value="$t('user.typeSexe.autre')" name="sexe" @click="changeOther('autre')">
              <label :for="$t('user.typeSexe.autre')">{{ $t('user.typeSexe.autre') }}</label>
            </div>

          </div>
          <div v-if="isOther">
            <label></label>
              <input v-model="autre_sexe_utilisateur" :placeholder="$t('user.typeSexe.autre')"></input>
            </div>
        </div>

      </div>
      <br>
      <button type="button" @click="getValues">{{ $t('user.buttonInscription') }}</button>
      <p v-if="message">{{ message }}</p>
    </div>

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
const autre_sexe_utilisateur = ref("");
const sexe_utilisateur = ref("");
const message = ref("");

const isOther = ref(false);

async function getValues() {
  if (!nom_utilisateur.value || !prenom_utilisateur.value || !login_utilisateur.value || !mdp_utilisateur.value || !mail_utilisateur.value) {
    message.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }

  try {
    if (sexe_utilisateur.value.toLowerCase() === 'Autre') {
      sexe_utilisateur.value = autre_sexe_utilisateur.value;
    }

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


function changeOther(name) {
  if (name != 'autre') {
    isOther.value = false;
  }
  else {
    isOther.value = true;
  }
}
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100vh;
}

.content {
  background-color: #ffffff;
  padding: 15px 50px 40px 50px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;
  width: 900px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.content:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.grid {
  display: flex;
  flex-direction: row;
}

.container_left {
  width: 50%;
  padding: 15px 15px 15px 0px;
}

.separator {
  width: 1px;
  background-color: #ccc;
  margin: 0 20px;
}

.container_right {
  width: 50%;
  padding: 15px 0px 15px 15px;
}

.title {
  font-size: 2em;
  font-weight: 700;
  color: #007bff;
  text-align: center;
  margin-bottom: 25px;
}

.item {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.both_size {
  flex-direction: row;
  gap: 50px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
  font-size: 15px;
}

input {
  display: block;
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
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
  white-space: nowrap;
}

.item_radio input {
  margin: 0;
  vertical-align: middle;
}

.item_radio label {
  margin-left: 5px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

p {
  margin-top: 15px;
  font-weight: bold;
  color: red;
}
</style>