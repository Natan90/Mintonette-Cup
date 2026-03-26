<template>
  <NavView></NavView>
    <div class="">
        
    </div>
  <Footer></Footer>
</template>

<script setup>
/* ********************
        IMPORTS 
******************** */
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onActivated,
  computed,
  watch,
  nextTick,
} from "vue";
import { useI18n } from "vue-i18n";
/* ********************
    PAGES IMPORTS 
******************** */
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import { useCommentaire } from "@/services/commentaire.service";



const { locale } = useI18n();

/* ********************
    Commentaire Values
******************** */
//const
</script>
<style scoped></style>
