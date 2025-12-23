<template>
    <NavView id="nav_bar"></NavView>
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
                                <input type="checkbox" :id="`item-${index}`" :value="index"
                                    @change="onCheckChange($event, item.nom, index)"
                                    :checked="isCheckedWithIndex(index)" :disabled="continueInscription"></input>
                                <label :for="`item-${index}`">{{ item.nom }}</label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="message_error" v-if="!continueInscription || !pathAdd">
        <p>{{ errorMessageCheckBox }}</p>
    </div>

    <div class="button_container" v-if="!continueInscription && pathAdd">
        <button @click.prevent="showContinueInscription" :disabled="!isSelectionValid"
            :class="{ disabled: !isSelectionValid }">
            Continuer l'inscription
        </button>
    </div>
    <div class="button_container" v-if="continueInscription && pathAdd">
        <button @click.prevent="hideContinueInscription">
            Retour
        </button>
    </div>

    <div class="prestataire_container" v-if="continueInscription || !pathAdd" id="presta_container">
        <div class="editor_container">
            <div class="form_group">
                <label for="nom">Nom de la prestation :</label>
                <input type="text" id="nom" v-model="nom_presta" />
            </div>

            <div class="form_group">
                <label>Description détaillée :</label>
                <Editor v-model="descri_presta" api-key="sd8q04ss2q9ej9zg4jvcgu10p2mxdckx4rgnbbhdrojqrgpo" :init="{
                    height: 300,
                    menubar: false,
                    plugins: 'lists link image code',
                    toolbar: 'undo redo | bold italic underline | bullist numlist | code',
                    branding: false
                }" />
            </div>

            <div class="form_group">
                <label for="participants">Nombre maximum de participants :</label>
                <input type="number" id="participants" v-model="nb_participants" min="1" />
            </div>

            <div class="form_group">
                <label for="tarif">Tarif :</label>
                <input type="number" id="tarif" v-model="tarif_presta" />
            </div>

            <div class="form_group">
                <label for="contact">Email :</label>
                <input type="text" id="contact" v-model="mail_presta" placeholder="mail@example.com" />
            </div>

            <div class="form_group">
                <label for="contact">Téléphone :</label>
                <input type="tel" pattern="^0[1-9][0-9]{8}$" id="contact" v-model="tel_presta"
                    placeholder="0123456789" />
            </div>

            <div v-if="message" class="message" :class="messageType === 'error' ? 'message-error' : 'message-success'">
                <span class="text">{{ message }}</span>
            </div>


            <div class="button_container" v-if="!pathAdd">
                <button @click="updatePresta">Modifier</button>
            </div>
            <div class="button_container" v-else>
                <button @click="addPrestataire">S’inscrire</button>
            </div>

            <div class="button_container">
                <button @click="delPresta">Supprimer</button>
            </div>
        </div>
    </div>
    <Footer></Footer>

</template>

<script setup>
import NavView from '@/components/NavView.vue';
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { useUserStore } from '@/stores/user';
import { useRoute } from "vue-router";
import axios from 'axios';

import Editor from "@tinymce/tinymce-vue";
import Footer from '@/components/Footer.vue';


const userStore = useUserStore();
const route = useRoute();

const prestaId = computed(() => route.params.id);
const pathAdd = computed(() => route.name === "AddPrestataire");

const message = ref('');
const messageType = ref('success');


//=========================
//=== Type prestataire ====
//=========================
const type_prestataire = ref([]);
const type_animation = ref([]);
const type_restauration = ref([]);
const type_boutique = ref([]);


const selectedType = ref("animation");
const selectedTypeId = ref(1);
const continueInscription = ref(false);
const checkedItems = ref([]);


//=========================
//===== Inputs fields =====
//=========================
const nom_presta = ref('');
const descri_presta = ref('');
const nb_participants = ref(1);
const tarif_presta = ref(0);
const mail_presta = ref('');
const tel_presta = ref('');

const errorMessageCheckBox = ref('Veuillez sélectionner une option.');

const selectedNames = computed(() => checkedItems.value.map(item => item.nom));

const isSelectionValid = computed(() => {
    return checkedItems.value.length == 1;
});

onMounted(async () => {
    try {
        await fetchTypePresta();
        await fetchEveryType();
        if (!pathAdd.value)
            await getValuesPrestataire();
    } catch (err) {
        console.error(err);
    }
});

watch(checkedItems, (newValue) => {
    if (newValue.length === 0) {
        errorMessageCheckBox.value = 'Veuillez sélectionner une option.'
    }
    else if (newValue.length > 1) {
        errorMessageCheckBox.value = 'Veuillez sélectionner une seule option.'
    }
    else {
        errorMessageCheckBox.value = '';
    }
})


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


function isCheckedWithIndex(index) {
    return checkedItems.value.some(i => i.index === index);
}

function onCheckChange(event, nom, index) {
    if (event.target.checked) {
        checkedItems.value.push({ nom, index });
    } else {
        checkedItems.value = checkedItems.value.filter(i => i.index !== index);
    }
}

function showContinueInscription() {
    continueInscription.value = true;

    nextTick(() => {
        const element = document.getElementById("presta_container");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    });
}

