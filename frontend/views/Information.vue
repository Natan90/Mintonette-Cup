<template>
    <NavView></NavView>
    
    <section class="pageInformation">
        
        <div class="titreInformation">
            <span>{{ $t("information.titre") }}</span>
        </div>

        <div class="informationrmation" v-for="(item, index) in informationArray" :key="index">
            <img class="illustration" :src="item.image" />
            <div class="textInformation">
                <span class="titreBloc">{{ item.nombre }} {{ item.title }}</span>
                <span class="textBloc" v-html="item.descri"></span>
            </div>
        </div>

    
    </section>
    <Footer></Footer>
</template>

<script setup>

import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// COMPOSANTS

import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

// IMAGES

import logoCouleur from "../images/logo-couleur.png";
import photoFond from "/photo_fond.png";
import photoFoule from "./../images/foule.jpg";
import photoStade from "./../images/stade.jpg";
import photoReseaux from "./../images/reseaux.jpg";

// TEXTE

const informationArray = computed(() => [
  {
    title: t("information.titleEdition"),
    descri: t("information.descriEdition"),
    image: logoCouleur,
    nombre: ''
  },
  {
    title: t("information.titleMillions"),
    descri: t("information.descriPratiquants"),
    image: photoFond,
    nombre: 760,
  },
  {
    title: t("information.titlePays"),
    descri: t("information.descriPays"),
    image: photoFoule,
    nombre: 200,
  },
  {
    title: t("information.titleMillions"),
    descri: t("information.descriAudience"),
    image: photoStade,
    nombre: 24,
  },
  {
    title: t("information.titleReseauxSociaux"),
    descri: t("information.descriReseauxSociaux"),
    image: photoReseaux,
    nombre: ''
  },
]);

</script>

<style scoped>

.pageInformation{
    width: calc(100% - 4em);
    
    display: flex;
    flex-direction: column;

    gap: 8em;
    padding: 100px 2em 200px 2em;

    color: var(--primary-color);
    background-color: var(--jaune-logo);

}

.titreInformation{
    width: 100%;
    text-align: center;
    
    font-weight: bold;
    font-size: 2.5em;
}

.informationrmation{

    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5em;
}

.informationrmation:nth-child(2n){
    flex-direction: row-reverse;
}

.illustration{
    max-width: 350px;
    max-height: 220px;
    object-fit: cover;

    border-radius: 30px 5px ;
}

.textInformation{
    max-width: 35%;


    display: flex;
    flex-direction: column;
}

.titreBloc{
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.5em;
    margin-bottom: 0.6em;
    padding: 0.2em 0;

    text-align: center;
    background-color: var(--primary-color);
    color: var(--jaune-logo);
}

.textBloc{
    text-indent: 1em;
    text-align: justify;
    font-size: 1.1em;
    font-weight: 400;
}

</style>