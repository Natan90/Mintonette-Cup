<template>
    <div class="page" :class="{ moved: showRegister }">
        <div class="left-side" :class="{ moved: showRegister }">
            <div class="blob" :class="{ moved: showRegister }"></div>
            <div class="small-blob" :class="{ moved: showRegister }"></div>
        </div>

        <div class="left-card" :class="{ moved: showRegister }">
            <div v-if="!showRegister">
                <p class="title">{{ $t('user.connexion') }}</p>

                <div class="item input_item">
                    <input :placeholder="$t('user.login')" v-model="login_utilisateur_connexion" />
                    <hr />
                </div>

                <div class="item input_item">
                    <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur_connexion" />
                    <hr />
                </div>

                <div class="mdp_oublie">
                    <button id="button_mdp_oublie"><u>{{ $t('pageLog.mdpOublie') }}</u></button>
                </div>

                <div class="item">
                    <button @click="getValuesConnexion" class="button_message button_connexion">
                        {{ $t('user.buttonConnexion') }}
                    </button>
                    <p v-if="message" class="message">{{ message }}</p>
                </div>

                <div class="item">
                    <router-link to="/" class="button_message button_cancel">{{ $t('pageLog.annuler') }}</router-link>
                </div>
            </div>

            <div v-else>
                <p class="title">{{ $t('user.inscription') }}</p>
                <div class="grid">
                    <div class="container_left">
                        <div class="item both_size">
                            <div class="item">
                                <input :placeholder="$t('user.nom')" v-model="nom_utilisateur" />
                                <hr />
                            </div>

                            <div class="item">
                                <input :placeholder="$t('user.prenom')" v-model="prenom_utilisateur" />
                                <hr />
                            </div>

                        </div>

                        <div class="item">
                            <input :placeholder="$t('user.login')" v-model="login_utilisateur" />
                            <hr />
                        </div>

                        <div class="item">
                            <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur" />
                            <hr />
                        </div>

                        <div class="item">
                            <input type="email" :placeholder="$t('user.mail')" v-model="mail_utilisateur" />
                            <hr />
                        </div>
                    </div>

                    <div class="separator"></div>

                    <div class="container_right">
                        <div class="item">
                            <input type="date" v-model="date_naiss_utilisateur" /><br><br>
                        </div>

                        <div class="item">
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
                        <div v-if="isOther" class="item">
                            <label></label>
                            <input v-model="autre_sexe_utilisateur" :placeholder="$t('user.typeSexe.autre')"></input>
                            <hr />
                        </div>
                    </div>

                </div>
                <br>
                <div class="item">
                    <button type="button" @click="getValuesInscription" class="button_message button_connexion">{{
                        $t('user.buttonInscription') }}</button>
                    <p v-if="message" class="message">{{ message }}</p>
                </div>
                <div class="item">
                    <router-link to="/" class="button_message button_cancel">{{ $t('pageLog.annuler') }}</router-link>
                </div>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { useUserStore } from '@/stores/user';
import { useRoute } from "vue-router";

const route = useRoute();
const showRegister = ref(route.name === 'Inscription_utilisateur');

const { t } = useI18n();

const login_utilisateur_connexion = ref("");
const mdp_utilisateur_connexion = ref("");

const nom_utilisateur = ref("");
const prenom_utilisateur = ref("");
const login_utilisateur = ref("");
const mdp_utilisateur = ref("");
const mail_utilisateur = ref("");
const date_naiss_utilisateur = ref("");
const autre_sexe_utilisateur = ref("");
const sexe_utilisateur = ref("");

const message = ref("");
const connexion = ref(false);
const userId = ref(0);

const router = useRouter();
const userStore = useUserStore();

const isOther = ref(false);


const valueTexts = computed(() => {
    if (showRegister.value) {
        return {
            title: t('pageLog.titreConnecter'),
            texte: t('pageLog.texteConnecter'),
            button: t('user.buttonConnexion')
        }
    } else {
        return {
            title: t('pageLog.titreRejoindre'),
            texte: t('pageLog.texteRejoindre'),
            button: t('user.buttonInscription')
        }
    };
})


async function getValuesConnexion() {
    if (!login_utilisateur_connexion.value || !mdp_utilisateur_connexion.value) {
        message.value = "Veuillez remplir tous les champs obligatoires.";
        return;
    }

    try {
        const res = await axios.post('http://localhost:3000/utilisateur/connexion', {
            login: login_utilisateur.value,
            mdp: mdp_utilisateur.value,
        });
        userStore.setUser(res.data.user.id);
        userId.value = userStore.userId;
        message.value = `Utilisateur connecté avec l'ID : ${res.data.user.id}`;
        connexion.value = true;

        if (connexion.value) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/');
        }
    } catch (err) {
        message.value = `Erreur lors de la connexion : ${err.response?.data?.error || err.message}`;
        console.error(err);
    }
}

async function getValuesInscription() {
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

function moveCard() {
    showRegister.value = !showRegister.value;

    if (showRegister.value) {
        router.push({ name: 'Inscription_utilisateur' });
    } else {
        router.push({ name: 'Connexion_utilisateur' });
    }
}
</script>

<style>
:root {
    /* Font family title */
    --fontFamilyTitle: 'Poppins';

    /* Coordonnées de left_card */
    --coordLeftCardTop: 50%;
    --coordLeftCardLeft: 15%;

    /* Taille de left_card */
    --widthLeftCard35: 35%;
    --widthLeftCard45: 45%;

    /* Taille de left_side */
    --widthLeftSide: 45%;

    /* Couleurs fond dégradé en mode connexion */
    --colorGradientBlue: #1E90FF;
    --colorGradientGreen: #00C853;

    /* Couleurs fond dégradé en mode inscription */
    --colorGradientPurple: #9B59B6;
}
</style>

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
}

