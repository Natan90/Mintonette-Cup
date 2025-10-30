<template>
  <NavView/>
  <div class="routeurLink">
    <router-link to="/" class="btnLink">Home</router-link>
  </div>
  <br><br>
  <div class="Titre">
    <h1>{{ $t('burgerStand.title') }}</h1>
  </div>
  <div class="route">
    <div class="ConteneurTexte">
      <p style="white-space: pre-line">
        {{ $t('burgerStand.description') }}
      </p>
    </div>
    <div class="ConteneurImageBurger">
      <div class="imageBurger">
        <img src="../images/burgerImage.png" alt="Burger">
      </div>
    </div>
  </div>
  <br><br><br><br><br>
  <div class="SuiteTexte">
    <h2>{{ $t('services.title') }}</h2>
    <div class="Service">

  <span v-for="(elt, index) in photo" :key="index">
      <span :id="'id' + index" class="Photo">
            <router-link :to = "elt.link">
        <p>{{ $t(`services.actions.${index}`) }}</p>
       <img :src="elt.chemin"  alt="Photo">
              </router-link>
      </span>
    </span>
      </div >
    </div>
  <Footer></Footer>

</template>


<script setup>
import NavView from "@/components/NavView.vue";
import { ref } from "vue"
import Footer from "@/components/Footer.vue";

const photo = [
  { chemin: new URL('../images/Commander.jpg', import.meta.url).href, link:"/Commander" },
  { chemin: new URL('../images/Reserver.jpg', import.meta.url).href, link:"/Reserver" }

]
</script>




<style>
body::-webkit-scrollbar {
  display: none;
}

.Service{
  display: flex;
  text-align: center;
  gap: 15px;
  border: solid black 1px;

}


[id^="servicePrestataire"] {
  padding : 25px;
  font-size: 25px;

}
.link{
  text-decoration: none;
  color: black;

}

.Service :hover{
  -webkit-transition: all 1s ease;
  -webkit-transform:scale(1.05);
}
.servicePrestataire1, .servicePrestataire2{
  border: solid 1px black ;
  border-radius: 15px;
}
.SuiteTexte{
  margin-left: 35px;
}
.routeurLink {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  border-radius: 20px;
}

.btnLink {
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #333;
  background: #f8e16c;
  color: black;
  font-weight: bold;
  transition: 0.3s;
}

.btnLink:hover {
  background: var(--primary-color);
  color: white;
}
.Titre{
  margin-left: 35px;
}
.route {
  display: flex;
  align-items: center;
  gap: 100px;
}
.ConteneurTexte {
  max-width: 800px;
  margin-left: 35px;
  line-height: 1.5;
  text-align: justify;
}
.ConteneurImageBurger{
  max-width: 500px;
  align-items: end;
}
.imageBurger{
  width: 350px;
}
</style>
