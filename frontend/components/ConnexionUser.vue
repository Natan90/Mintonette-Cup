<template>
    <div class="container">
        <div class="content">
            <p class="title">{{ $t('user.connexion') }}</p>
            <div class="item">
                <label>{{ $t('user.login') }}</label><br>
                <input :placeholder="$t('user.login')" v-model="login_utilisateur" />
            </div>

            <div class="item">
                <label>{{ $t('user.mdp') }}</label><br>
                <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur" />
                <!-- Faire un oeil pour montrer le mot de passe -->
            </div>

            <div class="mdp_oublie">
                <button id="button_mdp_oublie"><u>Mot de passe oublié</u></button>
            </div>

            <!-- Bouton Se connecter -->
            <div class="item">
                <button @click="getValues" class="button_message button_connexion">{{ $t('user.buttonConnexion') }}</button>
                <p v-if="message" id="message">{{ message }}</p>
            </div>
            <div class="item">
                <router-link to="/" class="button_message button_cancel">Annuler</router-link>
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
    display: flex;
    flex-direction: column;
    width: 500px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.content:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
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

label {
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
    background: linear-gradient(90deg, #007bff, #0056b3);
}

.button_connexion:hover {
    background-color: #0056b3;
}

.button_cancel {
    background: linear-gradient(90deg, #e03e3e, #c53030);
}

.button_cancel:hover {
    background-color: #c53030;
}

.button_message:active {
    transform: translateY(1px);
}

#message {
    margin-top: 12px;
    font-weight: 600;
    color: red;
    text-align: center;
    font-size: 15px;
}
</style>
