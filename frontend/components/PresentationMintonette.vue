<template>
    <NavView></NavView>

    <div>
        <span>Qu'est ce que la Mintonnette Cup ?</span>

        <span>
            Vous êtes adepte de sport, aimez suivre de grands évenements sportifs qui regroupent passionnés et bonne ambiance ?
            La Mintonnette Cup vous attend !
        </span>

        <span>
            Le grand tournoi de Volley mondial Mintonette Cup arrive à Montpellier !
            Notre première édition s'annonce folle.
        </span>

        <span>

        </span>

    </div>

    <Footer></Footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const content = ref('')
const selectedItem = ref(0)

</script>