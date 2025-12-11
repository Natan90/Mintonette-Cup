<template>
    <NavView></NavView>
    <div class="container">
        <div class="title">
            <p>Devenez membre à part de la Mintonette Cup ! </p>
        </div>
        <div class="content">
            <div class="subtitle">
                <p>Votre rôle dans l’événement : choisissez votre catégorie :</p>
            </div>
            <div class="type_prestataire">
                <div v-for="(item, index) in type_prestataire" :key="index" class="boite_type_presta"
                    :id="`p-${index}`">
                    <button class="button_type_presta" @click="selectTypePresta(index)">
                        {{ item.nom_type_prestataire }}
                    </button>
                </div>
            </div>
            <div v-if="selectedType" class="container_table">
                <h1>Quel est votre type {{ selectedTypeLabel }} ?</h1>
                <table class="table_type_presta">
                    <tbody>
                        <tr v-for="(item, index) in selectedItems" :key="index" class="table-row">
                            <td>
                                <input type="checkbox" :id="`item-${index}`"></input>
                                <label :for="`item-${index}`">{{ item.nom }}</label>
                            </td>
                        </tr>
                        <tr>
                            <td class="other-option">
                                <input type="checkbox" id="other" />
                                <label for="other">Autre</label>
                                <input type="text" />
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>
    </div>

    <div class="button_container" v-if="!continueInscription">
        <button @click.prevent="showContinueInscription">
            Inscription prestataire
        </button>
    </div>

    <div class="prestataire_container" v-if="continueInscription" id="presta_container">
        <PrestatairePresta></PrestatairePresta>
    </div>

    <Footer></Footer>

</template>

<script setup>
import NavView from '@/components/NavView.vue';
import { ref, onMounted, computed, nextTick } from "vue";
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import PrestatairePresta from './PrestatairePresta.vue';
import Footer from '@/components/Footer.vue';


const userStore = useUserStore();
const type_animation = ref([]);
const type_restauration = ref([]);
const type_boutique = ref([]);

const type_prestataire = ref([]);
const selectedType = ref("animation");
const continueInscription = ref(false);

const selectedItems = computed(() => {
    switch (selectedType.value) {
        case "animation":
            return type_animation.value.map(item => ({ nom: item.nom_type_animation }));
        case "boutique":
            return type_boutique.value.map(item => ({ nom: item.nom_type_boutique }));
        case "reservation":
            return type_restauration.value.map(item => ({ nom: item.nom_type_restauration }));
        default:
            return [];
    }
});

const selectedTypeLabel = computed(() => {
    switch (selectedType.value) {
        case "animation":
            return "d'animation";
        case "boutique":
            return "de boutique";
        case "reservation":
            return "de restauration";
        default:
            return "";
    }
});

function showContinueInscription() {
    continueInscription.value = true;

    nextTick(() => {
    const element = document.getElementById("presta_container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  });
}


function becomePresta() {
    userStore.setPresta();
}


onMounted(async () => {
    try {
        fetchTypePresta();
        fetchTypeAnimation();
    } catch (err) {
        console.error(err);
    }
});

async function fetchTypePresta() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
        type_prestataire.value = res.data.map(item => ({ ...item, inBox: false }));
    } catch (err) {
        console.error(err);
    }
}

async function fetchTypeAnimation() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showEveryType");
        type_animation.value = res.data.animations;
        type_restauration.value = res.data.restaurations;
        type_boutique.value = res.data.boutiques;
    } catch (err) {
        console.error(err);
    }
}

function selectTypePresta(index) {
    const types = ["animation", "boutique", "reservation"];
    selectedType.value = types[index] || null;
}

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #0a1d42;
}

.title p {
    text-align: center;
    font-size: 2.5em;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--primary-color);
}

.subtitle p {
    font-size: 1.3em;
    text-align: center;
    margin-bottom: 30px;
    color: black;
}

.type_prestataire {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
}

.button_type_presta {
    background: linear-gradient(135deg, #f7c325, #ffdb59);
    color: #0a1d42;
    font-weight: 700;
    font-size: 1.1em;
    padding: 15px 30px;
    border: none;
    border-radius: 30px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 6px 15px rgba(247, 195, 37, 0.4);
    transition: all 0.3s ease;
}

.button_type_presta:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 0 20px rgba(247, 195, 37, 0.6), 0 0 8px rgba(247, 195, 37, 0.4) inset;
}

.button_type_presta:active {
    transform: translateY(2px) scale(0.98);
    box-shadow: 0 3px 10px rgba(0, 87, 255, 0.3);
}

.container_table {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.table_type_presta {
    width: 400px;
    max-width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.table_type_presta td {
    padding: 15px 20px;
    font-size: 1em;
}

.table-row {
    border-bottom: 1px solid #e0e0e0;
}

.table-row:last-child {
    border-bottom: none;
}

.other-option {
    display: flex;
    align-items: center;
    gap: 10px;
}

.other-option input[type="text"] {
    flex: 1;
    padding: 6px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.container_table h1 {
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #1b2e59;
}

.button_container {
    display: flex;
    justify-content: center;
}

.button_container button {
    margin: 30px 0px;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    font-size: 1.2em;
    padding: 15px 40px;
    border: none;
    border-radius: 50px;
    background: var(--primary-color);
    box-shadow: 0 8px 20px rgba(0, 87, 255, 0.4);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.button_container button::after {
    content: '';
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-25deg);
    transition: all 0.5s ease;
}

.button_container button:hover::after {
    left: 125%;
}

.button_container button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 25px var(--primary-color);
}

.prestataire_container {
  padding-top: 80px;
  width: 100%;
  box-sizing: border-box;
}

</style>
