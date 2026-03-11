<template>
  <router-view />
</template>

<script setup>
import { useIdle } from '@vueuse/core'
import { watch } from 'vue'
import { useUserStore } from './stores/user';

const { idle, lastActive } = useIdle(1 * 60 * 1000);
const userStore = useUserStore();


watch(idle, (isIdle) => {
  if (isIdle) {
    console.log("Utilisateur inactif");
  } else {
    console.log("Utilisateur actif");
    if (userStore.isConnected) {
      if (userStore.getRemainingDelay() > 0) {
        const payload = JSON.parse(atob(userStore.token.split('.')[1]));
        const duration = (payload.exp - payload.iat) * 1000;
        userStore.runLogoutTimer(duration);
        console.log("Timer réinitialisé, durée de base :", duration);
      } else {
        userStore.logout();
      }
    }
  }
})
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}
</style>
