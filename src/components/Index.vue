<template>
    <div class="image">
        <img src="../images/Photo.webp" alt="">
      <div class="texteImage">
        Montpellier accueille la Mintonette Cup, le tournoi mondial de volley-ball qui rassemble les meilleurs joueurs !<br>
        changer l'image ( pas les bonnes couleurs )
      </div>

    </div>
  <div class="hover">
    <p>Hover moi </p>
    <div class="TuasHover">
      <p> Bravo tu as hover ca Chef ! </p>

    </div>
  </div>


</template>

<script setup>
import NavView from "@/components/NavView.vue";


</script>


<style>
    body{
    }
    .image {
    }
    .image img{
        width: 100%;
        height: 100%;
        margin-top: 1.5em;

    }

    .texteImage {
      font-size: 25px;
      text-align: center;
      align-items: center;
      justify-content: center;
      border: solid black 1px;
      border-radius: 10px;
      padding: 5px 10px;
      background: rgba(255, 255, 255, 0.4);
    }

    .hover p{
      border: solid black 1px;
      border-radius: 10px;
      padding: 5px 10px;
      max-width: 70px;
    }
    .hover p:hover{
      max-width: 500px;

    }
    .TuasHover{
      display: none;
    }
    .hover:hover .TuasHover {
      display: block;
    }

</style>