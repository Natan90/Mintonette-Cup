<template>
  <NavView></NavView>
  <div class="page">
    <div class="formulaire">
      <div class="titre_formulaire">
        <h1>{{ $t('account.myAccount') }}</h1>
        <router-link to="/" class="croix pointer">&times;</router-link>
      </div>

      <div v-if="loading" class="loading">
        <p>{{ $t('account.loading') }}</p>
      </div>

      <div v-else>
        <section class="infos_utilisateur">
          <div class="bloc_information">
            <label>{{ $t('user.prenom') }}</label>
            <p class="text-value">{{ userData.prenom }}</p>
          </div>

          <div class="bloc_information">
            <label>{{ $t('user.nom') }}</label>
            <p class="text-value">{{ userData.nom }}</p>
          </div>

          <div class="bloc_information">
            <label>{{ $t('user.login') }}</label>
            <p class="text-value">{{ userData.login }}</p>
          </div>

          <div class="bloc_information">
            <label>{{ $t('user.mail') }}</label>
            <p class="text-value">{{ userData.mail }}</p>
          </div>

          <div class="bloc_information">
            <label>{{ $t('user.tel_utilisateur') }}</label>
            <p class="text-value">{{ userData.tel_utilisateur || 'N/A' }}</p>
          </div>

          <div class="bloc_information">
            <label>{{ $t('user.sexe') }}</label>
            <p class="text-value">{{ userData.sexe || 'N/A' }}</p>
          </div>
        </section>

        <div class="created-at-info">
          <p>{{ $t('account.createdAt') }} : <strong>{{ userData.createdAt || 'N/A' }}</strong></p>
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>

        <div class="boutons">
          <router-link to="/utilisateur/modifier" class="pointer">
            {{ $t('account.modify') }}
          </router-link>
          <router-link to="/Panier" class="pointer">
            {{ $t('account.viewCart') }}
          </router-link>
          <button @click="deleteAccount" class="pointer delete-btn" :disabled="isDeleting">
            {{ isDeleting ? $t('account.deleting') : $t('account.deleteAccount') }}
          </button>
          <router-link to="/">
            {{ $t('pageLog.annuler') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import NavView from '@/components/NavView.vue';
import Footer from '@/components/Footer.vue';

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const loading = ref(true);
const message = ref('');
const messageType = ref('');
const isDeleting = ref(false);

const userData = ref({
  prenom: '',
  nom: '',
  login: '',
  mail: '',
  tel_utilisateur: '',
  sexe: '',
  createdAt: ''
});

// Vérifier que l'utilisateur est connecté et charger ses données
onMounted(async () => {
  if (!userStore.isConnected) {
    router.push({ name: 'Connexion_utilisateur' });
    return;
  }

  // Récupérer les informations de l'utilisateur
  try {
    console.log('Fetching user data for ID:', userStore.userId);
    const response = await axios.get(`http://localhost:3000/admin/show/${userStore.userId}`);
    console.log('User data received:', response.data);
    
    // Formater la date si elle existe
    let formattedDate = '';
    if (response.data.date_creation_utilisateur) {
      const date = new Date(response.data.date_creation_utilisateur);
      formattedDate = date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    userData.value = {
      prenom: response.data.prenom_utilisateur || '',
      nom: response.data.nom_utilisateur || '',
      login: response.data.login_utilisateur || '',
      mail: response.data.mail_utilisateur || '',
      tel_utilisateur: response.data.tel_utilisateur || '',
      sexe: response.data.sexe_utilisateur || '',
      createdAt: formattedDate
    };
    
    console.log('User data updated:', userData.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    message.value = t('account.errorLoading');
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
});

// Fonction pour supprimer le compte
const deleteAccount = async () => {
  if (!confirm(t('account.confirmDelete'))) {
    return;
  }

  isDeleting.value = true;
  message.value = '';

  try {
    await axios.delete(`http://localhost:3000/admin/${userStore.userId}`);
    
    message.value = t('account.accountDeleted');
    messageType.value = 'success';
    
    // Déconnecter l'utilisateur
    userStore.logout();
    
    // Rediriger après 2 secondes
    setTimeout(() => {
      router.push({ name: 'Home' });
    }, 2000);
  } catch (error) {
    console.error('Erreur lors de la suppression du compte :', error);
    message.value = t('account.deleteError');
    messageType.value = 'error';
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f0f0f0;
}

.formulaire {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  overflow: hidden;
}

.titre_formulaire {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  border-radius: 10px 10px 0 0;
  padding: 20px;
  background-color: var(--jaune-logo);
  color: black;
}

.titre_formulaire h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
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

.text-value {
  margin: 0;
  font-size: 16px;
  color: #333;
  word-break: break-word;
}

.message {
  padding: 12px 15px;
  margin: 20px;
  border-radius: 8px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.created-at-info {
  padding: 12px 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  margin: 0;
}

.created-at-info p {
  margin: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.boutons a {
  font-size: 16px;
  font-weight: bolder;
  color: black;
  border-radius: 10px;
  padding: 6px;
  text-decoration: none;
}

.delete-btn {
  font-size: 16px;
  font-weight: bolder;
  color: white;
  background-color: #dc3545;
  border: none;
  border-radius: 10px;
  padding: 6px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.delete-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.boutons a:hover {
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

@media (max-width: 600px) {
  .formulaire {
    border-radius: 0;
  }

  .titre_formulaire {
    padding: 15px;
  }

  .titre_formulaire h1 {
    font-size: 24px;
  }

  .infos_utilisateur {
    padding: 15px;
  }

  .info-value {
    width: 100%;
  }

  .boutons {
    flex-direction: column;
    gap: 10px;
  }

  .boutons a {
    width: 100%;
    text-align: center;
  }
}
</style>
