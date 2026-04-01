<template>
  <Modal v-model="isSelectedMessage" :bigger="true">
    <template #content>
      <div class="mail_content">
        <div class="from_and_subject">
          <div class="item_mail">
            <p class="bold">De :</p>
            <p class="name_delete">
              {{ messageSelected.prenom_utilisateur }}
              {{ messageSelected.nom_utilisateur }}
            </p>
          </div>
          <div class="item_mail">
            <p class="bold">Objet :</p>
            <p class="name_delete">
              {{ messageSelected.subject }}
            </p>
          </div>
        </div>
        <div class="item_mail">
          <div class="item_mail">
            <p class="mail-text" v-html="messageSelected.message"></p>
          </div>
        </div>

        <div class="container_button">
          <button class="action-button">
            <span>
              <img
                src="/trash.svg"
                alt="trash"
                @click="deleteMessage(message.id_message)" />
            </span>
          </button>
        </div>
      </div>
    </template>
  </Modal>
  <p v-if="messageSent.length == 1">
    Vous avez envoyé {{ messageSent.length }} message
  </p>
  <p v-else-if="messageSent.length == 0">
    Vous n'avez pas encore envoyé de messages.
  </p>
  <p v-else>Vous avez envoyé {{ messageSent.length }} messages</p>
  <div>
    <div v-if="messageSent.length > 0">
      <div
        v-for="message in messageSent"
        :key="message.id_message"
        :style="'normal'">
        <span
          class="span-message pointer"
          @click="updateMessageById(message.id_message)">
          {{ message.nom_type_message }}
          <button class="action-button">
            <span>
              <img
                src="/trash.svg"
                alt="trash"
                @click.stop="deleteMessage(message.id_message)" />
            </span>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useUserStore } from "@/stores/user";
import Modal from "../Modal.vue";

const mailBoxStore = useMailBoxStore();
const userStore = useUserStore();
const isSelectedMessage = ref(false);
const messageSelected = ref([]);

const messageSent = ref([]);

onMounted(async () => {
  getMessagesById(userStore.userId);
});

/**
 * Récupère les messages envoyés par un utilisateur et les stocke dans la liste locale.
 * @param {number|string} id_user - Identifiant de l'utilisateur
 */
async function getMessagesById(id_user) {
  try {
    const res = await mailBoxStore.getMessagesById(id_user);

    messageSent.value = res.data.result.messageSent;
  } catch (err) {}
}

/**
 * Marque un message comme lu, recharge la liste des messages et récupère le détail du message sélectionné.
 * Ouvre également la modal d'affichage du message.
 * @param {number|string} id_message - Identifiant du message à mettre à jour
 */
async function updateMessageById(id_message) {
  isSelectedMessage.value = true;
  try {
    await mailBoxStore.updateMessageById(userStore.userId, id_message);
    await getMessagesById(userStore.userId);

    const res = await mailBoxStore.getMessagesByIdMessage(id_message, true);
    messageSelected.value = res.data;
  } catch (err) {
    console.error(err);
  }
}
async function deleteMessage(id_message) {
  if (!confirm("Supprimer ce message ?")) return;

  try {
    await mailBoxStore.removeMessageById(userStore.userId, id_message);
    if (messageSelected.value?.id_message === id_message) {
      isSelectedMessage.value = false;
      messageSelected.value = [];
    }
    await getMessagesById(userStore.userId);
  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped>
.span-message {
  display: flex;
  justify-content: space-between;
}

.action-button {
  border: none;
  text-decoration: none;
  background: transparent;
}

.mail_content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.item_mail {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
}

.item_mail p {
  margin: 0;
}

.container_button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.mail-text {
  text-align: left;
  white-space: pre-line;
}
</style>
