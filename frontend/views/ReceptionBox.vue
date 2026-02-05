<template>
    <NavView></NavView>
    <div class="main_content">
        <h1 class="page_title">
            Boîte de réception
        </h1>
        <p class="backgroundBorderL page_subtitle">
            Votre boîte de réception centralise l’ensemble des messages reçus au sein de la plateforme. Elle vous permet de consulter les demandes envoyées par les prestataires de la compétition, de lire les nouveaux messages et de suivre l’évolution des échanges en toute simplicité. Cet espace facilite la gestion des conversations, vous aide à rester informé des demandes en cours et à assurer un suivi clair et organisé des échanges avec les prestataires.
        </p>

        <p class="backgroundBorderL message suppr" v-if="deleting">
            <span class="name_delete">{{ deletedPresta.nom_prestataire }}</span>{{
                $t('adminPage.prestataire.messageSuppr') }}
            <span class="modal-close" @click="closeMessageSuppr">&times;</span>
        </p>
        <p class="backgroundBorderL message refus" v-else-if="refusing">
            <span class="name_delete">{{ refusedPresta.nom_prestataire }}</span>{{
                $t('adminPage.prestataire.messageRefus') }}
            <span class="modal-close" @click="closeMessageRefus">&times;</span>
        </p>

        <div>
            <p>Vous avez {{ nbMessageNotRead }} 
                {{ nbMessageNotRead > 1 ? 'messages' : 'message'}} non lus.
            </p>
            <div v-for="(message, index) in messageReceived" :key="index" v-if="messageReceived.length > 0">
                {{ message.message }}
            </div>
            <div v-else>
                <p>
                    Votre boîte de réception est vide.
                </p>
            </div>

            <div>
            <div v-for="(message, index) in messageSent" :key="index" v-if="messageSent.length > 0">
                {{ message.message }}
            </div>
            <div v-else>
                <p>
                    Votre n'avez pas encore envoyé de messages.
                </p>
            </div>
        </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import NavView from '@/components/NavView.vue';
import { useMailBoxStore } from '@/services/reception_box.service';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const mailBoxStore = useMailBoxStore();
const deleting = ref(false);
const refusing = ref(false);
const messageReceived = ref([]);
const messageSent = ref([]);
const nbMessageNotRead = ref(0);

const closeMessageSuppr = () => {
    deleting.value = false;
};

const closeMessageRefus = () => {
    refusing.value = false;
};

onMounted(() => {
    getMessagesById(userStore.userId);
})


async function getMessagesById(id_user) {
    try {
        const res = await mailBoxStore.getMessagesById(id_user);

        messageReceived.value = res.data.result.messageReceived;
        messageSent.value = res.data.result.messageSent;
        nbMessageNotRead.value = res.data.result.nbMessageNotRead;
    } catch (err) {

    }
}

</script>


<style scoped>
.main_content {
    margin-left: 20px;
    padding: 30px;
    min-height: 100vh;
}
</style>