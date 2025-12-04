<template>
  <footer>
    <section class="remerciement">
        <span>{{ $t("footer.remerciement") }}</span>
        <div class="logos" >
            <span v-for="(item,index) in imgRemerciement">
                <img :src="item.image"/>
            </span>
        </div>

    </section>

    <section class="groupes">

    <div class="groupe" v-for="(item,index) in footerArray" :key="index">
        <span>{{ item.title }}</span>

        <div class="elements">
        <span 
            class="pointer"
            v-for="(item2, index2) in item.options"
            :key="index2"
        >
            {{ item2.option }}
        </span>
        </div>
    </div>

    </section>


    <section>
        <div class="reseaux">
            <img class="pointer" src="../images/icon_youtube.svg" />
            <img class="pointer" src="../images/icon_instagram.svg" />
            <img class="pointer" src="../images/icon_x.svg" />
            <img class="pointer" src="../images/icon_facebook.svg" />
        </div>
    </section>
  </footer>
</template>

<style scoped>

.pointer{
  cursor: pointer;
}

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

.remerciement>span {
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

.groupe>span {
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

    background-color: white;

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
</style>

<script setup>

import { computed } from "vue";
import { useI18n } from "vue-i18n";

/* ********************
    IMAGES IMPORTS 
******************** */
import logoHerault from "../images/logo_herault.png";
import logoMontpellier from "../images/logo_montpellier.png";
import logoVNL from "../images/logo_vnl.jpg";
import logoFederationVolley from "../images/federation_volley.png";

import iconYoutube from "../images/icon_youtube.svg";
import iconInstagram from "../images/icon_instagram.svg";
import iconX from "../images/icon_x.svg";
import iconFacebook from "../images/icon_facebook.svg";



const { t } = useI18n();

const imgRemerciement=computed(()=>[
    {
        image: logoHerault
    },
    {
        image: logoMontpellier
    },
    {
        image: logoVNL
    },
    {
        image: logoFederationVolley
    }
]);

const footerArray = computed(() => [
  {
    title: t("footer.titlePrestataire"),
    options: [
      { option: t("footer.infoPrestataire1") },
      { option: t("footer.infoPrestataire2") }
    ]
  },
  {
    title: t("footer.titleProduit"),
    options: [
      { option: t("footer.infoProduit1") },
      { option: t("footer.infoProduit2") }
    ]
  },
  {
    title: t("footer.titleContact"),
    options: [
      { option: t("footer.infoContact1") },
      { option: t("footer.infoContact2") },
      { option: t("footer.infoContact3") }
    ]
  }
])

</script>