<template>

    <section class="presentation">

    <span class="question">{{ $t("PresentationMintonette.title") }}</span>

    <span
        v-for="(item, index) in presentationArray"
        :key="index"
        v-html="item.text"
    ></span>

    </section>

</template>

<script setup lang="ts">
import { ref } from "vue";


import { computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const presentationArray = computed(() => [
  { text: t("PresentationMintonette.texte1") },
  { text: t("PresentationMintonette.texte2") },
  { text: t("PresentationMintonette.texte3") },
  { text: t("PresentationMintonette.texte4") }
])
    
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
    font-size: 2em;
    font-weight: bold;
    align-self: center ;
}
</style>

