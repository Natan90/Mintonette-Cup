<template>

    <section class="presentation">

    <span class="question">{{ $t('PresentationMintonette.title') }}</span>

    <span v-html="descri_evenement_texte"></span>

    </section>

</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "axios";


import { computed } from "vue"
import { useI18n } from "vue-i18n"

const { locale } = useI18n();
 
const content = ref('')
const selectedItem = ref(0)

const evenement = ref(null);
const title_evenement = ref('');
const colorTitle = ref('');
const descri_evenement_title = ref('');
const descri_evenement_texte = ref('');
const imagePreview = ref(null);

const selectedFont = ref(null);

watch(() => locale.value,
    (newLang) => {
        updateDescription();
    })

onMounted(async () => {
  try {
    await getValuesEvenement();
  } catch (err) {
    console.error(err);
  }
});


//=========================
//= Async functions event =
//=========================
async function getValuesEvenement() {
    try {
        const res = await axios.get("http://localhost:3000/admin/evenement/show");
        evenement.value = res.data;
        title_evenement.value = res.data.nom_evenement;
        colorTitle.value = res.data.color_title;
        selectedFont.value = res.data.text_font;
        imagePreview.value = res.data.image_evenement;

        updateDescription();
    } catch (err) {
        console.error(err);
    }
}

function updateDescription() {
    if (evenement.value?.descri_evenement?.[locale.value]) {
        descri_evenement_texte.value = evenement.value.descri_evenement[locale.value].texte;
        descri_evenement_title.value  = evenement.value.descri_evenement[locale.value].title;
    } else {
        descri_evenement_texte.value = '';
    }
}

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
    font-size: 2em;
    font-weight: bold;
    align-self: center ;
}
</style>

