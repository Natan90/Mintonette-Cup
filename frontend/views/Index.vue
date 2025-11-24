<template>
  <NavView :style="{ top: navbar }" class="navbar" />

  <div class="image">
    <div class="texteImage">
      Mintonette Cup
      <!-- {{ $t("mintonetteCup.title") }} -->
    </div>
  </div>

  <div class="fondBlanc">
    <Map></Map>

    <section class="infos">

      <div class="bloc">
        <img class="illustration" src="./../images/logo-couleur.png" />

        <div class="contenuTexte">
          <span class="title">{{ $t('blocInfo.titleEdition') }}</span>

          <!-- <span class="descri">
            <p v-html="$t('blocInfo.descriEdition')"></p>
          </span> -->
          <span class="descri">
            <strong>Ca fait tellement viellot (2008 je dirais)</strong>.
          </span>

          <div class="voirPlus">
            <span class="pointer">{{ $t('blocInfo.voirPlus') }}</span>
          </div>
        </div>
      </div>

      <div class="bloc">
        <img class="illustration" src="./../images/photo_fond.png" />

        <div class="contenuTexte">
          <span class="title">
            <countUp :from="0" :to="760" :duration="2" class="count-up-text" /> {{ $t('blocInfo.titleMillions') }}
          </span>

          <span class="descri">
            <p v-html="$t('blocInfo.descriPratiquants')"></p>
          </span>

          <div class="voirPlus">
            <span class="pointer">{{ $t('blocInfo.voirPlus') }}</span>
          </div>
        </div>
      </div>

      <div class="bloc">
        <img class="illustration" src="./../images/logo-couleur.png" />

        <div class="contenuTexte">
          <span class="title">
            <countUp :from="0" :to="200" :duration="2" class="count-up-text" /> {{ $t('blocInfo.titlePays') }}
          </span>

          <span class="descri">
            <p v-html="$t('blocInfo.descriPays')"></p>
          </span>

          <div class="voirPlus">
            <span class="pointer">{{ $t('blocInfo.voirPlus') }}</span>
          </div>
        </div>
      </div>

      <div class="bloc">
        <img class="illustration" src="./../images/logo-couleur.png" />

        <div class="contenuTexte">
          <span class="title">
            <countUp :from="0" :to="24" :duration="2" class="count-up-text" /> {{ $t('blocInfo.titleMillions') }}
          </span>

          <span class="descri">
            <p v-html="$t('blocInfo.descriAudience')"></p>
          </span>

          <div class="voirPlus">
            <span class="pointer">{{ $t('blocInfo.voirPlus') }}</span>
          </div>
        </div>
      </div>

      <div class="bloc">
        <img class="illustration" src="./../images/logo-couleur.png" />

        <div class="contenuTexte">
          <span class="title">{{ $t('blocInfo.titleReseauxSociaux') }}</span>

          <span class="descri">
            <p v-html="$t('blocInfo.descriReseauxSociaux')"></p>
          </span>

          <div class="voirPlus">
            <span class="pointer">{{ $t('blocInfo.voirPlus') }}</span>
          </div>
        </div>
      </div>

    </section>

    <div class="presta_formulaire">
      <ListPresta></ListPresta>
      <Formulaire></Formulaire>
    </div>

  </div>

  <Footer></Footer>
</template>


<script setup>
import NavView from "@/components/NavView.vue";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";
import TableauMatchs from "../views/TableauMatchs.vue";
import ListPresta from "./ListPresta.vue";
import Formulaire from "./Formulaire.vue";
import CountUp from "./../components/countUp.vue";


const navbar = ref("0px");

const handleScroll = () => {
  if (window.scrollY > 500) {
    navbar.value = "-100px";
  } else {
    navbar.value = "0px";
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>


<style>
body::-webkit-scrollbar {
  display: none;
}
</style>

<style scoped>
.pointer {
  cursor: pointer;
}

.navbar {
  position: fixed;
  left: 0;
  right: 0;
  height: 100px;
  transition: top 0.5s ease;
  z-index: 999;
}

.image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url("../images/photo_fond.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  filter: brightness(0.7);
  z-index: -1;
}

.fondBlanc {
  width: 90%;
  margin: auto;
  background: white;
  position: relative;
  margin-top: 100vh;
  padding-top: 50px;
  z-index: 10;
  border-radius: 20px;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.2);
  padding-bottom: 10%;
}

.texteImage {
  z-index: 1;
  font-size: 5em;
  text-align: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  border-radius: 10px;
  padding: 5px 10px;
  font-family: 'Meie Script';
}

.infos {
  display: flex;
  flex-direction: column;
  gap: 80px;
  width: 90%;
  margin: 50px auto;
}

.bloc {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;
}

.bloc:nth-child(even) {
  flex-direction: row-reverse;
}

.illustration {
  width: 40%;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contenuTexte {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 600px;
}

.title {
  font-weight: 700;
  font-size: 2em;
  color: var(--bleu-logo);
}

.descri {
  font-size: 1.1em;
  line-height: 1.6;
}

.voirPlus {
  color: var(--bleu-logo);
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

@media (max-width: 900px) {

  .bloc,
  .bloc:nth-child(even) {
    flex-direction: column;
  }

  .illustration {
    width: 100%;
  }

  .contenuTexte {
    text-align: center;
    max-width: 100%;
  }

  .title {
    font-size: 1.7em;
  }

  .descri {
    font-size: 1em;
  }
}

.presta_formulaire {
  background: linear-gradient(135deg,
      var(--colorGradientBlue),
      var(--colorGradientGreen));
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
