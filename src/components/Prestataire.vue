<script setup lang="ts">
import NavView from "@/components/NavView.vue";
</script>

<template>
  <NavView/>
  <div class="routeurLink">
    <router-link to="/" class="btnLink">Home</router-link>
    <router-link to="/Prestataire" class="btnLink">Prestataire (mode public)</router-link>
  </div>
  <br><br>
  <div class="Titre">
    <h1>Stand de Burger </h1>
  </div>
  <div class="route">
    <div class="ConteneurTexte">
      <p>
        Bonne nouvelle ! Le stand de burgers sera bel et bien présent lors de la Mintonette Cup.
        Vous pourrez y retrouver un large choix pour satisfaire toutes les envies : des burgers classiques savoureux,
        des recettes plus gourmandes, mais aussi des options végétariennes pour que chacun puisse en profiter.
        <br><br>
        Que vous soyez un amateur de viande ou adepte d’alternatives plus légères,
        tout le monde sera chaleureusement accueilli. C’est l’occasion idéale de partager
        un moment convivial autour d’un bon repas tout en profitant de l’événement !
      </p>
    </div>
    <div class="ConteneurImageBurger">
      <div class="imageBurger">
        <img src="../images/burger.jpg" alt="Burger">
      </div>
    </div>
  </div>
</template>

<style>
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

  background: #00167a;
  color: white;
}
.Titre{
  margin-left: 35px;
}
.route {
  display: flex;
  align-items: center;
  gap: 40px;
}
.ConteneurTexte {
  max-width: 800px;
  word-wrap: break-word;
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
