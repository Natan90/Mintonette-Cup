<template>
  <v-dialog v-model="isConfirmOpen" max-width="500">
    <v-card :title="$t('boiteRecep.envoye.supprimer')">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :text="$t('commun.annuler')" @click="cancelDelete"></v-btn>
        <v-btn
          color="error"
          :text="$t('commun.confirmer')"
          @click="confirmDelete"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <Modal v-model="isSelectedMessage" :bigger="true">
    <template #content>
      <div class="mail_content">
        <div class="from_and_subject">
          <div class="item_mail">
            <p class="bold">{{ $t("boiteRecep.envoye.de") }}</p>
            <p class="name_delete">
              {{ messageSelected.prenom_utilisateur }}
              {{ messageSelected.nom_utilisateur }}
            </p>
          </div>
          <div class="item_mail">
            <p class="bold">{{ $t("boiteRecep.envoye.objet") }}</p>
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
            @click="askDeleteMessage(messageSelected.id_message)">
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
      {{ $t("boiteRecep.envoye.aucunMessage") }}
    </p>
    <p v-else class="mailbox-status">
      {{ $t("boiteRecep.envoye.vousAvezEnvoye") }}
      <b>{{ messageSent.length }}</b>
      {{
        messageSent.length > 1
          ? $t("boiteRecep.envoye.messagePluriel")
          : $t("boiteRecep.envoye.messageSingulier")
      }}
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
            {{
              $t(
                "boiteRecep.types." + message.nom_type_message,
                message.nom_type_message,
              )
            }}
          </span>
          <button
            class="action-button"
            type="button"
            @click.stop="askDeleteMessage(message.id_message)">
            <span>
              <img src="/trash.svg" alt="trash" />
            </span>
          </button>
        </span>
      </div>
    </div>

    <div v-else class="mailbox-empty">
      <p>{{ $t("boiteRecep.envoye.boiteVide") }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAdminAPIStore } from "@/services/admin.service";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useUserStore } from "@/stores/user";
import Modal from "../Modal.vue";

const mailBoxStore = useMailBoxStore();
const adminAPIStore = useAdminAPIStore();
const userStore = useUserStore();
const isSelectedMessage = ref(false);
const messageSelected = ref([]);
const currentUser = ref(null);
const isConfirmOpen = ref(false);
const pendingDeleteId = ref(null);
const shouldReopenMessage = ref(false);

const messageSent = ref([]);

onMounted(async () => {
  await loadCurrentUser();
  getMessagesById(userStore.userId);
});

/**
 * Charge les informations de l'utilisateur actuellement connecté
 * et les stocke dans la variable réactive `currentUser`.
 * En cas d'erreur, la valeur est réinitialisée à null.
 */
async function loadCurrentUser() {
  try {
    const response = await adminAPIStore.GetCurrentUser();
    currentUser.value = response.data;
  } catch {
    currentUser.value = null;
  }
}

/**
 * Récupère tous les messages envoyés pour un utilisateur donné.
 * @param {number} id_user - Identifiant de l'utilisateur
 */
async function getMessagesById(id_user) {
  try {
    const res = await mailBoxStore.getMessagesById(id_user);
    messageSent.value = res.data.result.messageSent;
  } catch (err) {}
}

/**
 * Marque un message comme lu, recharge la liste des messages envoyés
 * et récupère le détail du message sélectionné.
 * Ouvre la modal d'affichage du message.
 * @param {number|string} id_message - Identifiant du message à mettre à jour et afficher
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

/**
 * Ouvre le modal de confirmation et stocke l'id du message à supprimer.
 * @param {number|string} id_message - Identifiant du message à supprimer
 */
function askDeleteMessage(id_message) {
  pendingDeleteId.value = id_message;
  shouldReopenMessage.value =
    isSelectedMessage.value && messageSelected.value?.id_message === id_message;
  isSelectedMessage.value = false;
  isConfirmOpen.value = true;
}

/**
 * Annule la suppression et rouvre le message affiché si nécessaire.
 */
function cancelDelete() {
  isConfirmOpen.value = false;

  if (shouldReopenMessage.value) {
    isSelectedMessage.value = true;
  }

  pendingDeleteId.value = null;
  shouldReopenMessage.value = false;
}

/**
 * Appelé quand l'utilisateur confirme la suppression dans le modal.
 * Ferme le modal de confirmation puis supprime le message.
 */
async function confirmDelete() {
  isConfirmOpen.value = false;
  await deleteMessage(pendingDeleteId.value);
  pendingDeleteId.value = null;
  shouldReopenMessage.value = false;
}

/**
 * Supprime un message envoyé.
 * Si le message supprimé est actuellement sélectionné, la sélection est réinitialisée.
 * Recharge ensuite la liste des messages envoyés.
 * @param {number|string} id_message - Identifiant du message à supprimer
 */
async function deleteMessage(id_message) {
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

/* Confirmation dialog */
.confirm-dialog {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px;
  text-align: center;
  color: var(--primary-dark);
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  padding: 8px 20px;
  border-radius: 999px;
  border: 1.5px solid var(--log-border);
  background: transparent;
  cursor: pointer;
  color: var(--primary-dark);
  font-weight: 500;
  transition: background 0.2s ease;
}

.btn-cancel:hover {
  background: #eef5ef;
}

.btn-confirm {
  padding: 8px 20px;
  border-radius: 999px;
  border: none;
  background: var(--rose-hover);
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.btn-confirm:hover {
  background: #d9556f;
}
</style>