function hideContinueInscription() {
    continueInscription.value = false;

    nextTick(() => {
        const element = document.getElementById("nav_bar");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    });
}


function selectTypePresta(index) {
    const typeObj = type_prestataire.value[index];
    if (typeObj) {
        selectedType.value = typeObj.nom_type_prestataire.toLowerCase();
        selectedTypeId.value = typeObj.id_type_prestataire;
    }
}

function becomePresta() {
    userStore.setPresta();
}

function delPresta() {
    userStore.delPresta();
}

//=========================
//= Async functions types =
//=========================
async function fetchTypePresta() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
        type_prestataire.value = res.data.map(item => ({ ...item, inBox: false }));
    } catch (err) {
        console.error(err);
    }
}

async function fetchEveryType() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showEveryType");
        type_animation.value = res.data.animations;
        type_restauration.value = res.data.restaurations;
        type_boutique.value = res.data.boutiques;
    } catch (err) {
        console.error(err);
    }
}


//==========================
//= Async functions presta =
//==========================
async function getValuesPrestataire() {
    if (prestaId.value === null) return;

    try {
        const res = await axios.get(`http://localhost:3000/prestataire/show/${prestaId.value}`);
        const presta = res.data;

        nom_presta.value = presta.nom_prestataire;
        descri_presta.value = presta.descri_prestataire;
        nb_participants.value = presta.nb_participants;
        tarif_presta.value = presta.tarif_prestataire;
        mail_presta.value = presta.mail_prestataire;
        tel_presta.value = presta.tel_prestataire;

        const typeObj = type_prestataire.value.find(t => t.id_type_prestataire === presta.type_prestataire_id);
        if (typeObj) {
            selectedType.value = typeObj.nom_type_prestataire.toLowerCase();
            selectedTypeId.value = typeObj.id_type_prestataire;
        }
        await nextTick();

        let spec = presta.specificite;

        // Pour suppirmer tous les trucs chiants
        if (typeof spec === 'string') {
            spec = spec.replace(/[\{\}"]/g, '').trim();
        }

        const index = selectedItems.value.findIndex(
            item => item.nom.trim().toLowerCase() === spec.toLowerCase()
        );
        if (index !== -1) {
            checkedItems.value = [{ nom: selectedItems.value[index].nom, index }];
        } else {
            checkedItems.value = [];
        }

        console.log("selectedItems :", selectedItems.value);
        console.log(presta.specificite);

    } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
    }
}

async function addPrestataire() {
    try {
        const res = await axios.post(`http://localhost:3000/prestataire/becomePrestataire/${prestaId.value}`, {
            nom: nom_presta.value,
            descri: descri_presta.value,
            nb_participants: Number(nb_participants.value),
            tarif: Number(tarif_presta.value),
            mail: mail_presta.value,
            tel: tel_presta.value,
            specificite: selectedNames.value,
            type: Number(selectedTypeId.value)
        });
        becomePresta();
        message.value = res.data.message;
        messageType.value = "success";
    } catch (err) {
        if (err.response && err.response.data) {
            message.value = err.response.data.error;
        } else {
            message.value = "Erreur inconnue";
        }
        messageType.value = 'error';
    }
}


async function updatePresta() {
    try {
        const res = await axios.post(`http://localhost:3000/prestataire/updatePresta/${prestaId.value}`, {
            nom: nom_presta.value,
            descri: descri_presta.value,
            nb_participants: Number(nb_participants.value),
            tarif: Number(tarif_presta.value),
            mail: mail_presta.value,
            tel: tel_presta.value,
            specificite: selectedNames.value,
            type: Number(selectedTypeId.value)
        });
        message.value = res.data.message;
        messageType.value = "success";
    } catch (err) {
        if (err.response && err.response.data) {
            message.value = err.response.data.error;
        } else {
            message.value = "Erreur inconnue";
        }
        messageType.value = 'error';
    }
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

.button_container button.disabled::after {
    content: none;
    transition: none;
}

.button_container button.disabled:hover {
    transform: none;
    box-shadow: none;
}

.button_container button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.prestataire_container {
    display: flex;
    justify-content: center;
    padding-top: 80px;
    width: 100%;
    box-sizing: border-box;
}

.editor_container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 800px;
    margin: auto;
    margin-top: 60px;
}

.tox-tinymce {
    width: 100% !important;
}

.form_group label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
}

.form_group input,
.form_group select {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.form_group button {
    padding: 12px 20px;
    background: linear-gradient(135deg, #f7c325, #ffdb59);
    color: #0a1d42;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

.form_group button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(247, 195, 37, 0.4);
}

.message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    margin-top: 10px;
    animation: fadeIn 0.3s ease;
}

.message-success {
    background: #e6f9f0;
    color: #0f7a4a;
    border: 1px solid #5ad39c;
}

.message-error {
    background: #fdecea;
    color: #b42318;
    border: 1px solid #f5a3a3;
}

.message_error {
    display: flex;
    justify-content: center;
    color: red;
    font-weight: bold;
    font-size: 1.2em;
}
</style>
