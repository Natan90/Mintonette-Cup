<template>
  <div class="barre_menu">
    <router-link v-for="(item, index) in menu" :key="index" :to="{ name: item.linkName, params: { lang: locale } }">
      {{ item.name }}
    </router-link>
  </div>
</template>



<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const menu = ref([
  { name: "Évènement", linkName: "Evenement" },
  { name: "Utilisateurs", linkName: "Utilisateurs" },
  { name: "Prestataire", linkName: "Prestataires" },
  { name: "Statistiques", linkName: "Statistiques" }
]);

</script>



<style scoped>
.barre_menu {
  background-color: yellow;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 250px;
  position: fixed;
  align-items: center;
}

</style>