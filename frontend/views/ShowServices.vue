<template>
    <NavView></NavView>
    <div>
        <div class="bloc_texte">
            <h1 class="page_title">
                {{ $t('adminPage.prestataire.service.title') }}
            </h1>
            <p v-html="$t('adminPage.prestataire.service.descri')" class="backgroundBorderL page_subtitle"></p>

        </div>
    </div>
</template>



<script setup>
import NavView from '@/components/NavView.vue';


</script>





<style scoped></style>