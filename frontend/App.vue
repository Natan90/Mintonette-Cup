<template>
  <router-view />
</template>

<script setup>
import { useIdle } from '@vueuse/core'
import { watch } from 'vue'
import { useUserStore } from '@/stores/user';

const IDLE_TIME = Number(import.meta.env.VITE_IDLE_TIME_MS);
const REFRESH_TIME = Number(import.meta.env.VITE_TOKEN_REMAINING_REFRESH_MS);

const { idle, lastActive } = useIdle(IDLE_TIME);
const userStore = useUserStore();

console.log("dans le script setup");

watch(idle, (isIdle) => {

  if (isIdle) {
    console.log("Utilisateur inactif");
  } else {
    if (userStore.isConnected) {

      const remaining = userStore.getRemainingDelay();

      if (remaining <= 0) {
        userStore.logout();

      } else if (remaining < REFRESH_TIME) {
        userStore.refreshToken();

      } else {
        try {
          const payload = JSON.parse(atob(userStore.token?.split('.')[1]));

          const duration = (payload.exp - payload.iat) * 1000;

          userStore.runLogoutTimer(duration);

        } catch (err) {
          console.error("Erreur décodage token :", err);
        }
      }

    } else {
      console.log("Utilisateur non connecté");
    }
  }
});
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}
</style>
