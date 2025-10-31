<template>
    <router-link to="/">{{ $t('homeLink') }}</router-link>
    <div>
        <label>{{ $t('user.login') }}</label><br>
        <input :placeholder="$t('user.login')" v-model="login_utilisateur" /><br><br>

        <label>{{ $t('user.mdp') }}</label><br>
        <input type="password" :placeholder="$t('user.mdp')" v-model="mdp_utilisateur" /><br><br>

        <br>
        <button type="button" @click="getValues">{{ $t('user.buttonConnexion') }}</button>
        <p v-if="message">{{ message }}</p>
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
