<template>
  <div>
    <p>
      Vous avez {{ nbMessageNotRead }}
      {{ nbMessageNotRead > 1 ? 'messages' : 'message' }} non lus.
    </p>

    <div v-if="messageReceived.length > 0">
      <div v-for="message in messageReceived" :key="message.id" :style="{ fontWeight: message.read_at === null ? 'bold' : 'normal' }">
        <span class="span-message" @click="updateMessageById(message.id_message)">
          {{ message.nom_type_message }}
          <button class="reply-button">
            <img src="../../../public//reply.svg" alt="reply">
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

const mailBoxStore = useMailBoxStore();
const userStore = useUserStore();

const messageReceived = ref([]);
const nbMessageNotRead = ref(0);

onMounted(async () => {
  getMessagesById(userStore.userId);
});

async function getMessagesById(id_user) {
    try {
        const res = await mailBoxStore.getMessagesById(id_user);

        messageReceived.value = res.data.result.messageReceived;
        nbMessageNotRead.value = res.data.result.nbMessageNotRead;
    } catch (err) {
    console.error(err);
    }
}

async function updateMessageById(id_message) {
  try {
    await mailBoxStore.updateMessageById(userStore.userId, id_message);
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

.reply-button {
  border: none;
  text-decoration: none;
  background: transparent;
}
</style>