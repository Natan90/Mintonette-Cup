<template>
    <nav class="barre-nav">
      <router-link to="/">
        <img src="../images/logo.png" alt="logo" id="logo">
      </router-link>
      <div class="log">
        <span>
          <button @click="changeLanguage('fr')"><img src="../images/france.png" alt="france" class="drapeau"></button> / 
          <button @click="changeLanguage('en')"><img src="../images/grande-bretagne.png" alt="grande-bretagne" class="drapeau"></button>
        </span>
        <span><strong><router-link to="/">Se connecter</router-link> / <router-link to="/utilisateurs/inscription">S'identifier</router-link></strong></span>
      </div>
    </nav>


</template>


<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function changeLanguage(lang) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}

const savedLang = localStorage.getItem('lang')
if (savedLang) locale.value = savedLang

</script>


<style>
body{
  margin: 0;
  height: 100vh;
  top: 0;
}
</style>

<style scoped>
.barre-nav{
  padding: 0;
  background-color: #00167a;
  display: flex;
  justify-content: space-between; /*space-around*/
  color: white;
  font-size: 1.2em;
  width: 100%;
}
#logo{
  height: 100px;
}
.log{
  align-content: center;
}
.log span{
  padding: 0px 25px;
}
.drapeau{
  height: 25px;
  width: 40px;
}

</style>