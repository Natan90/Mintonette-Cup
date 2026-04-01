<template>
  <section class="barre_menu">
    <div class="bloc_boutons">
      <router-link
        v-for="(item, index) in menu"
        :key="index"
        :to="{ name: item.linkName, params: { lang: locale } }">
        {{ item.name }}
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";

const { locale } = useI18n();
const userStore = useUserStore();

const menu = ref([
  { name: "Évènement", linkName: "Evenement" },
  { name: "Utilisateurs", linkName: "Utilisateurs" },
  { name: "Prestataire", linkName: "Prestataires" },
  { name: "Statistiques", linkName: "Statistiques" },
  { name: "Commentaire", linkName: "AdminCommentaire" },
]);
</script>

<style scoped>
.barre_menu {
  position: sticky;
  top: 0;
  align-self: flex-start;

  height: 100vh;

  width: 250px;
  max-width: 25%;
  min-width: fit-content;
  padding: 50px 30px;

  background-color: var(--rose-logo);
}

.bloc_boutons{
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 100px;
  gap: 30px;
}

a{
  font-size: large;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
  padding-right: 8px;
}

a:hover{
  padding-right: 0;
  text-indent: 4px;
  transition:  var(--transition-fast);
  border-left: 4px solid var(--primary-color); 
}

@media(max-width: 1000px){
  
  .barre_menu{
    height: auto;
    position: relative;
    max-width: none;
    width: 100vw;
    padding: 20px 0;
  }

  .bloc_boutons{
    width: 100vw;
    justify-content: space-evenly;
    flex-direction: row;
    flex-wrap: wrap;
    top: 0;
    gap: 20px;
  }

  a{
    text-indent: 0;
    padding: 3px 0;
  }

  a:hover{
    padding-right: 0;
    text-indent: 0;
    transition:  var(--transition-fast);
    border-left: none;
    padding-bottom: 0;
    border-bottom: 3px solid var(--primary-color);
  }

}

</style>
