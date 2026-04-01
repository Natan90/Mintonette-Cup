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
          <button
            class="action-button"
            type="button"
            @click="deleteMessage(messageSelected.id_message)">
            <span>
              <img src="/trash.svg" alt="trash" />
            </span>
          </button>
        </div>
      </div>
    </template>
  </Modal>

  <div class="mailbox-shell">
    <p
      v-if="messageSent.length == 0"
      class="mailbox-status mailbox-status--empty">
      Vous n'avez pas encore envoyé de messages.
    </p>
    <p v-else class="mailbox-status">
      Vous avez envoyé <b>{{ messageSent.length }}</b>
      {{ messageSent.length > 1 ? "messages" : "message" }}
    </p>

    <div v-if="messageSent.length > 0" class="listMessageContainer">
      <div
        v-for="message in messageSent"
        :key="message.id_message"
        :class="['message-row']">
        <span
          class="span-message pointer"
          @click="updateMessageById(message.id_message)">
          <span class="message-label">
            {{ message.nom_type_message }}
          </span>
          <button
            class="action-button"
            type="button"
            @click.stop="deleteMessage(message.id_message)">
            <span>
              <img src="/trash.svg" alt="trash" />
            </span>
          </button>
        </span>
      </div>
    </div>

    <div v-else class="mailbox-empty">
      <p>Votre boîte d'envoi est vide.</p>
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
.mailbox-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mailbox-status {
  margin: 0;
  color: var(--primary-dark);
  font-weight: 600;
}

.mailbox-status--empty {
  color: #71807a;
}

.listMessageContainer {
  border-radius: 18px;
  overflow: hidden;
  background: var(--log-card-bg);
  border: 1.5px solid var(--log-border);
  box-shadow:
    0 8px 20px rgba(58, 111, 67, 0.08),
    0 2px 8px rgba(232, 99, 122, 0.04);
}

.message-row {
  background: #ffffff;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border-bottom: 1px solid rgba(221, 208, 204, 0.7);
}

.message-row:last-child {
  border-bottom: none;
}

.message-row:hover {
  background-color: #eef5ef;
}

.span-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  cursor: pointer;
  color: var(--primary-dark);
}

.message-label {
  font-weight: 500;
}

.action-button {
  border: none;
  text-decoration: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--rose-hover);
}

.action-button:hover {
  transform: scale(1.08);
  transition: transform 0.2s ease;
}

.action-button img {
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

.mail_content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px;
  background: var(--log-card-bg);
  border-radius: 18px;
  border: 1.5px solid var(--log-border);
  box-shadow:
    0 8px 30px rgba(58, 111, 67, 0.1),
    0 2px 8px rgba(232, 99, 122, 0.06);
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

.container_button .action-button {
  background: var(--rose-pale);
  border-radius: 999px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(232, 99, 122, 0.12);
}

.container_button .action-button:hover {
  background: #fde7ea;
}

.mailbox-empty {
  background: var(--log-card-bg);
  border: 1.5px dashed var(--log-border);
  border-radius: 18px;
  padding: 18px 20px;
  color: #71807a;
  box-shadow: 0 8px 20px rgba(58, 111, 67, 0.05);
}

.mail-text {
  text-align: left;
  white-space: pre-line;
  color: #2a3d2e;
}

.mailText {
  text-align: left;
  white-space: pre-line;
  color: #2a3d2e;
}
</style>
