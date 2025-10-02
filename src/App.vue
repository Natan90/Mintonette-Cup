<template>
    <router-view />
</template>

<script setup>
import NavView from "@/components/NavView.vue";
import Index from "./components/Index.vue";


import Home from '../src/components/Index.vue'
import  Prestataire from '../src/components/Prestataire.vue'


const routes = {
  '/': Home,
  '/Prestataire': Prestataire
}

</script>


<style scoped></style>


