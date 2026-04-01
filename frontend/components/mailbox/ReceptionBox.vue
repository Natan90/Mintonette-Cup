<template>
  <Modal v-model="isSelectedMessage" :bigger="true">
    <template #content>
      <div class="mail_content">
        <div class="from_and_subject">
          <div class="item_mail">
            <p class="bold">De :</p>
            <p class="name_delete">
              <span
                v-if="
                  messageSelected.prenom_utilisateur === 'Alban' &&
                  messageSelected.nom_utilisateur === 'Robin'
                ">
                Administrateur
              </span>
              <span v-else>
                {{ messageSelected.prenom_utilisateur }}
                {{ messageSelected.nom_utilisateur }}
              </span>
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
          <!-- <p class="mail-text">
            {{ messageSelected.message }}
          </p> -->
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
  <div>
    <p v-if="nbMessageNotRead == 0"></p>
    <p v-else>
      Vous avez {{ nbMessageNotRead }}
      {{ nbMessageNotRead > 1 ? "messages non lus." : "message non lu." }}
    </p>

    <div v-if="messageReceived.length > 0">
      <div
        v-for="message in messageReceived"
        :key="message.id_message"
        :style="{ fontWeight: message.read_at === null ? 'bold' : 'normal' }">
        <span
          class="span-message pointer"
          @click="updateMessageById(message.id_message)">
          {{ message.nom_type_message }}
          <button
            class="action-button"
            type="button"
            @click.stop="deleteMessage(message.id_message)">
            <span>
              <!-- @click.stop pour ne pas ouvrir le message en meme temps -->
              <img
                src="/trash.svg"
                alt="trash"
                @click.stop="deleteMessage(message.id_message)" />
            </span>
          </button>
        </span>
      </div>
    </div>

    <div v-else>
      <p>Votre boîte de réception est vide.</p>
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

const messageReceived = ref([]);
const nbMessageNotRead = ref(0);
const isSelectedMessage = ref(false);
const messageSelected = ref([]);

onMounted(async () => {
  getMessagesById(userStore.userId);
});

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