.page.moved {
    flex-direction: row-reverse;
}

.left-side {
    width: var(--widthLeftSide);
    position: relative;
    z-index: 1;
    overflow: hidden;
}

/* Créer un cercle */
.left-side::before {
    content: "";
    position: absolute;
    top: -80px;
    left: -80px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, var(--colorGradientBlue), #0057c2);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    z-index: 0;
    pointer-events: none;
}

.left-side.moved::before {
    left: auto;
    right: -80px;
    background: radial-gradient(circle at 70% 30%, var(--colorGradientPurple), var(--colorGradientBlue));
}

/* Créer un autre cercle */
.left-side::after {
    content: "";
    position: absolute;
    bottom: -50px;
    left: 50px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle at 40% 40%, #00C853, #009e40);
    border-radius: 50%;
    z-index: 0;
    opacity: 0.7;
}

.left-side.moved::after {
    left: auto;
    right: 50px;
    background: radial-gradient(circle at 60% 40%, #00C853, #009e40);
}

/* Créer une forme différente */
.blob {
    position: absolute;
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, #1E90FF, #00C853);
    border-radius: 50% 30% 50% 30%;
    top: 10%;
    left: 30%;
    opacity: 0.3;
    z-index: 0;
    transform: rotate(20deg);
}

.blob.moved {
    left: auto;
    right: 30%;
}

/* Créer une autre forme différente */
.small-blob {
    position: absolute;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #00BCD4, #0097A7);
    border-radius: 50% 40% 60% 50%;
    top: 75%;
    left: 80%;
    opacity: 0.35;
    z-index: 0;
    transform: rotate(-25deg);
}

.small-blob.moved {
    left: auto;
    right: 80%;
}

.background-right {
    flex: 1;
    background: linear-gradient(135deg, var(--colorGradientBlue), var(--colorGradientGreen));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: white;
    z-index: 1;
}

.background-right.moved {
    background: linear-gradient(135deg, var(--colorGradientPurple), var(--colorGradientBlue));
}

.left-card {
    width: var(--widthLeftCard35);
    background: #fffaf1;
    border-radius: 18px;
    padding: 40px 50px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);

    position: absolute;
    left: 15%;
    top: var(--coordLeftCardTop);
    transform: translateY(-50%);
    transition: all 0.5s ease;

    z-index: 2;
}

.left-card:hover {
    transform: translateY(calc(-50% - 3px));
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.left-card.moved {
    transform: translate(calc(30% + var(--widthLeftSide)), -50%);
    width: var(--widthLeftCard45);
}

.title {
    font-family: var(--fontFamilyTitle), sans-serif;
    letter-spacing: 1px;
    font-size: 2.2em;
    font-weight: 700;
    color: #1E90FF;
    text-align: center;
    margin-bottom: 25px;
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
    background: linear-gradient(to right, #1E90FF, #00C853);
    margin: 5px 0 0 0;
    padding: 0;

    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.7s ease;
    opacity: 0.5;
}

.item input:focus+hr {
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
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.input_item {
    height: 50px;
}

input:focus {
    outline: none;
}

input::placeholder {
    font-weight: bold;
    letter-spacing: 2px;
}

.mdp_oublie {
    text-align: right;
    margin-bottom: 15px;
}

#button_mdp_oublie {
    border: none;
    background-color: transparent;
    font-size: 0.85em;
    color: #007bff;
    cursor: pointer;
    transition: color 0.25s ease, text-decoration 0.25s ease;
}

#button_mdp_oublie:hover {
    text-decoration: underline;
    color: #0056b3;
}

.button_message {
    display: block;
    border: none;
    border-radius: 6px;
    padding: 10px 15px;
    font-size: 15px;
    cursor: pointer;
    transition: transform 0.1s ease, background-color 0.3s ease;
    width: 100%;
    text-align: center;
    color: #fff;
    text-decoration: none;
}

.button_connexion {
    background: linear-gradient(90deg, #1E90FF, #007bff);
    background-size: 200% 100%;
    transition: all 0.3s;
}

.button_connexion:hover {
    transform: translateY(-2px);
}

.button_cancel {
    background: #fffaf1;
    color: #1E90FF;
    border: 2px solid #1E90FF;
    border-radius: 8px;
    padding: 10px 15px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-align: center;
    display: inline-block;
    width: 100%;
}

.button_cancel:hover {
    background: #e0e7ff;
    border-color: #1E90FF;
    color: #1E90FF;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(30, 144, 255, 0.25);
}

.button_message:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(30, 144, 255, 0.2);
}

.message {
    margin-top: 12px;
    font-weight: 600;
    color: red;
    text-align: center;
    font-size: 15px;
}

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
    text-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
}

.bg-text p {
    font-size: 1.1em;
    opacity: 0.95;
    font-weight: 400;
    line-height: 1.5;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.button_register {
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    color: black;
    background: #fffaf1;
    font-weight: 600;
    font-size: 1em;
    cursor: pointer;
    margin-top: 20px;
    transition: transform 0.2s ease;
}

.button_register:hover {
    transform: translateY(-2px);
}

.button_register:focus+.left-card {
    transform: translateX(calc(-50% - 300px));
}

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
    background-color: #ccc;
    margin: 0 20px;
}

.container_right {
    width: 50%;
    padding: 15px 0px 15px 15px;
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
</style>
