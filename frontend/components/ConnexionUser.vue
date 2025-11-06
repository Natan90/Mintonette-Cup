<template>
    <div class="page">
        <div class="left-side">
            <div class="blob"></div>
            <div class="ellipse"></div>
            <div class="small-circle"></div>
            <div class="small-blob"></div>
        </div>

        <div class="left-card">
            <p class="title">{{ $t('user.connexion') }}</p>

            <div class="item input_item">
                <input :placeholder="$t('user.login')" v-model="login_utilisateur" />
                <hr />
            </div>

            <div class="item input_item">
                <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur" />
                <hr />
            </div>

            <div class="mdp_oublie">
                <button id="button_mdp_oublie"><u>Mot de passe oublié</u></button>
            </div>

            <div class="item">
                <button @click="getValues" class="button_message button_connexion">
                    {{ $t('user.buttonConnexion') }}
                </button>
                <p v-if="message" id="message">{{ message }}</p>
            </div>

            <div class="item">
                <router-link to="/" class="button_message button_cancel">Annuler</router-link>
            </div>
        </div>

        <div class="background-right">
            <div class="bg-text">
                <h1>Rejoignez-nous !</h1>
                <p>Vous n’avez pas encore de compte ? Inscrivez-vous et commencez votre voyage avec nous dès
                    aujourd’hui.</p>
                    <button @click="router.push('/register')" class="button_register">
                        S’inscrire
                    </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from '@/stores/user';

const login_utilisateur = ref("");
const mdp_utilisateur = ref("");

const message = ref("");
const connexion = ref(false);
const userId = ref(0);

const router = useRouter();
const userStore = useUserStore();


async function getValues() {
    if (!login_utilisateur.value || !mdp_utilisateur.value) {
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
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.page {
    display: flex;
    height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.page::after {
    content: "";
    position: absolute;
    top: -80px;
    left: -80px;
    width: 200px;
    height: 200px;
    background: #1E90FF;
    border-radius: 50%;
    z-index: 0;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
}

.left-side {
    width: 45%;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.left-side::before {
    content: "";
    position: absolute;
    top: -80px;
    left: -80px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #1E90FF, #0057c2);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    z-index: 0;
    pointer-events: none;
}

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

.background-right {
    flex: 1;
    background: linear-gradient(135deg, #1E90FF, #00C853);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: white;
    z-index: 1;
}

.left-card {
    width: 35%;
    background: #fffaf1;
    border-radius: 18px;
    padding: 40px 50px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);

    position: absolute;
    left: 15%;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    z-index: 2;
}

.left-card:hover {
    transform: translateY(calc(-50% - 3px));
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.title {
    font-family: 'Poppins', sans-serif;
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
    box-shadow: 0 4px 15px rgba(30,144,255,0.25);
}

.button_message:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(30,144,255,0.2);
}

#message {
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

</style>
