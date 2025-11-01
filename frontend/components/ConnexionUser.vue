<template>
    <router-link to="/">{{ $t('homeLink') }}</router-link>
    <div class="container">
        <div class="content">
            <div class="item">
                <label>{{ $t('user.login') }}</label><br>
                <input :placeholder="$t('user.login')" v-model="login_utilisateur" />
            </div>

            <div class="item">
                <label>{{ $t('user.mdp') }}</label><br>
                <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur" />
            </div>

            <div class="mdp_oublie">
                <button id="button_mdp_oublie"><u>Mot de passe oublié</u></button>
            </div>
            <div class="item">
                <button type="button" @click="getValues" id="button_message">{{ $t('user.buttonConnexion') }}</button>
                <p v-if="message" id="message">{{ message }}</p>
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
        userStore.setUser(res.data.utilisateur.id_utilisateur);
        userId.value = userStore.userId;
        message.value = `Utilisateur connecté avec l'ID : ${userId.value}`;          // Id de l'utilisateur connecté
        connexion.value = true;

        if (connexion.value) {
            await new Promise(resolve => setTimeout(resolve, 1000));        // Pause de 1 seconde pour pouvoir faire une animation de chargement (ou ne pas retourner à l'accueil direct)
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
    gap: 15px;
    height: 80vh;
}

.content {
    background-color: #ffffff;
    padding: 40px 50px;
    border-radius: 15px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 500px;
    max-width: 90vh;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.content:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

label {
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
}

input {
    display: block;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    width: 100%;
    transition: border-color 0.2s ease;
}

input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
}

.mdp_oublie {
    padding-bottom: 10px;
}

#button_mdp_oublie {
    border: none;
    background-color: transparent;
    font-size: 0.8em;
    
    cursor: pointer;
}

#button_mdp_oublie:hover {
    
}

#button_message {
    display: block;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 10px 15px;
    font-size: 15px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    width: 100%;
}

#button_message:hover {
    background-color: #0056b3;
}

#button_message:active {
    transform: scale(0.98);
}

#message {
    margin-top: 15px;
    font-weight: 600;
    color: red;
    text-align: center;
}
</style>