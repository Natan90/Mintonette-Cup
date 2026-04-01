<template>
  <Modal v-model="isSelectedMessage" :bigger="true">
    <template #content>
      <div class="mailContent">
        <div class="from_and_subject">
          <div class="itemMail">
            <p class="bold">{{ $t("boiteRecep.recu.de") }}</p>
            <p class="name_delete">
              <span
                v-if="
                  messageSelected.prenom_utilisateur === 'Alban' &&
                  messageSelected.nom_utilisateur === 'Robin'
                ">
                {{ $t("boiteRecep.recu.administrateur") }}
              </span>
              <span v-else>
                {{ messageSelected.prenom_utilisateur }}
                {{ messageSelected.nom_utilisateur }}
              </span>
            </p>
          </div>
          <div class="itemMail">
            <p class="bold">{{ $t("boiteRecep.recu.objet") }}</p>
            <p class="name_delete">
              {{ translateMailboxValue(messageSelected.subject) }}
            </p>
          </div>
        </div>
        <div class="itemMail">
          <div class="itemMail">
            <p
              class="mailText"
              v-html="translateMailboxValue(messageSelected.message)"></p>
          </div>
        </div>

        <div class="containerButton">
          <button
            class="buttonMailbox"
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

  <div class="mailboxContainer">
    <p v-if="nbMessageNotRead == 0" class="nbOfMessage nbOfMessageEmpty">
      {{ $t("boiteRecep.recu.aucunNonLu") }}
    </p>
    <p v-else class="nbOfMessage">
      {{ $t("boiteRecep.recu.vousAvez") }} <b>{{ nbMessageNotRead }}</b>
      {{
        nbMessageNotRead > 1
          ? $t("boiteRecep.recu.nonLuPluriel")
          : $t("boiteRecep.recu.nonLuSingulier")
      }}
    </p>

    <div v-if="messageReceived.length > 0" class="listMessageContainer">
      <div
        v-for="message in messageReceived"
        :key="message.id_message"
        :class="['messageRow', { messageRowUnread: message.read_at === null }]">
        <span
          class="spanMessage pointer"
          @click="updateMessageById(message.id_message)">
          <span class="messageLabel">
            {{
              $t(
                "boiteRecep.types." + message.nom_type_message,
                message.nom_type_message,
              )
            }}
          </span>
          <button
            class="buttonMailbox"
            type="button"
            @click.stop="deleteMessage(message.id_message)">
            <span>
              <img src="/trash.svg" alt="trash" />
            </span>
          </button>
        </span>
      </div>
    </div>

    <div v-else class="emptyMailbox">
      <p>{{ $t("boiteRecep.recu.boiteVide") }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAdminAPIStore } from "@/services/admin.service";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useUserStore } from "@/stores/user";
import Modal from "../Modal.vue";

const mailBoxStore = useMailBoxStore();
const adminAPIStore = useAdminAPIStore();
const userStore = useUserStore();
const { t } = useI18n();

const messageReceived = ref([]);
const nbMessageNotRead = ref(0);
const isSelectedMessage = ref(false);
const messageSelected = ref([]);
const currentUser = ref(null);

onMounted(async () => {
  await loadCurrentUser();
  getMessagesById(userStore.userId);
});

async function loadCurrentUser() {
  try {
    const response = await adminAPIStore.GetCurrentUser();
    currentUser.value = response.data;
  } catch {
    currentUser.value = null;
  }
}

function translateMailboxValue(value) {
  if (typeof value !== "string" || !value.startsWith("mailToSend.")) {
    return value;
  }

  return t(value, {
    nomUtilisateur: currentUser.value
      ? `${currentUser.value.prenom_utilisateur || ""} ${currentUser.value.nom_utilisateur || ""}`.trim()
      : "",
    emailUtilisateur: currentUser.value?.mail_utilisateur || "",
    lienVersCommentaire: window.location.origin,
  });
}

/**
 * Récupère tous les messages reçus ainsi que le nombre de messages non lus pour un utilisateur donné.
 * @param {number} id_user - Identifiant de l'utilisateur
 */
async function getMessagesById(id_user) {
  try {
    const res = await mailBoxStore.getMessagesById(id_user);

    messageReceived.value = res.data.result.messageReceived;
    nbMessageNotRead.value = res.data.result.nbMessageNotRead;
  } catch (err) {
    console.error(err);
  }
}
async function deleteMessage(id_message) {
  if (!confirm(t("boiteRecep.recu.supprimer"))) return;

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
    console.log(messageSelected.value);
  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped>
.mailboxContainer {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nbOfMessage {
  margin: 0;
  color: var(--primary-dark);
  font-weight: 600;
}

.nbOfMessageEmpty {
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

.messageRow {
  background: #ffffff;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border-bottom: 1px solid rgba(221, 208, 204, 0.7);
}

.messageRow:hover {
  background-color: #eef5ef;
}

.messageRowUnread .messageLabel {
  font-weight: 700;
  color: var(--primary-dark);
}

.messageRowUnread {
  border-left: 4px solid var(--rose-hover);
}

.spanMessage {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  cursor: pointer;
  color: var(--primary-dark);
}

.buttonMailbox {
  border: none;
  text-decoration: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--rose-hover);
}

.buttonMailbox:hover {
  transform: scale(1.08);
  transition: transform 0.2s ease;
}

.buttonMailbox img {
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

.mailContent {
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

.itemMail {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
}

.itemMail p {
  margin: 0;
}

.containerButton {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.containerButton .buttonMailbox {
  background: var(--rose-pale);
  border-radius: 999px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(232, 99, 122, 0.12);
}

.containerButton .buttonMailbox:hover {
  background: #fde7ea;
}

.emptyMailbox {
  background: var(--log-card-bg);
  border: 1.5px dashed var(--log-border);
  border-radius: 18px;
  padding: 18px 20px;
  color: #71807a;
  box-shadow: 0 8px 20px rgba(58, 111, 67, 0.05);
}

.mailText {
  text-align: left;
  white-space: pre-line;
  color: #2a3d2e;
}
</style>
