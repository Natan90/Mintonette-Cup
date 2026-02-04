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
    </div>
</template>


<script setup>
import { ref } from 'vue';
import NavView from '@/components/NavView.vue';


const deleting = ref(false);
const refusing = ref(false);

const closeMessageSuppr = () => {
    deleting.value = false;
};

const closeMessageRefus = () => {
    refusing.value = false;
};

</script>


<style scoped>
.main_content {
    margin-left: 20px;
    padding: 30px;
    min-height: 100vh;
}
</style>