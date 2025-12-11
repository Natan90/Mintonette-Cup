<template>
  <div class="modify-account-container">
    <div class="modify-account-card">
      <div class="card-header">
        <h1>{{ $t('account.modifyAccount') }}</h1>
        <router-link to="/" class="close-btn">&times;</router-link>
      </div>

      <div v-if="loading" class="loading">
        <p>{{ $t('account.loading') }}</p>
      </div>

      <div v-else class="form-content">
        <form @submit.prevent="updateUserInfo">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="prenom">{{ $t('user.prenom') }}</label>
              <input
                id="prenom"
                v-model="formData.prenom"
                type="text"
                :placeholder="$t('user.prenom')"
              />
            </div>

            <div class="form-group full-width">
              <label for="nom">{{ $t('user.nom') }}</label>
              <input
                id="nom"
                v-model="formData.nom"
                type="text"
                :placeholder="$t('user.nom')"
              />
            </div>

            <div class="form-group full-width">
              <label for="login">{{ $t('user.login') }}</label>
              <input
                id="login"
                v-model="formData.login"
                type="text"
                :placeholder="$t('user.login')"
              />
            </div>

            <div class="form-group full-width">
              <label for="mail">{{ $t('user.mail') }}</label>
              <input
                id="mail"
                v-model="formData.mail"
                type="email"
                :placeholder="$t('user.mail')"
              />
            </div>

            <div class="form-group full-width">
              <label for="tel">{{ $t('user.tel_utilisateur') }}</label>
              <input
                id="tel"
                v-model="formData.tel_utilisateur"
                type="tel"
                pattern="[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}"
                :placeholder="$t('user.tel_utilisateur')"
              />
            </div>

            <div class="form-group full-width">
              <label>{{ $t('user.sexe') }}</label>
              <div class="radio-group">
                <div class="radio-option">
                  <input
                    id="sexe-h"
                    v-model="formData.sexe"
                    type="radio"
                    :value="$t('user.typeSexe.homme')"
                    name="sexe"
                  />
                  <label for="sexe-h">{{ $t('user.typeSexe.homme') }}</label>
                </div>

                <div class="radio-option">
                  <input
                    id="sexe-f"
                    v-model="formData.sexe"
                    type="radio"
                    :value="$t('user.typeSexe.femme')"
                    name="sexe"
                  />
                  <label for="sexe-f">{{ $t('user.typeSexe.femme') }}</label>
                </div>

                <div class="radio-option">
                  <input
                    id="sexe-a"
                    v-model="formData.sexe"
                    type="radio"
                    :value="$t('user.typeSexe.autre')"
                    name="sexe"
                  />
                  <label for="sexe-a">{{ $t('user.typeSexe.autre') }}</label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? $t('account.saving') : $t('account.save') }}
            </button>
            <router-link to="/" class="btn btn-secondary">
              {{ $t('pageLog.annuler') }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();


const loading = ref(true);
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('');

const formData = ref({
  prenom: '',
  nom: '',
  login: '',
  mail: '',
  tel_utilisateur: '',
  sexe: ''
});
onMounted(async () => {
  if (!userStore.isConnected) {
    router.push({ name: 'Connexion_utilisateur' });
    return;
  }

  // Récupérer les informations de l'utilisateur
  try {
    console.log('Fetching user data for ID:', userStore.userId);
    const response = await axios.get(`/admin/show/${userStore.userId}`);
    console.log('User data received:', response.data);
    
    formData.value = {
      prenom: response.data.prenom_utilisateur || '',
      nom: response.data.nom_utilisateur || '',
      login: response.data.login_utilisateur || '',
      mail: response.data.mail_utilisateur || '',
      tel_utilisateur: response.data.tel_utilisateur || '',
      sexe: response.data.sexe_utilisateur || ''
    };
    
    console.log('Form data updated:', formData.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    message.value = t('account.errorLoading');
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
});

const updateUserInfo = async () => {
  if (isSubmitting.value) return;

  if (!formData.value.prenom || !formData.value.nom || !formData.value.login || !formData.value.mail) {
    message.value = t('account.requiredFields');
    messageType.value = 'error';
    return;
  }

  isSubmitting.value = true;
  message.value = '';

  try {
    const response = await axios.put(`/utilisateur/auth/${userStore.userId}`, {
      prenom: formData.value.prenom,
      nom: formData.value.nom,
      login: formData.value.login,
      mail: formData.value.mail,
      tel_utilisateur: formData.value.tel_utilisateur,
      sexe: formData.value.sexe
    });

    message.value = t('account.updateSuccess');
    messageType.value = 'success';

    setTimeout(() => {
      router.push({ name: 'Home' });
    }, 2000);
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    
    if (error.response?.status === 409) {
      message.value = t('account.emailAlreadyUsed');
    } else {
      message.value = t('account.updateError');
    }
    messageType.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modify-account-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modify-account-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 3px solid #667eea;
}

.card-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.close-btn {
  font-size: 32px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
}

.form-content {
  padding: 30px;
}

.loading {
  padding: 40px 30px;
  text-align: center;
  font-size: 18px;
  color: #666;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"] {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input[type="text"]:focus,
.form-group input[type="email"]:focus,
.form-group input[type="tel"]:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-option input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.radio-option label {
  cursor: pointer;
  margin: 0;
  text-transform: none;
  letter-spacing: normal;
  font-weight: normal;
  color: #555;
}

.message {
  padding: 12px 15px;
  margin: 20px 0;
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

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  text-align: center;
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
  transform: translateY(-2px);
}

.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 600px) {
  .modify-account-card {
    border-radius: 0;
  }

  .card-header {
    padding: 20px;
  }

  .card-header h1 {
    font-size: 24px;
  }

  .form-content {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
