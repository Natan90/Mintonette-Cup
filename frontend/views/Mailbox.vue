<template>
    <NavView></NavView>
    <div class="main_content">
        <h1 class="page_title">
            {{ $t('boiteRecep.titre') }}
        </h1>
        <p class="backgroundBorderL page_subtitle">
            {{ $t('boiteRecep.texte') }}
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
        <hr class="hr">
        <div class="buttonMailboxContainer">
            <RouterLink :to="{ name: 'ReceptionBox' }" class="buttonMailbox">
               <b>{{ $t('boiteRecep.boiteReception') }}</b>
            </RouterLink>

            <RouterLink :to="{ name: 'SentBox' }" class="buttonMailbox">
               <b>{{ $t('boiteRecep.messageEnvoye') }}</b>
            </RouterLink>
        </div>

        <RouterView />

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
.buttonMailboxContainer{
    display: flex;
    justify-content: space-evenly;
}
.buttonMailbox{
    text-decoration: none;
    color: var(--primary-color);
    background-color: var(--rose-pale);
    padding: 10px;
    border-radius: 15px;
    margin-top: 20px;
}
.buttonMailbox.router-link-active,
.buttonMailbox.router-link-exact-active,
.buttonMailbox:hover {
    background-color: var(--rose);
    color: var(--rose-pale);
}
.hr{
    margin-top: 40px;
    margin-bottom: 15px;
}
</style>