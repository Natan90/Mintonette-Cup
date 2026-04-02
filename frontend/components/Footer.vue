<template>
  <footer>
    <section class="remerciement" id="footer">
      <span>{{ $t("footer.remerciement") }}</span>
      <div class="logos">
        <span v-for="(item, index) in imgRemerciement">
          <img :src="item.image" />
        </span>
      </div>
    </section>
    <div 
      v-if="route.name !== 'Commentaire'"
      class="commentaireContenaire">
      <router-link class="commentaire" :to="{ name: 'Commentaire' }">
        <p>{{ $t("footer.noter") }}</p>
      </router-link>
    </div>
    <section class="groupes">
      <div class="groupe" v-for="(item, index) in footerArray" :key="index">
        <span>{{ item.title }}</span>

        <div class="elements">
          <span
            class="pointer"
            v-for="(item2, index2) in item.options"
            :key="index2">
            {{ item2.option }}
          </span>
        </div>
      </div>
    </section>

    <section>
      <div class="reseaux">
        <span v-for="(item, index) in imgReseaux">
          <img class="pointer" :src="item.image" />
        </span>
      </div>
    </section>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();

/* ********************
    IMAGES IMPORTS 
******************** */
import logoHerault from "../images/logo_herault.png";
import logoMontpellier from "../images/logo_montpellier.png";
import logoVNL from "../images/logo_vnl.jpg";
import logoFederationVolley from "../images/federation_volley.png";

import iconYoutube from "../images/icon_youtube.png";
import iconInstagram from "../images/icon_instagram.png";
import iconX from "../images/icon_x.png";
import iconFacebook from "../images/icon_facebook.png";

const { t } = useI18n();

const imgRemerciement = computed(() => [
  {
    image: logoHerault,
  },
  {
    image: logoMontpellier,
  },
  {
    image: logoVNL,
  },
  {
    image: logoFederationVolley,
  },
]);

const imgReseaux = computed(() => [
  {
    image: iconYoutube,
  },
  {
    image: iconInstagram,
  },
  {
    image: iconX,
  },
  {
    image: iconFacebook,
  },
]);

const footerArray = computed(() => [
  {
    title: t("footer.titlePrestataire"),
    options: [
      { option: t("footer.infoPrestataire1") },
      { option: t("footer.infoPrestataire2") },
    ],
  },
  {
    title: t("footer.titleProduit"),
    options: [
      { option: t("footer.infoProduit1") },
      { option: t("footer.infoProduit2") },
    ],
  },
  {
    title: t("footer.titleContact"),
    options: [
      { option: t("footer.infoContact1") },
      { option: t("footer.infoContact2") },
      { option: t("footer.infoContact3") },
    ],
  },
]);
</script>

<style scoped>
footer {
  width: 100%;
  background-color: black;

  padding: 20px 0;
}

.remerciement {
  display: flex;
  flex-direction: column;

  gap: 10px;

  margin: 0 30px 30px 30px;
}

.remerciement > span {
  text-align: center;
  font-weight: bold;
  color: white;
}

.logos {
  margin-top: 1.5em;
  margin-bottom: 2em;
  display: flex;
  justify-content: center;
  gap: 40px;
}

.logos img {
  width: 80px;
  height: 80px;
  background-color: white;
}

.groupes {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 15px;
}

.groupe {
  padding: 10px;
  background-color: none;
  border-radius: 10px;
  color: white;
}

.groupe > span {
  font-weight: bold;
}

.elements {
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5em;
}

.elements span {
  margin-left: 0.5em;
}

.elements span:hover {
  color: grey;
  transition: var(--transition-fast);
}

.reseaux {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 30px;
}

.reseaux img {
  width: 100%;
  width: 50px;

  opacity: 0.8;
}

.reseaux img:hover {
  opacity: 1;
  transition: var(--transition-fast);
}
.commentaireContenaire {
  background-color: black;
  text-align: center;
  margin-top: -35px;
  padding-bottom: 15px;
}

.commentaire {
  color: white;
  text-decoration: none;
  font-size: 24px;
  position: relative;
  display: inline-block;
}

.commentaire::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0px;
  width: 0%;
  height: 2px;
  background-color: var(--rose-hover);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.commentaire:hover::after {
  width: 110%;
}
</style>