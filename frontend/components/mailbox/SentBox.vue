<template>
  <div>
    <div v-if="messageSent.length > 0">
      <div v-for="message in messageSent" :key="message.id">
        {{ message.message }}
      </div>
    </div>

    <div v-else>
      <p>Vous n'avez pas encore envoyé de messages.</p>
    </div>
  </div>
</template>
<!-- Changer le style ici pour l'affichage des message envoyé -->

<script setup>
import { onMounted, ref } from "vue";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useUserStore } from "@/stores/user";

const mailBoxStore = useMailBoxStore();
const userStore = useUserStore();

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
    } catch (err) {

    }
}
</script>



<style scoped>
    
</style>