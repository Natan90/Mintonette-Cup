<template>

    <section class="presentation">
        <span class="question">QUI SOMMES NOUS ?</span>

        <span>
            Le grand <b>tournoi de Volley mondial</b> Mintonette Cup arrive <b>à Montpellier</b> !
            Notre deuxième édition édition s'annonce folle.
        </span>

        <span>
            Vous êtes <b>adèpte de sport</b>, aimez suivre de <b>grands évenements sportifs</b> qui
            regroupent <b>passionnés</b> et <b>bonne ambiance</b> ?
            <b>La Mintonnette Cup vous attend !</b>
        </span>

        <span>
            Au programmes : des <b>matchs époustouflants</b>, un <b>public de folie</b> et une
            <b>ambiance débordante</b>.
        </span>

        <span>
            On vous attends dans les gradins !
        </span>

    </section>

</template>

<script setup lang="ts">
import { ref } from "vue";

    
const content = ref('')
const selectedItem = ref(0)

</script>

<style>
.presentation {
    width: 70%;
    margin: 30px 15%;

    display: flex;
    flex-direction: column;
    gap: 5px;

    text-align: justify;

}

.question {
    font-weight: bold;
    align-self: center ;
}
</style>